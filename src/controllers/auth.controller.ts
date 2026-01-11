import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { Prisma } from "../generated/prisma/client";
import jwt from "jsonwebtoken";
import { authSchema } from "../schemas/auth.schema";
import z, { ZodError } from "zod";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = authSchema.parse(req.body);

    const user = await authService.registerUser(username, password);

    return res.status(201).json({ message: "Registered successfully", user });
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

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = authSchema.parse(req.body);

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
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    )
      return res.status(401).json({ message: "Invalid credentials" });

    if (error instanceof Error && error.message === "Invalid credentials")
      return res.status(401).json({ message: "Invalid credentials" });

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

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = await authService.refreshTokens(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Tokens refreshed successfully",
      user,
      accessToken,
    });
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError ||
      (error instanceof Error && error.message === "User not found")
    ) {
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }

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
