import { NewProduct, UpdateProduct } from "../interfaces/productInterface";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

export const productService = {
  getProducts: async (page: number = 1) => {
    try {
      const SKIP = (page - 1) * 10;

      // 1. Get total count
      const totalCount = await prisma.products.count({
        where: { isActive: true }, // Filter to count only active products
      });

      // 2. Get paginated data
      const products = await prisma.products.findMany({
        where: { isActive: true }, // Only show active products
        orderBy: { createdAt: "desc" },
        take: 10,
        skip: SKIP,
      });

      // 3. Calculate total pages
      const totalPages = Math.ceil(totalCount / 10);

      return {
        products: products,
        totalProducts: totalCount,
        currentPage: page,
        totalPages: totalPages,
      };
    } catch (error) {
      throw error;
    }
  },

  getTopProducts: async (start: string, end: string) => {
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);

      endDate.setHours(23, 59, 59, 999);

      const products = await prisma.products.findMany({
        where: {
          isActive: true,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          sale: "desc",
        },
        take: 5,
      });

      return products;
    } catch (error) {
      throw error;
    }
  },

  getLowStockProducts: async () => {
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
