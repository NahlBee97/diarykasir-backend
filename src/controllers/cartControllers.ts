import { Request, Response, NextFunction } from "express";
import { IAddItem } from "../interfaces/cartInterface";
import { cartService } from "../services/cartServices";

export const cartController = {
  getUserCart: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as number;
      const cart = await cartService.getUserCart(userId);
      res.status(200).json({ message: "User cart retrieved", cart });
    } catch (error) {
      next(error);
    }
  },
  
  addItem: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id as number;
      const { productId, quantity } = req.body as IAddItem;
  
      const cart = await cartService.addItem(userId, Number(productId), quantity);
      res
        .status(200)
        .json({ message: "Item added to cart successfully", cart});
    } catch (error) {
      
      next(error);
    }
  },

  updateItem: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;
  
      const cart = await cartService.updateItem(Number(itemId), quantity);
      res
        .status(200)
        .json({ message: "Item updated in cart successfully", cart });
    } catch (error) {
      
      next(error);
    }
  },

  deleteItem: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { itemId } = req.params as { itemId: string };
  
      await cartService.deleteItem(Number(itemId));
      
      res.status(200).json({ message: "Item deleted from cart successfully" });
    } catch (error) {
      
      next(error);
    }
  }
}; 



