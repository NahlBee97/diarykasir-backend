import { prisma } from "../lib/prisma";

export const authModels = {
  findUser: async (userId: number) => {
    try {
      const user = await prisma.users.findUnique({
        where: {
          id: userId,
        },
      });
  
      return user;
    } catch (error) {
      throw error;
    }
  },
  storeToken: async (userId: number, token: string) => {
    try {
      await prisma.tokens.create({
        data: {
          userId,
          token,
        },
      });
    } catch (error) {
      throw error;
    }
  },
  invalidateToken: async (token: string) => {
    try {
      await prisma.tokens.update({
        where: {
          token,
        },
        data: {
          isActive: false,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
