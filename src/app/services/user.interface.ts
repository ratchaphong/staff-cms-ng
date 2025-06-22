// src/app/interfaces/user.interface.ts

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  avatar: string;
  phoneNumber: string;
  address: string;
  deletedAt: string | null;
  isDeleted: boolean;
  role: 'USER' | 'ADMIN'; // หรือ string ถ้ามีหลายค่า
}

export interface UserQuery {
  name?: string;
  email?: string;
  phoneNumber?: string;
  orderBy: 'name' | 'createdAt' | 'updatedAt';
  order: 'asc' | 'desc';
  page: number;
  perPage: number;
}
