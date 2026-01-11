import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";
import * as jwt from "jsonwebtoken";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError)
      return res.status(401).json({ message: "Token expired" });
    if (error instanceof jwt.JsonWebTokenError)
      return res.status(401).json({ message: "Invalid token" });
    next(error);
  }
};
