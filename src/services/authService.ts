import { Role } from "../generated/prisma/enums";
import { authModels } from "../models/authModels";
import jwt from "jsonwebtoken";

export const authService = {
  login: async (userId: number, role: Role, pin: string) => {
    const user = await authModels.findUser(userId, role, pin);

    if (!user) throw new Error("Invalid credentials");

    const payload = {
      id: user.id,
      role: user.role,
      name: user.name,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return accessToken;
  },
  logout: async (token: string | undefined) => {
    if (!token) throw new Error("No token provided");
    await authModels.invalidateToken(token);
  },
};
