import { Role } from "../generated/prisma/enums";
import { authModels } from "../models/authModels";
import jwt from "jsonwebtoken";

export const authService = {
  login: async (role: Role, pin: string) => {
    const user = await authModels.findUser(role, pin);

    if (!user) throw new Error("Invalid credentials");

    const payload = {
      id: user.id,
      role: user.role,
      name: user.name,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return accessToken;
  },
};
