import { supabase } from './supabase';
import { Company, CompanyData, Transaction, Product, Service, Quote, Customer } from '../types/auth';

export const storageService = {
  // Company Data
  getCompanyData: async (companyId: string): Promise<CompanyData | null> => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();
    
    if (error) throw error;
    return data;
  },

  saveCompanyData: async (companyId: string, data: Partial<CompanyData>): Promise<void> => {
    const { error } = await supabase
      .from('companies')
      .upsert({ id: companyId, ...data });
    
    if (error) throw error;
  },

  // Transactions
  getTransactions: async (companyId: string): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('companyId', companyId);
    
    if (error) throw error;
    return data || [];
  },

  saveTransactions: async (companyId: string, transactions: Omit<Transaction, 'companyId'>[]): Promise<void> => {
    const { error } = await supabase
      .from('transactions')
      .upsert(transactions.map(t => ({ ...t, companyId })));
    
    if (error) throw error;
  },

  addTransaction: async (companyId: string, transaction: Omit<Transaction, 'companyId'>): Promise<void> => {
    const { error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, companyId }]);
    
    if (error) throw error;
  },

  // Products
  getProducts: async (companyId: string): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('companyId', companyId);
    
    if (error) throw error;
    return data || [];
  },

  saveProducts: async (companyId: string, products: Omit<Product, 'companyId'>[]): Promise<void> => {
    const { error } = await supabase
      .from('products')
      .upsert(products.map(p => ({ ...p, companyId })));
    
    if (error) throw error;
  },

  // Services
  getServices: async (companyId: string): Promise<Service[]> => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('companyId', companyId);
    
    if (error) throw error;
    return data || [];
  },

  saveServices: async (companyId: string, services: Omit<Service, 'companyId'>[]): Promise<void> => {
    const { error } = await supabase
      .from('services')
      .upsert(services.map(s => ({ ...s, companyId })));
    
    if (error) throw error;
  },

  // Quotes
  getQuotes: async (companyId: string): Promise<Quote[]> => {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('companyId', companyId);
    
    if (error) throw error;
    return data || [];
  },

  saveQuotes: async (companyId: string, quotes: Omit<Quote, 'companyId'>[]): Promise<void> => {
    const { error } = await supabase
      .from('quotes')
      .upsert(quotes.map(q => ({ ...q, companyId })));
    
    if (error) throw error;
  },

  // Customers
  getCustomers: async (companyId: string): Promise<Customer[]> => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('companyId', companyId);
    
    if (error) throw error;
    return data || [];
  },

  saveCustomers: async (companyId: string, customers: Omit<Customer, 'companyId'>[]): Promise<void> => {
    const { error } = await supabase
      .from('customers')
      .upsert(customers.map(c => ({ ...c, companyId })));
    
    if (error) throw error;
  },
};