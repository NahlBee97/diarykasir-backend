import { Role } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const authModels = {
  findUser: async (userId: number, role: Role, pin: string) => {
    const user = await prisma.users.findFirst({
      where: {
        id: userId, role, pin
      },
    });
    return user;
  },
  invalidateToken: async (token: string) => {
    await prisma.tokens.update({
      where: {
        token,
      },
      data: {
        isActive: false,
      },
    });
  }
};
