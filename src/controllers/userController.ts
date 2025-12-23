import { NextFunction, Request, Response } from "express";
import { userService } from "../services/userServices";

export const userController = {
  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ massage: "get all users success", users });
    } catch (error) {
      next(error);
    }
  },
  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const user = await userService.getUserById(userId);
      res.status(200).json({ message: "Get user by ID success", user });
    } catch (error) {
      next(error);
    }
  },
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const newUser = await userService.createUser(userData);
      res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
      next(error);
    }
  },
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const updateData = req.body;
      const updatedUser = await userService.updateUser(userId, updateData);
      res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      next(error);
    }
  },
  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      await userService.deleteUser(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
