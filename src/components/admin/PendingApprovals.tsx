import React from 'react';
import { CheckCircle, XCircle, Building2, Calculator } from 'lucide-react';
import { db } from '../../services/database';
import type { Company, Accounting } from '../../types/auth';

export function PendingApprovals() {
  const [pendingCompanies, setPendingCompanies] = React.useState<Company[]>([]);
  const [pendingAccountings, setPendingAccountings] = React.useState<Accounting[]>([]);

  React.useEffect(() => {
    setPendingCompanies(db.getPendingCompanies());
    setPendingAccountings(db.getPendingAccountings());
  }, []);

  const handleApproveCompany = (companyId: string) => {
    db.approveCompany(companyId);
    setPendingCompanies(db.getPendingCompanies());

    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Empresa aprovada com sucesso';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleRejectCompany = (companyId: string) => {
    db.rejectCompany(companyId);
    setPendingCompanies(db.getPendingCompanies());

    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Empresa rejeitada';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleApproveAccounting = (accountingId: string) => {
    db.approveAccounting(accountingId);
    setPendingAccountings(db.getPendingAccountings());

    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Contabilidade aprovada com sucesso';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleRejectAccounting = (accountingId: string) => {
    db.rejectAccounting(accountingId);
    setPendingAccountings(db.getPendingAccountings());

    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Contabilidade rejeitada';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Aprovações Pendentes</h2>
      </div>

      {/* Pending Companies */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Empresas Pendentes</h3>
        </div>
        <div className="border-t border-gray-200">
          {pendingCompanies.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">Nenhuma empresa pendente de aprovação</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pendingCompanies.map((company) => (
                <li key={company.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Building2 className="h-8 w-8 text-gray-400" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{company.name}</p>
                        <p className="text-sm text-gray-500">CNPJ: {company.cnpj}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveCompany(company.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleRejectCompany(company.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rejeitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Pending Accountings */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Contabilidades Pendentes</h3>
        </div>
        <div className="border-t border-gray-200">
          {pendingAccountings.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">Nenhuma contabilidade pendente de aprovação</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pendingAccountings.map((accounting) => (
                <li key={accounting.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calculator className="h-8 w-8 text-gray-400" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{accounting.name}</p>
                        <p className="text-sm text-gray-500">CNPJ: {accounting.cnpj}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveAccounting(accounting.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleRejectAccounting(accounting.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rejeitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}