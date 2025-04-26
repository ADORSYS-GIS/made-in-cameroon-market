import axios from 'axios';

export interface Transaction {
  id: string;
  vendorId: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface TransactionSummary {
  totalSales: number;
  transactionCount: number;
}

export const getTransactions = async (
  dateRange?: { start: string; end: string }
): Promise<Transaction[]> => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/transactions`, {
    params: dateRange,
  });
  return response.data;
};

export const getTransactionSummary = async (): Promise<TransactionSummary> => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/transactions/summary`);
  return response.data;
};