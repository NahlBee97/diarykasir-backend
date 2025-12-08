import { OrderStatus } from "../generated/prisma/enums";
import { Cart } from "./cartInterface";
import { Product } from "./productInterface";

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  paymentCash: number;
  paymentChange: number;
  status: OrderStatus;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  orderId: number;
  productId: number;
  product?: Product;
}

export interface NewOrder {
  userId: number;
  cart: Cart;
  totalAmount: number;
  paymentCash: number;
  paymentChange: number;
}

export interface NewOrderItem {
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}