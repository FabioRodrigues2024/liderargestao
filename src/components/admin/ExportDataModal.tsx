import React, { useState } from 'react';
import { X, Download, CheckCircle } from 'lucide-react';
import type { Company, CompanyData } from '../../types/auth';
import { exportCompanyData } from '../../utils/exportCompanyData';

interface ExportDataModalProps {
  company: Company;
  onClose: () => void;
}

export function ExportDataModal({ company, onClose }: ExportDataModalProps) {
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      // In a real application, this data would come from your backend
      const companyData: CompanyData = {
        products: [], // Fetch from backend
        services: [], // Fetch from backend
        customers: [], // Fetch from backend
        transactions: [], // Fetch from backend
        chartOfAccounts: [], // Fetch from backend
        quotes: [], // Fetch from backend
        banks: [] // Fetch from backend
      };

      await exportCompanyData(company, companyData);
      setExportComplete(true);
    } catch (error) {
      console.error('Error exporting data:', error);
      // Show error notification
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Exportar Dados da Empresa
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
            Esta operação irá exportar todos os dados cadastrais da empresa {company.name} em formato CSV.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Dados incluídos na exportação:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Produtos</li>
              <li>• Serviços</li>
              <li>• Clientes</li>
              <li>• Transações</li>
              <li>• Plano de Contas</li>
              <li>• Orçamentos</li>
              <li>• Bancos</li>
            </ul>
          </div>

          {exportComplete ? (
            <div className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Exportação concluída com sucesso!</span>
            </div>
          ) : (
            <button
              onClick={handleExport}
              disabled={exporting}
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                exporting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Download className="h-5 w-5 mr-2" />
              {exporting ? 'Exportando...' : 'Iniciar Exportação'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}