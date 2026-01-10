import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../utils/exceptions";
import { verifyAccessToken } from "../lib/jwt";
import * as jwt from "jsonwebtoken";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new UnauthorizedException("Access denied");

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedException("Token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedException("Invalid token");
    }
    next(error);
  }
};
