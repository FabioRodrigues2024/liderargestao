import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Building2, CheckCircle, XCircle, Power, Edit, KeyRound } from 'lucide-react';
import type { Accounting } from '../../types/auth';
import { EditAccountingModal } from './EditAccountingModal';

export function AccountingList() {
  const [accountings, setAccountings] = useState<Accounting[]>([
    {
      id: 'acc-1',
      name: 'Liderar Contabilidade',
      cnpj: '13.636.911/0001-51',
      email: 'contato@liderarcontabilidade.com.br',
      phone: '(11) 3333-4444',
      address: 'Rua Principal, 123 - Centro',
      responsible: 'João Silva',
      companies: [],
      active: true,
      status: 'approved',
      createdAt: new Date()
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccounting, setSelectedAccounting] = useState<Accounting | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleToggleStatus = (accountingId: string) => {
    setAccountings(prev =>
      prev.map(acc =>
        acc.id === accountingId ? { ...acc, active: !acc.active } : acc
      )
    );

    const accounting = accountings.find(acc => acc.id === accountingId);
    if (accounting) {
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = `Contabilidade ${accounting.active ? 'desativada' : 'ativada'} com sucesso`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  const handleResetPassword = (accountingId: string) => {
    const accounting = accountings.find(a => a.id === accountingId);
    if (accounting) {
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = `Email de reset de senha enviado para ${accounting.email}`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  const handleSaveEdit = (accountingId: string, data: Partial<Accounting>) => {
    setAccountings(prev =>
      prev.map(acc =>
        acc.id === accountingId ? { ...acc, ...data } : acc
      )
    );
    setShowEditModal(false);
    setSelectedAccounting(null);

    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Dados da contabilidade atualizados com sucesso';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar contabilidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="ml-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Filter className="h-5 w-5 mr-2 text-gray-400" />
            Filtros
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {accountings.length === 0 ? (
            <li className="px-6 py-8 text-center text-gray-500">
              Nenhuma contabilidade cadastrada
            </li>
          ) : (
            accountings.map((accounting) => (
              <li key={accounting.id}>
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {accounting.name}
                        </h3>
                        <div className="text-sm text-gray-500">
                          CNPJ: {accounting.cnpj}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          accounting.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : accounting.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {accounting.status === 'approved' ? 'Aprovado' : 
                         accounting.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedAccounting(accounting);
                          setShowEditModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Editar dados"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleResetPassword(accounting.id)}
                        className="p-1 text-gray-400 hover:text-yellow-600"
                        title="Resetar senha"
                      >
                        <KeyRound className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(accounting.id)}
                        className={`p-1 ${
                          accounting.active
                            ? 'text-green-600 hover:text-green-700'
                            : 'text-red-600 hover:text-red-700'
                        }`}
                        title={accounting.active ? 'Desativar contabilidade' : 'Ativar contabilidade'}
                      >
                        <Power className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {accounting.email}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Responsável
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {accounting.responsible}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Empresas Vinculadas
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {accounting.companies.length}
                      </dd>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {showEditModal && selectedAccounting && (
        <EditAccountingModal
          accounting={selectedAccounting}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAccounting(null);
          }}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}