import { authModels } from "../models/authModels";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/appError";
import jwt from "jsonwebtoken";

export const authService = {
  login: async (userId: number, pin: string) => {
    try {
      const user = await authModels.findUser(userId);

      if (!user) throw new AppError("Kasir tidak ditemukan", 404);

      const checkPin = await bcrypt.compare(pin, user.pin as string);

      if (!checkPin) throw new AppError("PIN Salah", 401);
      const payload = {
        id: user.id,
        role: user.role,
        name: user.name,
      };

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "1m",
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
