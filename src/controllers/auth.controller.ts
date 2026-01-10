import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { BadRequestException } from "../utils/exceptions";
import { Prisma } from "../generated/prisma/client";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new BadRequestException("Username and password are required");
    }

    const user = await authService.registerUser(username, password);

    return res.status(201).json({ message: "Registered successfully", user });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({ message: "Username is already taken" });
      }
    }
    if (
      error !== null &&
      typeof error === "object" &&
      "status" in error &&
      "message" in error
    ) {
      const status = (error as { status: number }).status;
      const message = (error as { message: string }).message;
      return res.status(status).json({ message });
    }

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new BadRequestException("Username and password are required");
    }

    const { user, accessToken, refreshToken } = await authService.loginUser(
      username,
      password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "Logged in successfully", user, accessToken });
  } catch (error: unknown) {
    if (
      error !== null &&
      typeof error === "object" &&
      "status" in error &&
      "message" in error
    ) {
      const status = (error as { status: number }).status;
      const message = (error as { message: string }).message;
      return res.status(status).json({ message });
    }

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new BadRequestException("Refresh token required");

    const result = await authService.refreshTokens(refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Tokens refreshed successfully",
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error: unknown) {
    if (
      error !== null &&
      typeof error === "object" &&
      "status" in error &&
      "message" in error
    ) {
      const status = (error as { status: number }).status;
      const message = (error as { message: string }).message;
      return res.status(status).json({ message });
    }

    if (error instanceof Error)
      return res.status(500).json({ message: error.message });

    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};
