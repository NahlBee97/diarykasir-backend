import { getWitaDateRange } from "../helper/getWitaDateRange";
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

  getTopProducts: async (start: string, end: string, userId?: number) => {
    try {
      const startDate = getWitaDateRange(start).start;
      const endDate = getWitaDateRange(end).end;

      // We use groupBy on orderItems to aggregate actual sales data
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

      // Now, fetch the full product details for those IDs
      const productsWithSales = await Promise.all(
        topSales.map(async (sale) => {
          const product = await prisma.products.findUnique({
            where: { id: sale.productId },
          });
          return {
            ...product,
            totalSold: sale._sum.quantity,
          };
        })
      );

      return productsWithSales;
    } catch (error) {
      console.error("Error fetching top products:", error);
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

      if (!product) throw new AppError("Produk tidak ditemukan", 404);

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

  update: async (
    productId: number,
    productData: UpdateProduct,
    imageUrl?: string | null
  ) => {
    try {
      const { name, price, stock, category } = productData;

      const existingProduct = await prisma.products.findUnique({
        where: { id: productId },
      });

      if (!existingProduct) throw new AppError("Produk tidak ditemukan", 404);

      const updatedProduct = await prisma.products.update({
        where: { id: productId },
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
      const existingProduct = await prisma.products.findUnique({
        where: { id: productId },
      });

      if (!existingProduct) throw new AppError("Produk tidak ditemukan", 404);

      await prisma.products.update({
        where: { id: productId },
        data: { isActive: false },
      });

      await prisma.cartItems.deleteMany({
        where: { productId },
      });
    } catch (error) {
      throw error;
    }
  },
};
