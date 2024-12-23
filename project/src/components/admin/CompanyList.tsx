import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Building2, Edit, Power, KeyRound, Download } from 'lucide-react';
import type { Company } from '../../types/auth';
import { CompanyPermissionsModal } from './CompanyPermissionsModal';
import { EditCompanyModal } from './EditCompanyModal';
import { ExportDataModal } from './ExportDataModal';

export function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: 'company-1',
      name: 'Empresa Demo 1',
      cnpj: '00.000.000/0001-01',
      address: 'Rua Exemplo, 123',
      owner: 'João Silva',
      mainEmail: 'joao@empresa1.com',
      accountingId: 'accounting-1',
      users: [],
      active: true,
      status: 'approved',
      permissions: ['dashboard', 'transactions', 'banks'],
      createdAt: new Date()
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleToggleStatus = (companyId: string) => {
    setCompanies(prev =>
      prev.map(company =>
        company.id === companyId ? { ...company, active: !company.active } : company
      )
    );

    const company = companies.find(c => c.id === companyId);
    if (company) {
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = `Empresa ${company.active ? 'desativada' : 'ativada'} com sucesso`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  const handleResetPassword = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = `Email de reset de senha enviado para ${company.mainEmail}`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  const handleSavePermissions = (companyId: string, permissions: string[]) => {
    setCompanies(prev =>
      prev.map(company =>
        company.id === companyId ? { ...company, permissions } : company
      )
    );
    setShowPermissionsModal(false);
    setSelectedCompany(null);

    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Permissões atualizadas com sucesso';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleSaveEdit = (companyId: string, data: Partial<Company>) => {
    setCompanies(prev =>
      prev.map(company =>
        company.id === companyId ? { ...company, ...data } : company
      )
    );
    setShowEditModal(false);
    setSelectedCompany(null);

    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Dados da empresa atualizados com sucesso';
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
              placeholder="Buscar empresas..."
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
          {companies.length === 0 ? (
            <li className="px-6 py-8 text-center text-gray-500">
              Nenhuma empresa cadastrada
            </li>
          ) : (
            companies.map((company) => (
              <li key={company.id}>
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {company.name}
                        </h3>
                        <div className="text-sm text-gray-500">
                          CNPJ: {company.cnpj}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          company.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : company.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {company.status === 'approved' ? 'Aprovado' : 
                         company.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowPermissionsModal(true);
                        }}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        Permissões
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowEditModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Editar dados"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleResetPassword(company.id)}
                        className="p-1 text-gray-400 hover:text-yellow-600"
                        title="Resetar senha"
                      >
                        <KeyRound className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowExportModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Exportar dados"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(company.id)}
                        className={`p-1 ${
                          company.active
                            ? 'text-green-600 hover:text-green-700'
                            : 'text-red-600 hover:text-red-700'
                        }`}
                        title={company.active ? 'Desativar empresa' : 'Ativar empresa'}
                      >
                        <Power className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Email Principal
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {company.mainEmail}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Responsável
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {company.owner}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Usuários
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {company.users.length}
                      </dd>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {showPermissionsModal && selectedCompany && (
        <CompanyPermissionsModal
          company={selectedCompany}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedCompany(null);
          }}
          onSave={handleSavePermissions}
        />
      )}

      {showEditModal && selectedCompany && (
        <EditCompanyModal
          company={selectedCompany}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCompany(null);
          }}
          onSave={handleSaveEdit}
        />
      )}

      {showExportModal && selectedCompany && (
        <ExportDataModal
          company={selectedCompany}
          onClose={() => {
            setShowExportModal(false);
            setSelectedCompany(null);
          }}
        />
      )}
    </div>
  );
}