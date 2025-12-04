export interface INewProduct {
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string | null;
}

export interface IUpdateProduct {
  name?: string | null;
  category?: string | null;
  price?: number | null;
  stock?: number | null;
}

export interface IProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string | null;
}
