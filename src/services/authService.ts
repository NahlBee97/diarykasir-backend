import { Role } from "../generated/prisma/enums";
import { authModels } from "../models/authModels";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/appError";
import jwt from "jsonwebtoken";

export const authService = {
  login: async (userId: number, role: Role, pin: string) => {
    const user = await authModels.findUser(userId, role);

    if (!user) throw new Error("User not found");

    const checkPin = await bcrypt.compare(pin, user.pin as string);

    if (!checkPin) throw new AppError("Incorrect Password", 401);

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
  },
  logout: async (token: string | undefined) => {
    if (!token) throw new Error("No token provided");
    await authModels.invalidateToken(token);
  },
};
