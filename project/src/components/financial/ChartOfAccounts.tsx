import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Pencil, Trash2, X } from 'lucide-react';
import { defaultChartOfAccounts, AccountItem } from '../../data/defaultChartOfAccounts';

export function ChartOfAccounts() {
  const [accounts, setAccounts] = useState(defaultChartOfAccounts);
  const [expandedItems, setExpandedItems] = useState<string[]>(['1', '2']);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountItem | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'revenue',
    parentId: ''
  });

  const toggleItem = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAccount) {
      // Update existing account
      const updateAccount = (items: AccountItem[]): AccountItem[] => {
        return items.map(item => {
          if (item.id === editingAccount.id) {
            return {
              ...item,
              code: formData.code,
              name: formData.name,
              type: formData.type as 'revenue' | 'expense',
              parentId: formData.parentId
            };
          }
          if (item.children) {
            return {
              ...item,
              children: updateAccount(item.children)
            };
          }
          return item;
        });
      };

      setAccounts(updateAccount(accounts));
    } else {
      // Add new account
      const newAccount: AccountItem = {
        id: crypto.randomUUID(),
        code: formData.code,
        name: formData.name,
        type: formData.type as 'revenue' | 'expense',
        parentId: formData.parentId
      };

      if (!formData.parentId) {
        setAccounts([...accounts, newAccount]);
      } else {
        const addToParent = (items: AccountItem[]): AccountItem[] => {
          return items.map(item => {
            if (item.id === formData.parentId) {
              return {
                ...item,
                children: [...(item.children || []), newAccount]
              };
            }
            if (item.children) {
              return {
                ...item,
                children: addToParent(item.children)
              };
            }
            return item;
          });
        };

        setAccounts(addToParent(accounts));
      }
    }

    setShowForm(false);
    setEditingAccount(null);
    setFormData({ code: '', name: '', type: 'revenue', parentId: '' });
  };

  const handleEdit = (account: AccountItem) => {
    setEditingAccount(account);
    setFormData({
      code: account.code,
      name: account.name,
      type: account.type,
      parentId: account.parentId || ''
    });
    setShowForm(true);
  };

  const getParentOptions = (items: AccountItem[], level = 0): JSX.Element[] => {
    return items.flatMap(item => [
      <option key={item.id} value={item.id}>
        {'  '.repeat(level) + item.name}
      </option>,
      ...(item.children ? getParentOptions(item.children, level + 1) : [])
    ]);
  };

  const renderAccountItem = (account: AccountItem, level: number = 0) => {
    const hasChildren = account.children && account.children.length > 0;
    const isExpanded = expandedItems.includes(account.id);

    return (
      <div key={account.id}>
        <div
          className={`
            flex items-center px-4 py-2 hover:bg-gray-50
            ${level > 0 ? 'ml-' + (level * 4) : ''}
          `}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleItem(account.id)}
              className="p-1 hover:bg-gray-200 rounded-full mr-2"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-6 mr-2" />
          )}
          
          <div className="flex-1">
            <span className="text-gray-600 mr-2">{account.code}</span>
            <span className="text-gray-900">{account.name}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`
              px-2 py-1 rounded-full text-xs
              ${account.type === 'revenue' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            `}>
              {account.type === 'revenue' ? 'Receita' : 'Despesa'}
            </span>
            <button
              onClick={() => handleEdit(account)}
              className="p-1 text-gray-400 hover:text-blue-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {account.children!.map(child => renderAccountItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Plano de Contas</h2>
        <button
          onClick={() => {
            setEditingAccount(null);
            setFormData({ code: '', name: '', type: 'revenue', parentId: '' });
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Conta</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingAccount ? 'Editar Conta' : 'Nova Conta'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingAccount(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="revenue">Receita</option>
                  <option value="expense">Despesa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conta Pai
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione uma conta pai (opcional)</option>
                  {getParentOptions(accounts)}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAccount(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingAccount ? 'Salvar Alterações' : 'Criar Conta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border">
        <div className="divide-y">
          {accounts.map(account => renderAccountItem(account))}
        </div>
      </div>
    </div>
  );
}