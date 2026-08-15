export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
  image?: string;
  createdAt?: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface OrderItem {
  id?: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  reference: string;
  customer: string;
  email?: string;
  items: OrderItem[];
  status: string;
  total: number;
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
}
