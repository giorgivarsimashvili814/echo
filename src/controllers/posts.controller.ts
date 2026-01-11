import { Request, Response } from "express";
import * as postsService from "../services/posts.service";
import { createPostSchema, editPostSchema } from "../schemas/posts.schema";
import z, { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, body } = createPostSchema.parse(req.body);
    const userId = req.userId as string;

    const post = await postsService.createPost(userId, title, body);
    return res.status(201).json(post);
  } catch (error) {
    if (error instanceof ZodError) {
      const tree = z.treeifyError(error) as any;
      const properties = tree.properties;
      const errors = Object.values(properties).flatMap(
        (prop: any) => prop.errors
      );
      return res.status(400).json(errors);
    }

    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const postId = req.params.postId as string;

    const deletedPost = await postsService.deletePost(postId, userId);

    return res
      .status(200)
      .json({ message: "Deleted successfully", post: deletedPost });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    )
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });

    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const editPost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const postId = req.params.postId as string;
    const { body } = editPostSchema.parse(req.body);

    const updatedPost = await postsService.editPost(postId, userId, body);

    return res
      .status(200)
      .json({ message: "Updated successfully", updatedPost });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    if (error instanceof ZodError) {
      const tree = z.treeifyError(error) as any;
      const properties = tree.properties;
      const errors = Object.values(properties).flatMap(
        (prop: any) => prop.errors
      );
      return res.status(400).json(errors);
    }

    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId as string;

    const post = await postsService.getPostById(postId);

    return res.status(200).json({ message: "Fetched successfully", post });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const getPostsByAuthorId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;

    const posts = await postsService.getPostsByUserId(userId);

    return res.status(200).json({ message: "Fetched successfully", posts });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};
