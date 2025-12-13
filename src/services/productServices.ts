import { NewProduct, UpdateProduct } from "../interfaces/productInterface";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

export const productService = {
  getProducts: async () => {
    try {
      const products = await prisma.products.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return products;
    } catch (error) {
      throw error;
    }
  },

  getTopProducts: async () => {
    try {
      const products = await prisma.products.findMany({
        take: 5,
        orderBy: {
          sale: "desc",
        },
      });

      return products;
    } catch (error) {
      throw error;
    }
  },

  findById: async (productId: number) => {
    try {
      const product = await prisma.products.findUnique({
        where: { id: productId },
      });

      if (!product) throw new AppError("Product not found", 404);

      return product;
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

  update: async (productId: number, productData: UpdateProduct, imageUrl?: string | null) => {
    try {
      const { name, price, stock, category } = productData;

      const existingProduct = await prisma.products.findUnique({
        where: { id: productId },
      });

      if (!existingProduct) throw new AppError("Product not found", 404);

      const updatedProduct = await prisma.products.update({
        where: { id: productId },
        data: {
          name: name || existingProduct.name,
          price: price || existingProduct.price,
          stock: stock || existingProduct.stock,
          category: category || existingProduct.category,
          image: imageUrl ? imageUrl : existingProduct.image
        },
      });

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  },

  delete: async (productId: number) => {
    try {
      const existingProduct = await prisma.products.findUnique({
        where: { id: productId },
      });

      if (!existingProduct) throw new AppError("Product not found", 404);

      await prisma.products.update({
        where: { id: productId },
        data: { isActive: false },
      });
    } catch (error) {
      throw error;
    }
  },
};
