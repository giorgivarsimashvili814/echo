import { Request, Response } from "express";
import { createPostSchema, editPostSchema } from "../schemas/posts.schema";
import * as postsService from "../services/posts.service";

export const createPost = async (req: Request, res: Response) => {
  const authorId = req.userId as string;

  const { title, body } = createPostSchema.parse(req.body);

  const post = await postsService.createPost({ title, body, authorId });

  return res.status(201).json({ message: "Created successfully", post });
};

export const deletePost = async (req: Request, res: Response) => {
  const authorId = req.userId as string;
  const postId = req.params.postId as string;

  const deletedPost = await postsService.deletePost(postId, authorId);

  return res.status(200).json({ message: "Deleted successfully", deletedPost });
};

export const editPost = async (req: Request, res: Response) => {
  const authorId = req.userId as string;
  const postId = req.params.postId as string;

  const { body } = editPostSchema.parse(req.body);

  const editedPost = await postsService.editPost({ body, authorId, postId });

  return res.status(200).json({ message: "Edited successfully", editedPost });
};

export const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.postId as string;

  const post = await postsService.getPostById(postId);

  return res.status(200).json({ message: "Fetched successfully", post });
};

export const getPostsByAuthorId = async (req: Request, res: Response) => {
  const authorId = req.params.authorId as string;

  const posts = await postsService.getPostsByAuthorId(authorId);

  return res.status(200).json({ message: "Fetched successfully", posts });
};
