import { Request, Response, NextFunction } from "express";
import { NewProduct, UpdateProduct } from "../interfaces/productInterface";
import { productService } from "../services/productServices";

export const productController = {
  getProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page } = req.query;

      const productsData = await productService.getProducts(Number(page));

      res
        .status(200)
        .json({ message: "Products retrieved successfully", productsData });
    } catch (error) {
      next(error);
    }
  },

  getTopProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { start, end } = req.query;

      const products = await productService.getTopProducts(
        start as string,
        end as string
      );

      res
        .status(200)
        .json({ message: "Products retrieved successfully", products });
    } catch (error) {
      next(error);
    }
  },

  getLowStockProducts: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const products = await productService.getLowStockProducts();

      res
        .status(200)
        .json({ message: "Products retrieved successfully", products });
    } catch (error) {
      next(error);
    }
  },

  findById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id as string;
      const product = await productService.findById(Number(productId));
      res
        .status(200)
        .json({ message: "Product retrieved successfully", product });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productData = req.body as NewProduct;

      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "Product image is required." });
      }

      const imageUrl = `/uploads/products/${file.filename}`;

      const newProduct = await productService.create(
        { ...productData, price: Number(productData.price), stock: Number(productData.stock) },
        imageUrl
      );
      res
        .status(201)
        .json({ message: "Product created successfully", newProduct });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id as string;
      const productData = req.body as UpdateProduct;
      const file = req.file;

      const imageUrl = file ? `/uploads/products/${file?.filename}` : null;

      const updatedProduct = await productService.update(
        Number(productId),
        { ...productData, stock: Number(productData.stock) },
        imageUrl
      );
      res
        .status(200)
        .json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id as string;
      await productService.delete(Number(productId));
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
