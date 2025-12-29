import { prisma } from "../lib/prisma";

export const cartModels = {
  findByUserId: async (userId: number) => {
    try {
      const cart = await prisma.carts.findFirst({
        where: { userId },
        include: {
          items: {
            where: { product: { isActive: true } },
            orderBy: {
              createdAt: "asc",
            },
            include: {
              product: true,
            },
          },
        },
      });
      return cart;
    } catch (error) {
      throw error;
    }
  },

  // Other model methods can be defined here
};
