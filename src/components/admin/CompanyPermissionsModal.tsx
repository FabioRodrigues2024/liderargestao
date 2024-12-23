import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Company } from '../../types/auth';

interface CompanyPermissionsModalProps {
  company: Company;
  onClose: () => void;
  onSave: (companyId: string, permissions: string[]) => void;
}

const AVAILABLE_PERMISSIONS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'transactions', label: 'Lançamentos' },
  { id: 'banks', label: 'Bancos' },
  { id: 'customers', label: 'Clientes' },
  { id: 'products', label: 'Produtos' },
  { id: 'services', label: 'Serviços' },
  { id: 'quotes', label: 'Orçamentos' },
  { id: 'reports', label: 'Relatórios' },
  { id: 'payables', label: 'Contas a Pagar' },
  { id: 'receivables', label: 'Contas a Receber' },
  { id: 'chart-accounts', label: 'Plano de Contas' }
];

export function CompanyPermissionsModal({
  company,
  onClose,
  onSave
}: CompanyPermissionsModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    company.permissions || []
  );

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions(current =>
      current.includes(permissionId)
        ? current.filter(id => id !== permissionId)
        : [...current, permissionId]
    );
  };

  const handleSave = () => {
    onSave(company.id, selectedPermissions);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Permissões - {company.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Selecione os módulos que esta empresa terá acesso:
          </p>

          <div className="grid grid-cols-2 gap-4">
            {AVAILABLE_PERMISSIONS.map((permission) => (
              <label
                key={permission.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(permission.id)}
                  onChange={() => handleTogglePermission(permission.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  {permission.label}
                </span>
              </label>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Salvar Permissões
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}