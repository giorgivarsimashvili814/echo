import { z } from "zod";

export const authSchema = z.object({
  username: z
    .string("Username is required")
    .min(3, "Username must be at least 3 characters long")
    .max(15, "Username must be at most 15 characters long"),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long"),
});
