import { saveAs } from 'file-saver';
import { Company, CompanyData } from '../types/auth';

export async function exportCompanyData(company: Company, data: CompanyData) {
  // Helper function to convert array to CSV
  const arrayToCSV = (array: any[], headers: string[]) => {
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    for (const item of array) {
      const values = headers.map(header => {
        const value = item[header.toLowerCase()];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };

  // Create separate CSV files for each data type
  const exports = {
    products: {
      headers: ['ID', 'Name', 'Description', 'Price', 'Stock', 'SKU'],
      data: data.products
    },
    services: {
      headers: ['ID', 'Name', 'Description', 'Price'],
      data: data.services
    },
    customers: {
      headers: ['ID', 'Name', 'Email', 'Phone', 'Document'],
      data: data.customers
    },
    transactions: {
      headers: ['ID', 'Date', 'Description', 'Amount', 'Type', 'Category', 'Status'],
      data: data.transactions
    },
    chartOfAccounts: {
      headers: ['ID', 'Code', 'Name', 'Type', 'ParentId'],
      data: data.chartOfAccounts
    }
  };

  // Generate and download files
  for (const [key, value] of Object.entries(exports)) {
    const csv = arrayToCSV(value.data, value.headers);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${company.cnpj}_${key}_${new Date().toISOString().split('T')[0]}.csv`);
  }

  // Create a summary file with metadata
  const summary = {
    companyName: company.name,
    cnpj: company.cnpj,
    exportDate: new Date().toISOString(),
    totalProducts: data.products.length,
    totalServices: data.services.length,
    totalCustomers: data.customers.length,
    totalTransactions: data.transactions.length,
    totalAccounts: data.chartOfAccounts.length
  };

  const summaryBlob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
  saveAs(summaryBlob, `${company.cnpj}_export_summary_${new Date().toISOString().split('T')[0]}.json`);
}