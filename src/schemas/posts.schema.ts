import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string("Title is required")
    .min(1, "Title cannot be empty")
    .max(300, "Title must be at most 300 characters"),
  body: z.string().min(1, "Body cannot be empty").optional(),
});

export const editPostSchema = z.object({
  body: z.string("Body is required").min(1, "Body cannot be empty"),
});
