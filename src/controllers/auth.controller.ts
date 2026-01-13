import { Request, Response } from "express";
import { authSchema } from "../schemas/auth.schema";
import * as authService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  const { username, password } = authSchema.parse(req.body);

  const user = await authService.registerUser({ username, password });

  return res.status(201).json({ message: "Registered successfully", user });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = authSchema.parse(req.body);

  const { user, accessToken, refreshToken } = await authService.loginUser({
    username,
    password,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(200)
    .json({ message: "Logged in successfully", user, accessToken });
};

export const refresh = async (req: Request, res: Response) => {
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
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};
