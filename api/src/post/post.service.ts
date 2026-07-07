import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { VoteDto } from './dto/vote.dto';
import { Prisma, VoteType } from 'generated/prisma/client';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async create(userId: string, createPostDto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        content: createPostDto.content,
        authorId: userId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return {
      post: {
        ...post,
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        commentCount: 0,
      },
    };
  }

  async findAll(
    userId?: string,
    filterUserId?: string,
    cursor?: string,
    take = 5,
  ) {
    const posts = await this.prisma.post.findMany({
      where: {
        ...(filterUserId && { authorId: filterUserId }),
      },
      take: take + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        votes: {
          select: {
            type: true,
            userId: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { comments: true } },
      },
    });

    const hasNextPage = posts.length > take;
    const data = hasNextPage ? posts.slice(0, -1) : posts;

    return {
      posts: data.map(({ votes, _count, ...post }) => ({
        ...post,
        commentCount: _count.comments,
        upvotes: votes.filter((v) => v.type === VoteType.UPVOTE).length,
        downvotes: votes.filter((v) => v.type === VoteType.DOWNVOTE).length,
        userVote: votes.find((v) => v.userId === userId)?.type ?? null,
        canEdit: post.author.id === userId,
        canDelete: post.author.id === userId,
      })),
      nextCursor: hasNextPage ? data[data.length - 1].id : null,
    };
  }

  async findOne(postId: string, userId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        votes: {
          select: {
            type: true,
            userId: true,
          },
        },
        _count: { select: { comments: true } },
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    const { votes, _count, ...rest } = post;

    return {
      post: {
        ...rest,
        commentCount: _count.comments,
        upvotes: votes.filter((v) => v.type === VoteType.UPVOTE).length,
        downvotes: votes.filter((v) => v.type === VoteType.DOWNVOTE).length,
        userVote: votes.find((v) => v.userId === userId)?.type ?? null,
      },
    };
  }

  async update(userId: string, postId: string, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId)
      throw new ForbiddenException('Cannot update post');

    const updatedPost = await this.prisma.post.update({
      where: { id: postId, authorId: userId },
      data: updatePostDto,
      select: {
        id: true,
        content: true,
      },
    });

    return { post: updatedPost };
  }

async remove(userId: string, postId: string) {
  const post = await this.prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true, images: { select: { url: true } } },
  });

  if (!post) throw new NotFoundException('Post not found');
  if (post.authorId !== userId)
    throw new ForbiddenException('Cannot remove post');

  await this.prisma.post.delete({ where: { id: postId, authorId: userId } });

  await Promise.allSettled(
    post.images.map((img) => this.s3Service.deleteFile(img.url)),
  );

  return { post: { id: postId } };
}

  async vote(userId: string, postId: string, voteDto: VoteDto) {
    try {
      return this.prisma.$transaction(async (tx) => {
        const postVote = await tx.postVote.findUnique({
          where: { userId_postId: { userId, postId } },
        });

        let userVote: VoteType | null = null;

        if (!postVote) {
          await tx.postVote.create({
            data: { type: voteDto.type, userId, postId },
          });
          userVote = voteDto.type;
        } else if (postVote.type === voteDto.type) {
          await tx.postVote.delete({
            where: { userId_postId: { userId, postId } },
          });
          userVote = null;
        } else {
          await tx.postVote.update({
            where: { userId_postId: { userId, postId } },
            data: { type: voteDto.type },
          });
          userVote = voteDto.type;
        }

        const [upvotes, downvotes] = await Promise.all([
          tx.postVote.count({ where: { postId, type: VoteType.UPVOTE } }),
          tx.postVote.count({ where: { postId, type: VoteType.DOWNVOTE } }),
        ]);

        return { post: { id: postId, upvotes, downvotes, userVote } };
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundException('Post not found');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async addImage(postId: string, file: Express.Multer.File) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const imageUrl = await this.s3Service.uploadFile(file);

    const image = await this.prisma.postImage.create({
      data: {
        url: imageUrl,
        postId,
      },
      select: {
        id: true,
        url: true,
        createdAt: true,
      },
    });

    return { image };
  }
}
