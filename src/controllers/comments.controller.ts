import { Request, Response } from "express";
import { commentSchema } from "../schemas/comments.schema";
import * as commentsService from "../services/comments.service";

export const createComment = async (req: Request, res: Response) => {
  const { body } = commentSchema.parse(req.body);
  const authorId = req.userId as string;
  const postId = req.params.postId as string;

  const comment = await commentsService.createComment({
    body,
    authorId,
    postId,
  });
  return res.status(201).json({ message: "Created successfully", comment });
};

export const deleteComment = async (req: Request, res: Response) => {
  const userId = req.userId as string;
  const commentId = req.params.commentId as string;

  const deletedPost = await commentsService.deleteComment(commentId, userId);

  return res.status(200).json({ message: "Deleted successfully", deletedPost });
};

export const editComment = async (req: Request, res: Response) => {
  const authorId = req.userId as string;
  const commentId = req.params.commentId as string;
  const { body } = commentSchema.parse(req.body);

  const editedComment = await commentsService.editComment({
    body,
    authorId,
    commentId,
  });

  return res
    .status(200)
    .json({ message: "Edited successfully", editedComment });
};

export const getCommentsByPostId = async (req: Request, res: Response) => {
  const postId = req.params.postId as string;

  const comments = await commentsService.getcommentsByPostId(postId);

  return res.status(200).json({ message: "Fetched successfully", comments });
};
