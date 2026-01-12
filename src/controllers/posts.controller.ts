import { Request, Response } from "express";
import * as postsService from "../services/posts.service";
import { createPostSchema, editPostSchema } from "../schemas/posts.schema";

export const createPost = async (req: Request, res: Response) => {
  const { title, body } = createPostSchema.parse(req.body);
  const userId = req.userId as string;

  const post = await postsService.createPost(userId, title, body);
  return res.status(201).json(post);
};

export const deletePost = async (req: Request, res: Response) => {
  const userId = req.userId as string;
  const postId = req.params.postId as string;

  const deletedPost = await postsService.deletePost(postId, userId);

  return res
    .status(200)
    .json({ message: "Deleted successfully", post: deletedPost });
};

export const editPost = async (req: Request, res: Response) => {
  const userId = req.userId as string;
  const postId = req.params.postId as string;
  const { body } = editPostSchema.parse(req.body);

  const updatedPost = await postsService.editPost(postId, userId, body);

  return res.status(200).json({ message: "Updated successfully", updatedPost });
};

export const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.postId as string;

  const post = await postsService.getPostById(postId);

  return res.status(200).json({ message: "Fetched successfully", post });
};

export const getPostsByAuthorId = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;

  const posts = await postsService.getPostsByUserId(userId);

  return res.status(200).json({ message: "Fetched successfully", posts });
};
