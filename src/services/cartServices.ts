import { cartItemsModels } from "../models/cartItemsModels";
import { cartModels } from "../models/cartModels";
import { productModels } from "../models/productModels";
import { AppError } from "../utils/appError";

export const cartService = {
  getUserCart: async (userId: number) => {
    try {
      const cart = await cartModels.findByUserId(userId);

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
      const product = await productModels.findById(productId);

      if (!product) throw new AppError("Product not found.", 404);

      if (product.stock < quantity)
        throw new AppError("Insufficient product stock.", 400);

      const cart = await cartModels.findByUserId(userId);

      if (!cart) throw new AppError("Cart not found", 404);

      await cartItemsModels.addItem(cart.id, productId, quantity);

      return cart;
    } catch (error) {
      throw error;
    }
  },

  updateItem: async (itemId: number, quantity: number) => {
    try {
      const cartItem = await cartItemsModels.findById(itemId);

      if (!cartItem) throw new AppError("Item not found in cart", 404);

      const updatedItem = await cartItemsModels.updateItem(itemId, quantity);

      return updatedItem;
    } catch (error) {
      throw error;
    }
  },

  deleteItem: async (itemId: number) => {
    try {
      const cartItem = await cartItemsModels.findById(itemId);

      if (!cartItem) throw new AppError("Item not found in cart", 404);

      const deletedItem = await cartItemsModels.deleteItem(itemId);

      if (!deletedItem) throw new AppError("Failed to delete item", 500);

      return deletedItem;
    } catch (error) {
      throw error;
    }
  },
};
