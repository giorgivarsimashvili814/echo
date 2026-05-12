import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId)
      throw new BadRequestException('Cannot follow yourself');

    const user = await this.prisma.user.findUnique({
      where: { id: followingId },
    });
    if (!user) throw new NotFoundException('User not found');

    const follows = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    if (!follows) {
      await this.prisma.follow.create({ data: { followerId, followingId } });
    } else {
      await this.prisma.follow.delete({
        where: { followerId_followingId: { followerId, followingId } },
      });
    }

    return { message: 'success' };
  }

  async findFollowers(
    userId: string,
    requestingUserId?: string,
    cursor?: string,
    take = 20,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const followers = await this.prisma.follow.findMany({
      where: { followingId: userId },
      take: take + 1,
      ...(cursor && {
        cursor: {
          followerId_followingId: { followerId: cursor, followingId: userId },
        },
        skip: 1,
      }),
      orderBy: { createdAt: 'desc' },
      select: {
        follower: {
          select: {
            id: true,
            username: true,
            ...(requestingUserId && {
              followers: {
                where: { followerId: requestingUserId },
                select: { followerId: true },
              },
              following: {
                where: { followingId: requestingUserId },
                select: { followingId: true },
              },
            }),
          },
        },
      },
    });

    const hasNextPage = followers.length > take;
    const data = hasNextPage ? followers.slice(0, -1) : followers;

    return {
      followers: data.map((f) => ({
        id: f.follower.id,
        username: f.follower.username,
        viewerFollows: !!f.follower.followers?.length,
        followsViewer: !!f.follower.following?.length,
      })),
      nextCursor: hasNextPage ? data[data.length - 1].follower.id : null,
    };
  }

  async findFollowing(
    userId: string,
    requestingUserId?: string,
    cursor?: string,
    take = 20,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      take: take + 1,
      ...(cursor && {
        cursor: {
          followerId_followingId: { followerId: userId, followingId: cursor },
        },
        skip: 1,
      }),
      orderBy: { createdAt: 'desc' },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            ...(requestingUserId && {
              followers: {
                where: { followerId: requestingUserId },
                select: { followerId: true },
              },
              following: {
                where: { followingId: requestingUserId },
                select: { followingId: true },
              },
            }),
          },
        },
      },
    });

    const hasNextPage = following.length > take;
    const data = hasNextPage ? following.slice(0, -1) : following;

    return {
      following: data.map((f) => ({
        id: f.following.id,
        username: f.following.username,
        viewerFollows: !!f.following.followers?.length,
        followsViewer: !!f.following.following?.length,
      })),
      nextCursor: hasNextPage ? data[data.length - 1].following.id : null,
    };
  }

  async getUserInfo(userId: string, requestingUserId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        _count: { select: { followers: true, following: true } },
        ...(requestingUserId &&
          requestingUserId !== userId && {
            followers: {
              where: { followerId: requestingUserId },
              select: { followerId: true },
            },
            following: {
              where: { followingId: requestingUserId },
              select: { followingId: true },
            },
          }),
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const { _count, followers, following, ...rest } = user;

    return {
      user: {
        ...rest,
        followerCount: _count.followers,
        followingCount: _count.following,
        viewerFollows: !!followers?.length,
        followsViewer: !!following?.length,
      },
    };
  }

  async findAll(
    search?: string,
    cursor?: string,
    take = 20,
    requestingUserId?: string,
  ) {
    const users = await this.prisma.user.findMany({
      where: {
        ...(search && {
          username: { contains: search, mode: 'insensitive' },
        }),
      },
      take: take + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: { username: 'asc' },
      select: {
        id: true,
        username: true,
        ...(requestingUserId && {
          followers: {
            where: { followerId: requestingUserId },
            select: { followerId: true },
          },
          following: {
            where: { followingId: requestingUserId },
            select: { followingId: true },
          },
        }),
      },
    });

    const hasNextPage = users.length > take;
    const data = hasNextPage ? users.slice(0, -1) : users;

    return {
      users: data.map(({ followers, following, ...user }) => ({
        ...user,
        viewerFollows: !!followers?.length,
        followsViewer: !!following?.length,
      })),
      nextCursor: hasNextPage ? data[data.length - 1].id : null,
    };
  }
}
