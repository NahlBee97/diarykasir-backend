import { NextFunction, Request, Response } from "express";
import { authService } from "../services/authService";

export const AuthController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, pin } = req.body;
      const accessToken = await authService.login(role, pin);
      res.status(200).json({ message: "Login successful", accessToken });
    } catch (error) {
      next(error);
    }
  },
};
