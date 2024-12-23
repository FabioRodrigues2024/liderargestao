import React, { useState, useRef, useEffect } from 'react';
import { Plus, Upload, Download, Filter, X, Pencil, Trash2 } from 'lucide-react';
import type { Transaction } from '../types';
import { parseOfxContent } from '../utils/ofxParser';
import { defaultChartOfAccounts, AccountItem } from '../data/defaultChartOfAccounts';
import { banks } from '../data/banks';
import { demoTransactions } from '../data/demoData';

type Transaction = BaseTransaction & {
  type: 'INCOME' | 'EXPENSE';
};

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(demoTransactions);
  const [showForm, setShowForm] = useState(false);
  const [categories] = useState(defaultChartOfAccounts);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    try {
      const text = await file.text();
      const { transactions: parsedTransactions, bankInfo } = parseOfxContent(text);
      
      if (parsedTransactions.length === 0) {
        throw new Error('Nenhuma transação encontrada no arquivo');
      }
  
      if (bankInfo) {
        const existingBank = banks.find(b => b.code === bankInfo.bankId);
        if (existingBank) {
          // Você pode usar setSelectedBank aqui se necessário
          // setSelectedBank(existingBank.id);
        }
      }
  
      const mappedTransactions = parsedTransactions.map(transaction => ({
        ...transaction,
        id: crypto.randomUUID(), // Adicione um ID único para cada transação
      }));
  
      setTransactions(prevTransactions => [...prevTransactions, ...mappedTransactions]);
    } catch (error) {
      console.error('Erro ao importar arquivo:', error);
      alert(error instanceof Error ? error.message : 'Erro ao processar arquivo OFX');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg';
      notification.textContent = 'Não há transações para exportar';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      return;
    }

    const headers = ['Data', 'Banco', 'Descrição', 'Valor', 'Tipo', 'Categoria'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        banks.find(b => b.id === t.bankId)?.name || '',
        `"${t.description}"`,
        t.amount.toFixed(2),
        t.type === 'INCOME' ? 'Receita' : 'Despesa',
        t.category
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transacoes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      setTransactions(transactions.filter(t => t.id !== transactionToDelete.id));
      setShowDeleteConfirm(false);
      setTransactionToDelete(null);

      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Lançamento excluído com sucesso';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const transactionData: Transaction = {
      id: editingTransaction?.id || crypto.randomUUID(),
      date: formData.get('date') as string,
      amount: parseFloat(formData.get('amount') as string),
      description: formData.get('description') as string,
      type: (formData.get('type') as 'INCOME' | 'EXPENSE') || 'EXPENSE',
      paymentMethod: formData.get('paymentMethod') as string,
      bankId: formData.get('bankId') as string,
      category: formData.get('category') as string,
      paid: true
    };

    if (editingTransaction) {
      setTransactions(transactions.map(t => 
        t.id === editingTransaction.id ? transactionData : t
      ));

      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Lançamento atualizado com sucesso';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } else {
      setTransactions([...transactions, transactionData]);

      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Lançamento criado com sucesso';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }

    setShowForm(false);
    setEditingTransaction(null);
  };

  const getFlattenedCategories = React.useCallback((items: AccountItem[], result: AccountItem[] = []): AccountItem[] => {
    items.forEach(item => {
      result.push(item);
      if (item.children) {
        getFlattenedCategories(item.children, result);
      }
    });
    return result;
  }, []);

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.description.toLowerCase().includes(searchLower) ||
      (transaction.category?.toLowerCase() ?? '').includes(searchLower) ||
      (banks.find(b => b.id === transaction.bankId)?.name.toLowerCase() ?? '').includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Lançamentos</h2>
        <div className="flex space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".ofx,.qfx"
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-200"
          >
            <Upload className="h-5 w-5" />
            <span>Importar OFX</span>
          </button>
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-200"
          >
            <Download className="h-5 w-5" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={() => {
              setEditingTransaction(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            <span>Novo Lançamento</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {editingTransaction ? 'Editar Lançamento' : 'Novo Lançamento'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingTransaction(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={editingTransaction?.date.split('T')[0] || new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Valor</label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    defaultValue={editingTransaction?.amount || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <input
                    type="text"
                    name="description"
                    defaultValue={editingTransaction?.description || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <select
                    name="type"
                    defaultValue={editingTransaction?.type || 'EXPENSE'}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="INCOME">Receita</option>
                    <option value="EXPENSE">Despesa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Forma de Pagamento</label>
                  <select
                    name="paymentMethod"
                    defaultValue={editingTransaction?.paymentMethod || 'TRANSFER'}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="TRANSFER">Transferência</option>
                    <option value="CREDIT">Cartão de Crédito</option>
                    <option value="DEBIT">Cartão de Débito</option>
                    <option value="CASH">Dinheiro</option>
                    <option value="PIX">PIX</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Banco</label>
                  <select
                    name="bankId"
                    defaultValue={editingTransaction?.bankId || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione um banco</option>
                    {banks.map(bank => (
                      <option key={bank.id} value={bank.id}>{bank.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoria</label>
                  <select
                    name="category"
                    defaultValue={editingTransaction?.category || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {getFlattenedCategories(categories).map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTransaction(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {editingTransaction ? 'Salvar Alterações' : 'Criar Lançamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar lançamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-200">
              <Filter className="h-5 w-5" />
              <span>Filtros</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Data</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Banco</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Descrição</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Categoria</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Valor</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum lançamento encontrado
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b last:border-0">
                    <td className="px-6 py-4 text-gray-800">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {banks.find(b => b.id === transaction.bankId)?.name}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'INCOME' ? '+' : '-'}
                        R$ {transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-2 text-gray-400 hover:text-blue-600"
                          title="Editar"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Excluir"
                        >
                          <Trash2 className="h-5 w-5" />
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

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-500 mb-6">
              Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}