import z from "zod";

export const editUserSchema = z.object({
  username: z
    .string("Username is required")
    .min(3, "Username must be at least 3 characters long")
    .max(15, "Username must be at most 15 characters long"),
});
