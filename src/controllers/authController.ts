import { NextFunction, Request, Response } from "express";
import { authService } from "../services/authService";

export const AuthController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, pin } = req.body;

      const accessToken = await authService.login(userId, pin);
      res.status(200).json({ message: "Login successful", accessToken });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      await authService.logout(token);
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  },
};
