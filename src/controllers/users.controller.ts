import { Request, Response } from "express";
import * as usersService from "../services/users.service";
import { Prisma } from "../generated/prisma/client";
import { editUserSchema } from "../schemas/users.schema";
import z, { ZodError } from "zod";

export const editUser = async (req: Request, res: Response) => {
  try {
    const { username } = editUserSchema.parse(req.body);

    const userId = req.userId as string;

    const updatedUser = await usersService.editUser(userId, username);

    return res
      .status(200)
      .json({ message: "Updated successfully", updatedUser });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      return res.status(409).json({ message: "Username is already taken" });

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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    const deletedUser = await usersService.deleteUser(userId);

    return res
      .status(200)
      .json({ message: "Deleted successfully", deletedUser });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    )
      return res.status(404).json({ message: "User not found" });

    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;

    const user = await usersService.getUserById(userId);

    return res.status(200).json({ message: "Fetched successfully", user });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    )
      return res.status(404).json({ message: "User not found" });

    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};
