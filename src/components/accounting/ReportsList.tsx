import React, { useState } from 'react';
import { Download, Filter, Calendar, FileText } from 'lucide-react';
import { ReportViewer } from './ReportViewer';

interface ReportsListProps {
  accountingId: string;
}

interface Report {
  id: string;
  name: string;
  type: 'DRE' | 'Balancete' | 'Balanço';
  companyName: string;
  companyId: string;
  competencia: string;
  date: Date;
  status: 'pending' | 'completed';
}

export function ReportsList({ accountingId }: ReportsListProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reports] = useState<Report[]>([
    {
      id: '1',
      name: 'DRE Mensal',
      type: 'DRE',
      companyName: 'Empresa Demo 1',
      companyId: 'company-1',
      competencia: '2024-03',
      date: new Date(),
      status: 'completed'
    },
    {
      id: '2',
      name: 'Balancete Trimestral',
      type: 'Balancete',
      companyName: 'Empresa Demo 2',
      companyId: 'company-2',
      competencia: '2024-Q1',
      date: new Date(),
      status: 'pending'
    }
  ]);

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
  };

  if (selectedReport) {
    return (
      <ReportViewer
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        accountingId={accountingId}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Relatórios</h2>
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Calendar className="h-5 w-5 mr-2 text-gray-400" />
            Competência
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-5 w-5 mr-2 text-gray-400" />
            Filtros
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Relatório
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empresa
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Competência
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewReport(report)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {report.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {report.type}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{report.companyName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{report.competencia}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    report.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status === 'completed' ? 'Concluído' : 'Pendente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-blue-600">
                    <Download className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}