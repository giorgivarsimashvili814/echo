import { CreatePostDto, EditPostDto } from "../dtos/posts.dto";
import { prisma } from "../lib/prisma";

export const createPost = async (createPostDto: CreatePostDto) => {
  const { title, body, authorId } = createPostDto;

  return prisma.post.create({
    data: { title, body, authorId },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });
};

export const deletePost = async (postId: string, authorId: string) => {
  return prisma.post.deleteMany({
    where: { id: postId, authorId },
  });
};

export const editPost = async (editPostDto: EditPostDto) => {
  const { body, authorId, postId } = editPostDto;

  return prisma.post.updateMany({
    where: { id: postId, authorId },
    data: { body },
  });
};

export const getPostById = async (postId: string) => {
  return prisma.post.findUniqueOrThrow({
    where: { id: postId },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });
};

export const getPostsByAuthorId = async (authorId: string) => {
  return prisma.post.findMany({
    where: { authorId },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
