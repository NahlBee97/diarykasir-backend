import { orderItems } from "../generated/prisma/client";
import { getWitaDateRange } from "../helper/getWitaDateRange";
import { NewProduct, UpdateProduct } from "../interfaces/productInterface";
import { prisma } from "../lib/prisma";
import { productModels } from "../models/productModels";
import { AppError } from "../utils/appError";

export const productService = {
  getProducts: async (page: number = 1) => {
    try {
      const skip = (page - 1) * 10;

      const totalCount = await productModels.count();

      const products = await productModels.getAll(page, skip);

      const totalPages = Math.ceil(totalCount / 10);

      return {
        products,
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

      const topSales: {
        productId: number;
        _sum: {
          quantity: number | null;
        };
      }[] = await productModels.topSales(startDate, endDate, userId);

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
      throw error;
    }
  },

  getLowStockProducts: async () => {
    try {
      const products = await productModels.lowStock();

      return products;
    } catch (error) {
      throw error;
    }
  },

  findById: async (productId: number) => {
    try {
      const product = await productModels.findById(productId);

      if (!product) throw new AppError("Produk tidak ditemukan", 404);

      return product;
    } catch (error) {
      throw error;
    }
  },

  create: async (productData: NewProduct, imageUrl: string) => {
    try {
      const newProduct = await productModels.create(productData, imageUrl);

      if (!newProduct) throw new AppError("Gagal membuat produk", 500);

      return newProduct;
    } catch (error) {
      throw error;
    }
  },

  update: async (
    productId: number,
    productData: UpdateProduct,
    imageUrl?: string
  ) => {
    try {
      const existingProduct = await productModels.findById(productId);

      if (!existingProduct) throw new AppError("Produk tidak ditemukan", 404);

      const updatedProduct = await productModels.update(
        productData,
        existingProduct,
        imageUrl
      );

      if (!updatedProduct) throw new AppError("Gagal edit produk", 500);

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  },

  delete: async (productId: number) => {
    try {
      const existingProduct = await productModels.findById(productId);

      if (!existingProduct) throw new AppError("Produk tidak ditemukan", 404);

      const deletedProduct = await productModels.delete(productId);

      if(!deletedProduct) throw new AppError("Gagal menghapus product", 500);
    } catch (error) {
      throw error;
    }
  },
};
