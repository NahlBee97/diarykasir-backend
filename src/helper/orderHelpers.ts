import { Cart, CartItem } from "../interfaces/cartInterface";
import { NewOrder} from "../interfaces/orderInterface";
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

export async function createOrderTransaction(orderData: NewOrder, cart: Cart) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Create order
      const order = await tx.orders.create({
        data: {
          userId: orderData.userId,
          totalAmount: orderData.totalAmount,
          paymentCash: orderData.paymentCash,
          paymentChange: orderData.paymentChange,
        },
      });

      if (cart.items?.length === 0) {
        throw new AppError("Cart is empty", 400);
      }

      // 2. Create order items
      const orderItems = cart.items?.map((item: CartItem) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.product?.price ?? 0,
      }));

      await tx.orderItems.createMany({
        data: orderItems ?? [],
      });

      // 3. Update product stock levels
      for (const item of cart.items ?? []) {
        const updatedProduct = await tx.products.update({
          where: { id: item.productId },
          data: {
            sale: {
              increment: item.quantity,
            },
            stock: {
              decrement: item.quantity,
            },
          },
          select: { stock: true }, // Return stock to verify
        });

        // Double-check stock didn't go negative
        if (updatedProduct.stock < 0) {
          throw new AppError(
            `Insufficient stock for product ${item.productId}`,
            400
          );
        }
      }

      // 4. Clear the user's cart
      await tx.cartItems.deleteMany({
        where: { cartId: cart.id },
      });

      return {order, orderItems: cart.items};
    });
  } catch (error) {
    throw error;
  }
}
