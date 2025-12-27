import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ZodError } from "zod";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors, 
    });
  }

  if (error instanceof TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please log in again",
    });
  }

  if (error instanceof JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      message: "Invalid session token. Please log in again",
    });
  }

  console.error("🔥 UNCAUGHT ERROR:", error);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error. Please try again later.",
  });
}
