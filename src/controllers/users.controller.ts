import { Request, Response } from "express";
import { editUserSchema } from "../schemas/users.schema";
import * as usersService from "../services/users.service";

export const editUser = async (req: Request, res: Response) => {
  const userId = req.userId as string;

  const { username } = editUserSchema.parse(req.body);

  const editedUser = await usersService.editUser({ username, userId });

  return res.status(200).json({ message: "Edited successfully", editedUser });
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.userId as string;

  const deletedUser = await usersService.deleteUser(userId);

  return res.status(200).json({ message: "Deleted successfully", deletedUser });
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;

  const user = await usersService.getUserById(userId);

  return res.status(200).json({ message: "Fetched successfully", user });
};
