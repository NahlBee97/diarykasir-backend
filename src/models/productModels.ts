import { prisma } from "../lib/prisma";

export const productModels = {
  findById: async (productId: number) => {
    try {
        const product = await prisma.products.findUnique({
                where: { id: productId },
                select: { id: true, stock: true },
              });
        return product;
    } catch (error) {
        throw error;
    }
    },
    // Other model methods can be defined here
};