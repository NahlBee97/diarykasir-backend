import { Decimal } from "@prisma/client/runtime/client";

export interface NewProduct {
  name: string;
  category: string;
  price: Decimal;
  stock: number;
  image?: string | null;
}

export interface UpdateProduct {
  name?: string | null;
  category?: string | null;
  price?: Decimal | null;
  stock?: number | null;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: Decimal;
  stock: number;
  image?: string | null;
}
