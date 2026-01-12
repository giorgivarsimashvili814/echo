import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../lib/jwt";
import { prisma } from "../lib/prisma";
import { comparePassword, hashPassword } from "../utils/password.util";

export const registerUser = async (username: string, password: string) => {
  const hash = await hashPassword(password);

  return prisma.user.create({
    data: { username, password: hash },
    select: { id: true, username: true },
  });
};

export const loginUser = async (username: string, password: string) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { username } });

  if (!user || !(await comparePassword(password, user.password)))
    throw new Error("Invalid credentials");

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  return {
    user: { id: user.id, username: user.username },
    accessToken,
    refreshToken,
  };
};

export const refreshTokens = async (oldRefreshToken: string) => {
  const decoded = verifyRefreshToken(oldRefreshToken);

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: decoded.userId },
    select: { id: true, username: true },
  });

  const accessToken = signAccessToken({ userId: user.id });

  const refreshToken = signRefreshToken({ userId: user.id });

  return { user, accessToken, refreshToken };
};
