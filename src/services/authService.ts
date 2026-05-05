import { authModels } from "../models/authModels";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/appError";
import jwt from "jsonwebtoken";

export const authService = {
  login: async (userId: number, password: string) => {
    try {
      const user = await authModels.findUser(userId);

      if (!user) throw new AppError("Pengguna tidak ditemukan", 404);

      const checkPassword = await bcrypt.compare(password, user.password as string);

      if (!checkPassword) throw new AppError("Password Salah", 401);
      const payload = {
        id: user.id,
        role: user.role,
        name: user.name,
      };

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });

      await authModels.storeToken(user.id, accessToken);

      return accessToken;
    } catch (error) {
      throw error;
    }
  },
  logout: async (token: string | undefined) => {
    try {
      if (!token) throw new AppError("No token provided", 400);
      await authModels.invalidateToken(token);
    } catch (error) {
      throw error;
    }
  },
};
