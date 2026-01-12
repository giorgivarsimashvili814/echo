import { Request, Response } from "express";
import * as usersService from "../services/users.service";
import { editUserSchema } from "../schemas/users.schema";

export const editUser = async (req: Request, res: Response) => {
  const { username } = editUserSchema.parse(req.body);

  const userId = req.userId as string;

  const updatedUser = await usersService.editUser(userId, username);

  return res.status(200).json({ message: "Updated successfully", updatedUser });
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.userId!;

  const deletedUser = await usersService.deleteUser(userId);

  return res.status(200).json({ message: "Deleted successfully", deletedUser });
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;

  const user = await usersService.getUserById(userId);

  return res.status(200).json({ message: "Fetched successfully", user });
};
