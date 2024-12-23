import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Send } from 'lucide-react';

interface ReportViewerProps {
  report: any;
  onClose: () => void;
  accountingId: string;
}

interface CompanySignature {
  razaoSocial: string;
  cnpj: string;
  socioNome: string;
  socioCpf: string;
}

interface AccountingSignature {
  razaoSocial: string;
  cnpj: string;
  contador: string;
  crc: string;
}

export function ReportViewer({ report, onClose, accountingId }: ReportViewerProps) {
  const [companyData, setCompanyData] = useState<CompanySignature>({
    razaoSocial: 'Empresa Demo LTDA',
    cnpj: '00.000.000/0001-00',
    socioNome: 'João da Silva',
    socioCpf: '000.000.000-00'
  });

  const [accountingData, setAccountingData] = useState<AccountingSignature>({
    razaoSocial: 'Contabilidade Exemplo LTDA',
    cnpj: '00.000.000/0001-00',
    contador: 'Maria Santos',
    crc: 'CRC-SP 123456/O-0'
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {report.name} - {report.companyName}
            </h2>
            <p className="text-sm text-gray-500">Competência: {report.competencia}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-5 w-5 mr-2" />
            Baixar PDF
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Send className="h-5 w-5 mr-2" />
            Enviar para Cliente
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          {/* Conteúdo do Relatório */}
          <div className="space-y-8">
            {/* Cabeçalho */}
            <div className="text-center">
              <h3 className="text-xl font-bold">{report.type}</h3>
              <p className="text-gray-600">Período: {report.competencia}</p>
            </div>

            {/* Dados do Relatório */}
            <div className="border rounded-lg">
              {/* Aqui você incluiria os dados específicos do relatório (DRE ou Balancete) */}
              <div className="p-4">
                <p className="text-gray-500 italic">
                  Conteúdo do relatório será gerado com base nos lançamentos do período...
                </p>
              </div>
            </div>

            {/* Assinaturas */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t">
              {/* Assinatura da Empresa */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Assinatura da Empresa</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{companyData.razaoSocial}</p>
                  <p className="text-sm text-gray-600">CNPJ: {companyData.cnpj}</p>
                  <p className="text-sm text-gray-600">{companyData.socioNome}</p>
                  <p className="text-sm text-gray-600">CPF: {companyData.socioCpf}</p>
                  <div className="pt-8 border-t border-dashed">
                    <p className="text-sm text-center">Assinatura do Sócio</p>
                  </div>
                </div>
              </div>

              {/* Assinatura da Contabilidade */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Assinatura da Contabilidade</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{accountingData.razaoSocial}</p>
                  <p className="text-sm text-gray-600">CNPJ: {accountingData.cnpj}</p>
                  <p className="text-sm text-gray-600">{accountingData.contador}</p>
                  <p className="text-sm text-gray-600">CRC: {accountingData.crc}</p>
                  <div className="pt-8 border-t border-dashed">
                    <p className="text-sm text-center">Assinatura do Contador</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}