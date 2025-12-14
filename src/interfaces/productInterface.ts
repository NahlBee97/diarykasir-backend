import { Decimal } from "@prisma/client/runtime/client";

export interface NewProduct {
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string | null;
}

export interface UpdateProduct {
  name?: string | null;
  category?: string | null;
  price?: number | null;
  stock?: number | null;
  image?: string | null;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string | null;
}
