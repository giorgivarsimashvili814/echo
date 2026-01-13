import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  const decoded = verifyAccessToken(token);

  req.userId = decoded.userId;

  next();
};
