import { EditUserDto } from "../dtos/users.dto";
import { prisma } from "../lib/prisma";

export const editUser = async (editUserDto: EditUserDto) => {
  const { username, userId } = editUserDto;

  return prisma.user.update({
    where: { id: userId },
    data: { username },
    select: { id: true, username: true },
  });
};

export const deleteUser = async (userId: string) => {
  return prisma.user.delete({
    where: { id: userId },
    select: { id: true, username: true },
  });
};

export const getUserById = async (userId: string) => {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, username: true },
  });
};
