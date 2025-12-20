import { Product } from "./productInterface";

export interface IAddItem {
  productId: number;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  quantity: number; 
  items?: CartItem[];
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  product?: Product;
  quantity: number;
}

