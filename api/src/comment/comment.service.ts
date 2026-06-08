import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { VoteDto } from 'src/post/dto/vote.dto';
import { VoteType } from 'generated/prisma/enums';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    if (createCommentDto.parentId) {
      const parent = await this.prisma.comment.findUnique({
        where: { id: createCommentDto.parentId },
        select: { postId: true },
      });
      if (!parent) throw new NotFoundException('Comment not found');
      if (parent.postId !== postId)
        throw new BadRequestException('Comment does not belong to this post');
    }

    const comment = await this.prisma.comment.create({
      data: {
        ...createCommentDto,
        authorId: userId,
        postId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        parentId: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return {
      comment: {
        ...comment,
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        replyCount: 0,
      },
    };
  }

  async findAll(postId: string, userId?: string, cursor?: string, take = 5) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    const comments = await this.prisma.comment.findMany({
      where: { postId, parentId: null },
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
        _count: { select: { replies: true } },
      },
    });

    const hasNextPage = comments.length > take;
    const data = hasNextPage ? comments.slice(0, -1) : comments;

    return {
      comments: data.map(({ votes, _count, ...comment }) => ({
        ...comment,
        replyCount: _count.replies,
        upvotes: votes.filter((v) => v.type === VoteType.UPVOTE).length,
        downvotes: votes.filter((v) => v.type === VoteType.DOWNVOTE).length,
        userVote: votes.find((v) => v.userId === userId)?.type ?? null,
        canDelete: comment.author.id === userId,
        canEdit:comment.author.id === userId
      })),
      nextCursor: hasNextPage ? data[data.length - 1].id : null,
    };
  }

  async update(userId: string, commentId: string, dto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true, postId: true },
    });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== userId)
      throw new ForbiddenException('Cannot update comment');

    const updatedComment = await this.prisma.comment.update({
      where: { id: commentId },
      data: dto,
      select: {
        id: true,
        content: true,
      },
    });

    return { comment: updatedComment };
  }

  async remove(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true, postId: true },
    });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== userId)
      throw new ForbiddenException('Cannot remove comment');

    await this.prisma.comment.delete({
      where: { id: commentId, authorId: userId },
    });

    return { comment: { id: commentId } };
  }

  async findReplies(
    commentId: string,
    userId?: string,
    cursor?: string,
    take = 10,
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    const replies = await this.prisma.comment.findMany({
      where: { parentId: commentId },
      take: take + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        parentId: true,
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
        _count: { select: { replies: true } },
      },
    });

    const hasNextPage = replies.length > take;
    const data = hasNextPage ? replies.slice(0, -1) : replies;

    return {
      comments: data.map(({ votes, _count, ...reply }) => ({
        ...reply,
        replyCount: _count.replies,
        upvotes: votes.filter((v) => v.type === VoteType.UPVOTE).length,
        downvotes: votes.filter((v) => v.type === VoteType.DOWNVOTE).length,
        userVote: votes.find((v) => v.userId === userId)?.type ?? null,
      })),
      nextCursor: hasNextPage ? data[data.length - 1].id : null,
    };
  }

  async vote(userId: string, commentId: string, voteDto: VoteDto) {
    try {
      return this.prisma.$transaction(async (tx) => {
        const commentVote = await tx.commentVote.findUnique({
          where: { userId_commentId: { userId, commentId } },
        });

        let userVote: VoteType | null = null;

        if (!commentVote) {
          await tx.commentVote.create({
            data: { type: voteDto.type, userId, commentId },
          });
          userVote = voteDto.type;
        } else if (commentVote.type === voteDto.type) {
          await tx.commentVote.delete({
            where: { userId_commentId: { userId, commentId } },
          });
          userVote = null;
        } else {
          await tx.commentVote.update({
            where: { userId_commentId: { userId, commentId } },
            data: { type: voteDto.type },
          });
          userVote = voteDto.type;
        }

        const [upvotes, downvotes] = await Promise.all([
          tx.commentVote.count({ where: { commentId, type: VoteType.UPVOTE } }),
          tx.commentVote.count({
            where: { commentId, type: VoteType.DOWNVOTE },
          }),
        ]);

        return { comment: { id: commentId, upvotes, downvotes, userVote } };
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundException('Comment not found');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
