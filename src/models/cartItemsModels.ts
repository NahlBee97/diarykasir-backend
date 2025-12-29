import { prisma } from "../lib/prisma";

export const cartItemsModels = {
  findById: async (itemId: number) => {
    try {
      const cartItem = await prisma.cartItems.findUnique({
        where: { id: itemId },
      });
      return cartItem;
    } catch (error) {
      throw error;
    }
  },
  addItem: async (cartId: number, productId: number, quantity: number) => {
    try {
      const cartItem = await prisma.cartItems.create({
        data: { cartId, productId, quantity },
      });
      return cartItem;
    } catch (error) {
      throw error;
    }
  },
  updateItem: async (itemId: number, quantity: number) => {
    try {
      const updatedItem = await prisma.cartItems.update({
        where: { id: itemId },
        data: { quantity },
      });
      return updatedItem;
    } catch (error) {
      throw error;
    }
  },
  deleteItem: async (itemId: number) => {
    try {
      const deletedItem = await prisma.cartItems.delete({
        where: { id: itemId },
      });
      return deletedItem;
    } catch (error) {
      throw error;
    }
  },
};
