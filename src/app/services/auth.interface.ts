export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export interface UserProfile {
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
  role: 'USER' | 'ADMIN' | 'STAFF'; // ขึ้นอยู่กับระบบคุณ
}

export interface UpdateProfilePayload {
  name: string;
  avatar: string;
  phoneNumber: string;
  address: string;
}
