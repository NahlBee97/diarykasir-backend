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
  checkToken: async (token: string) => {
    try {
      const existToken = await prisma.tokens.findFirst({
        where: { token },
        select: {
          id: true,
          isActive: true,
        },
      });

      return existToken?.isActive;
    } catch (error) {
      throw error;
    }
  },
};
