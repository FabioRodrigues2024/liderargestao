export interface BaseTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  paymentMethod: string;
  bankId: string;
  category?: string;
  paid?: boolean;
  originalDescription?: string;
}

export interface Transaction extends BaseTransaction {
  type: 'INCOME' | 'EXPENSE';
}

export interface ImportTransaction extends Omit<BaseTransaction, 'id'> {
  originalDescription: string;
}