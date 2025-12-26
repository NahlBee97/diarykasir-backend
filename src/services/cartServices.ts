import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

export const cartService = {
  getUserCart: async (userId: number) => {
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

      if (!cart) {
        throw new AppError("Cart not found", 404);
      }

      return cart;
    } catch (error) {
      throw error;
    }
  },

  addItem: async (userId: number, productId: number, quantity: number) => {
    try {
      const product = await prisma.products.findUnique({
        where: { id: productId },
        select: { id: true, stock: true },
      });

      if (!product) throw new AppError("Product not found.", 404);

      if (product.stock < quantity)
        throw new AppError("Insufficient product stock.", 400);

      const cart = await prisma.carts.findFirst({
        where: { userId },
        include: { items: true },
      });

      if (!cart) throw new AppError("Cart not found", 404);

      const existingItem = await prisma.cartItems.findFirst({
        where: { cartId: cart.id, productId },
      });

      const result = await prisma.$transaction(async (tx) => {
        if (existingItem) {
          await tx.cartItems.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
          });
        } else {
          await tx.cartItems.create({
            data: { cartId: cart.id, productId, quantity },
          });
        }

        return await tx.carts.findUnique({
          where: { id: cart.id },
          include: {
            items: {
              include: {
                product: {
                  select: { name: true, price: true, image: true },
                },
              },
            },
          },
        });
      });

      return result;
    } catch (error) {
      throw error;
    }
  },

  updateItem: async (itemId: number, quantity: number) => {
    try {
      const cartItem = await prisma.cartItems.findUnique({
        where: { id: itemId },
      });

      if (!cartItem) throw new AppError("Item not found in cart", 404);

      const updatedItem = await prisma.cartItems.update({
        where: { id: cartItem.id },
        data: { quantity },
      });

      return updatedItem;
    } catch (error) {
      throw error;
    }
  },

  deleteItem: async (itemId: number) => {
    try {
      const cartItem = await prisma.cartItems.findUnique({
        where: { id: itemId },
      });

      if (!cartItem) throw new AppError("Item not found in cart", 404);

      await prisma.cartItems.delete({
        where: { id: cartItem.id },
      });
    } catch (error) {
      throw error;
    }
  },
};
