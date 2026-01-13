import { CreateCommentDto, EditCommentDto } from "../dtos/comments.dto";
import { prisma } from "../lib/prisma";

export const createComment = async (createCommentDto: CreateCommentDto) => {
  const { body, authorId, postId } = createCommentDto;
  return prisma.comment.create({
    data: { body, authorId, postId },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });
};

export const deleteComment = async (commentId: string, authorId: string) => {
  return prisma.comment.deleteMany({
    where: { id: commentId, authorId },
  });
};

export const editComment = async (editCommentDto: EditCommentDto) => {
  const { body, authorId, commentId } = editCommentDto;
  return prisma.comment.updateMany({
    where: { id: commentId, authorId },
    data: { body },
  });
};

export const getcommentsByPostId = async (postId: string) => {
  return prisma.comment.findMany({
    where: { postId },
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
