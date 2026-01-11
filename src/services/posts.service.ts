import { prisma } from "../lib/prisma";

export const createPost = async (
  userId: string,
  title: string,
  body?: string
) => {
  return prisma.post.create({
    data: { title, body, authorId: userId },
  });
};

export const deletePost = async (postId: string, userId: string) => {
  return prisma.post.delete({
    where: { id: postId, authorId: userId },
  });
};

export const editPost = async (
  postId: string,
  userId: string,
  body: string
) => {
  return prisma.post.update({
    where: { id: postId, authorId: userId },
    data: { body },
  });
};

export const getPostById = async (postId: string) => {
  return prisma.post.findUniqueOrThrow({ where: { id: postId } });
};

export const getPostsByUserId = async (userId: string) => {
  return prisma.post.findMany({ where: { authorId: userId } });
};
