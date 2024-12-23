import React, { useState } from 'react';
import { Calendar, Filter, Eye, FileText, AlertCircle, Check } from 'lucide-react';
import type { Transaction } from '../../types';
import { demoTransactions } from '../../data/demoData';

export function AccountsReceivable() {
  const [receivables, setReceivables] = useState<Transaction[]>(demoTransactions);
  const [filterDate, setFilterDate] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Filter only future income
  const futureReceivables = receivables.filter(
    (receivable) => 
      receivable.type === 'INCOME' && 
      new Date(receivable.date) > new Date() &&
      !receivable.paid
  );

  const handleConfirmReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowConfirmDialog(true);
  };

  const confirmReceipt = () => {
    if (!selectedTransaction) return;

    // Update the transaction with receipt date and status
    const updatedReceivables = receivables.map(r => {
      if (r.id === selectedTransaction.id) {
        return {
          ...r,
          paid: true,
          date: new Date().toISOString(),
        };
      }
      return r;
    });

    setReceivables(updatedReceivables);
    setShowConfirmDialog(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Contas a Receber</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="month"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border rounded-lg pr-10"
            />
            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-200">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Vencimento
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Descrição
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Categoria
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  Valor
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {futureReceivables.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                      <p>Nenhuma conta a receber encontrada</p>
                    </div>
                  </td>
                </tr>
              ) : (
                futureReceivables.map((receivable) => (
                  <tr key={receivable.id} className="border-b last:border-0">
                    <td className="px-6 py-4 text-gray-800">
                      {new Date(receivable.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {receivable.description.split('-')[1]?.trim() || 'Cliente'}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {receivable.description.split('-')[0]?.trim()}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {receivable.category}
                    </td>
                    <td className="px-6 py-4 text-right text-green-600">
                      R$ {receivable.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        A Receber
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleConfirmReceipt(receivable)}
                          className="p-2 text-gray-400 hover:text-green-600"
                          title="Confirmar recebimento"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600">
                          <FileText className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar Recebimento
            </h3>
            <p className="text-gray-500 mb-6">
              Tem certeza que deseja confirmar o recebimento desta conta?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmReceipt}
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}