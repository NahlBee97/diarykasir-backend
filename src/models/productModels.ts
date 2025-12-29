import {
  NewProduct,
  Product,
  UpdateProduct,
} from "../interfaces/productInterface";
import { prisma } from "../lib/prisma";

export const productModels = {
  findById: async (productId: number) => {
    try {
      const product = await prisma.products.findUnique({
        where: { id: productId },
      });
      return product;
    } catch (error) {
      throw error;
    }
  },

  getAll: async (page: number, skip: number) => {
    try {
      const products = await prisma.products.findMany({
        where: { isActive: true }, // Only show active products
        orderBy: { createdAt: "desc" },
        take: 10,
        skip,
      });
      return products;
    } catch (error) {
      throw error;
    }
  },

  count: async () => {
    try {
      const totalCount = await prisma.products.count({
        where: { isActive: true },
      });
      return totalCount;
    } catch (error) {
      throw error;
    }
  },

  topSales: async (startDate: Date, endDate: Date, userId?: number) => {
    try {
      const topSales = await prisma.orderItems.groupBy({
        by: ["productId"],
        where: {
          order: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
            ...(userId && { userId: userId }), // Filter by userId if provided
            status: "COMPLETED", // Only count successful orders
          },
        },
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: "desc",
          },
        },
        take: 5,
      });
      return topSales;
    } catch (error) {
      throw error;
    }
  },

  lowStock: async () => {
    try {
      const products = await prisma.products.findMany({
        where: {
          isActive: true,
          stock: {
            lte: 10,
          },
        },
        orderBy: {
          sale: "desc",
        },
        take: 10,
      });
      return products;
    } catch (error) {
      throw error;
    }
  },

  create: async (productData: NewProduct, imageUrl: string) => {
    try {
      const newProduct = await prisma.products.create({
        data: { ...productData, image: imageUrl },
      });
      return newProduct;
    } catch (error) {
      throw error;
    }
  },

  update: async (
    productData: UpdateProduct,
    existingProduct: Product,
    imageUrl?: string
  ) => {
    try {
      const { name, price, stock, category } = productData;
      const updatedProduct = await prisma.products.update({
        where: { id: existingProduct.id },
        data: {
          name: name || existingProduct.name,
          price: price || existingProduct.price,
          stock: stock || existingProduct.stock,
          category: category || existingProduct.category,
          image: imageUrl ? imageUrl : existingProduct.image,
        },
      });

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  },

  delete: async (productId: number) => {
    try {
      const deletedProduct = await prisma.products.update({
        where: { id: productId },
        data: { isActive: false },
      });

      await prisma.cartItems.deleteMany({
        where: { productId },
      });

      return deletedProduct;
    } catch (error) {
      throw error;
    }
  },
};
