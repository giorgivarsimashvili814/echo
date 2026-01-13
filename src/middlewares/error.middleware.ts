import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client";
import z, { ZodError } from "zod";
import jwt from "jsonwebtoken";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2025":
        return res.status(404).json({ message: "Resource not found" });
      case "P2002":
        return res.status(409).json({ message: "Unique constraint failed" });
      default:
        return res.status(500).json({ message: "Database error occurred" });
    }
  }

  if (error instanceof ZodError) {
    const tree = z.treeifyError(error) as any;
    const properties = tree.properties;
    const errors = Object.values(properties).flatMap(
      (prop: any) => prop.errors
    );
    return res.status(400).json({
      message: "Validation Error",
      errors: errors,
    });
  }

  if (
    error instanceof jwt.JsonWebTokenError ||
    error instanceof jwt.TokenExpiredError ||
    (error instanceof Error && error.message === "User not found")
  ) {
    return res
      .status(401)
      .json({ message: "Session expired. Please log in again." });
  }

  if (error instanceof Error && error.message === "Invalid credentials")
    return res.status(401).json({ message: "Invalid credentials" });

  return res.status(500).json({ message: "Internal server error" });
};
