export type UserRole = 'admin' | 'company' | 'accountant' | 'company_user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  accountingId?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  owner: string;
  mainEmail: string;
  commercialEmail?: string;
  phone?: string;
  accountingId: string;
  users: User[];
  active: boolean;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  permissions: string[];
}

export interface CompanyData {
  products: Product[];
  services: Service[];
  customers: Customer[];
  transactions: Transaction[];
  chartOfAccounts: ChartAccount[];
  quotes: Quote[];
  banks: Bank[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  companyId: string;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  companyId?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  companyId?: string;
  socioNome?: string;
  socioCpf?: string;
}

export interface Quote {
  id: string;
  companyId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  items: QuoteItem[];
  total: number;
  date: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  validUntil: string;
  notes?: string;
}

export interface QuoteItem {
  type: 'product' | 'service';
  id: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'INCOME' | 'EXPENSE';
  paymentMethod: string;
  bankId: string;
  category: string;
  paid: boolean;
}

export interface ChartAccount {
  id: string;
  code: string;
  name: string;
  type: 'revenue' | 'expense';
  parentId?: string;
  companyId?: string;
}

export interface Bank {
  id: string;
  name: string;
  code: string;
  companyId?: string;
}

export interface Accounting {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  responsible: string;
  companies: string[];
  active: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}