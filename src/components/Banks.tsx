import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Bank } from '../types';

export function Banks() {
  const [showForm, setShowForm] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([
    { id: '1', name: 'Itaú', code: '341' },
    { id: '2', name: 'Bradesco', code: '237' },
    { id: '3', name: 'Santander', code: '033' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Bancos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Banco</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Adicionar Novo Banco
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Banco
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Itaú"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código do Banco
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: 341"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Nome
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Código
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {banks.map((bank) => (
                <tr key={bank.id} className="border-b last:border-0">
                  <td className="px-6 py-4 text-gray-800">{bank.name}</td>
                  <td className="px-6 py-4 text-gray-800">{bank.code}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600">
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}