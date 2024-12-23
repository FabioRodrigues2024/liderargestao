import React, { useState } from 'react';
import { Search, X, Plus } from 'lucide-react';
import type { Customer } from '../../types';

interface CustomerSelectionModalProps {
  onClose: () => void;
  onSelect: (customer: Customer) => void;
  customers: Customer[];
}

type NewCustomer = Omit<Customer, 'id'>;

export function CustomerSelectionModal({
  onClose,
  onSelect,
  customers,
}: CustomerSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState<NewCustomer>({
    name: '',
    email: '',
    phone: '',
    document: '',
  });

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.document.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCustomer = () => {
    const customer: Customer = {
      id: crypto.randomUUID(),
      ...newCustomer
    };
    onSelect(customer);
    setShowNewForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Selecionar Cliente</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={20} />
            </button>
          </div>
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {showNewForm ? (
          <div className="p-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Novo Cliente</h4>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Razão Social</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={newCustomer.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="document" className="block text-sm font-medium text-gray-700">CNPJ</label>
                <input
                  id="document"
                  name="document"
                  type="text"
                  value={newCustomer.document}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={newCustomer.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateCustomer}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Criar e Selecionar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto flex-grow">
            {filteredCustomers.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <li key={customer.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer" onClick={() => onSelect(customer)}>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{customer.name}</p>
                        <p className="text-sm text-gray-500 truncate">{customer.document}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">Nenhum cliente encontrado</p>
              </div>
            )}
          </div>
        )}

        {!showNewForm && (
          <div className="p-4 border-t">
            <button
              onClick={() => setShowNewForm(true)}
              className="flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={20} className="mr-2" />
              Novo Cliente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}