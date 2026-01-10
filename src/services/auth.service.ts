import { Prisma } from "../generated/prisma/client";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../lib/jwt";
import { prisma } from "../lib/prisma";
import { AuthResponse, UserWithoutPassword } from "../types/auth.types";
import { ConflictException, UnauthorizedException } from "../utils/exceptions";
import { comparePassword, hashPassword } from "../utils/password.util";
import * as jwt from "jsonwebtoken";

export const registerUser = async (
  username: string,
  password: string
): Promise<UserWithoutPassword> => {
  const hash = await hashPassword(password);

  try {
    return prisma.user.create({
      data: { username, password: hash },
      select: { id: true, username: true, createdAt: true, updatedAt: true },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      throw new ConflictException("username is taken");

    throw new Error("An unexpected error occurred during registration");
  }
};

export const loginUser = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await comparePassword(password, user.password)))
    throw new UnauthorizedException("Invalid credentials");

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  return {
    user: { id: user.id, username: user.username },
    accessToken,
    refreshToken,
  };
};

export const refreshTokens = async (
  oldRefreshToken: string
): Promise<AuthResponse> => {
  try {
    const decoded = verifyRefreshToken(oldRefreshToken);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true },
    });

    if (!user) throw new UnauthorizedException("User not found");

    const accessToken = signAccessToken({ userId: user.id });

    const refreshToken = signRefreshToken({ userId: user.id });

    return { user, accessToken, refreshToken };
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    )
      throw new UnauthorizedException("Session expired. Please log in again.");

    throw error;
  }
};
