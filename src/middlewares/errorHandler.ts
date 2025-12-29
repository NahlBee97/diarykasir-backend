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
      message: "Terjadi kesalahan pada data yang dikirimkan.",
      errors: formattedErrors, 
    });
  }

  if (error instanceof TokenExpiredError) {
    return res.status(403).json({
      success: false,
      message: "Sesi telah habis. Silahkan login kembali.",
    });
  }

  if (error instanceof JsonWebTokenError) {
    return res.status(403).json({
      success: false,
      message: "Token sesi tidak valid. Silahkan login kembali.",
    });
  }

  console.error("🔥 UNCAUGHT ERROR:", error);

  return res.status(500).json({
    success: false,
    message: "Periksa koneksi internet, dan coba lagi.",
  });
}
