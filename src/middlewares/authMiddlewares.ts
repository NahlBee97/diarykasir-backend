import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { AppError } from "../utils/appError";
import { IUserReqParam } from "../custom";
import { authModels } from "../models/authModels";

export async function VerifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    const isActive = await authModels.checkToken(token as string);

    if (!isActive) throw new AppError("Invalid Token", 403);

    if (!token) {
      throw new AppError("Unauthorized: No token provided", 403);
    }

    const decodedPayload = verify(
      token,
      String(process.env.JWT_SECRET)
    ) as JwtPayload;

    if (!decodedPayload.id || !decodedPayload.role) {
      throw new AppError("Invalid token: Payload missing required fields", 403);
    }

    req.user = decodedPayload as IUserReqParam;

    next();
  } catch (error) {
    next(error);
  }
}

export function RoleGuard(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") {
    return next(
      new AppError(
        "Forbidden: You do not have permission to perform this action",
        403
      )
    );
  }

  next();
}
