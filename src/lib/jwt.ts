import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export const accessOptions: SignOptions = {
  expiresIn: (process.env.JWT_EXPIRES_IN || "15m") as SignOptions["expiresIn"],
};

export const refreshOptions: SignOptions = {
  expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN ||
    "7d") as SignOptions["expiresIn"],
};

export const signAccessToken = (payload: { userId: string }) => {
  return jwt.sign(payload, JWT_SECRET, accessOptions);
};

export const signRefreshToken = (payload: {  userId: string;}) => {
  return jwt.sign(payload, REFRESH_SECRET, refreshOptions);
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, REFRESH_SECRET) as { userId: string };
};

export const verifyAccessToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};
