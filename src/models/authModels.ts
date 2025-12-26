import { Role } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const authModels = {
  findUser: async (userId: number, role: Role) => {
    const user = await prisma.users.findFirst({
      where: {
        id: userId,
        role,
      },
    });
    
    return user;
  },
  storeToken: async (userId: number, token: string) => {
    await prisma.tokens.create({
      data: {
        userId,
        token,
      },
    });
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
  },
};
