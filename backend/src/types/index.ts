import { Request } from "express";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export interface OrderItemDTO {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
