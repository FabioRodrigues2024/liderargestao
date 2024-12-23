export * from './transactions';
export * from './auth';

export interface Bank {
  id: string;
  name: string;
  code: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Quote {
  id: string;
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface CategoryMapping {
  originalDescription: string;
  category: string;
}