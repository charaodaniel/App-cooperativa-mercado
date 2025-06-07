export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  description: string;
  image?: string;
}

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  marketId: string;
  marketName: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'delivered';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface Market {
  id: string;
  name: string;
  owner: string;
  address: string;
  phone: string;
  email: string;
  cnpj: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'cooperative' | 'market';
  marketId?: string;
}