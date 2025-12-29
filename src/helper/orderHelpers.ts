import { CartItem } from "../interfaces/cartInterface";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

export async function validateCartItems(items: CartItem[]) {
  try {
    for (const item of items) {
      // Validate product exists and is available
      const product = await prisma.products.findUnique({
        where: { id: item.productId },
        select: { stock: true, price: true, name: true },
      });

      if (!product) {
        throw new AppError(
          `Product with ID "${item.productId}" not found`,
          404
        );
      }

      if (product.stock === 0) {
        throw new AppError(`Product "${product.name}" is not available`, 400);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
          400
        );
      }
    }
  } catch (error) {
    throw error;
  }
}
