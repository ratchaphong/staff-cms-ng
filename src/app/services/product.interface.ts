// src/app/pages/product/product.model.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isDeleted: boolean;
  deletedAt: string | null;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface CreateProductPayload extends Partial<Product> {}

export interface UpdateProductPayload extends Partial<Product> {}
