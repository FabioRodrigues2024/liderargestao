import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, BarChart, ArrowRight } from 'lucide-react';
import type { Company } from '../../types/auth';
import { ClientView } from './ClientView';

interface ClientListProps {
  accountingId: string;
}

export function ClientList({ accountingId }: ClientListProps) {
  const [clients, setClients] = useState<Company[]>([
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
      createdAt: new Date(),
      status: 'active' as const, // Use 'as const' para garantir o tipo correto
      permissions: []
    },
    {
      id: 'company-2',
      name: 'Empresa Demo 2',
      cnpj: '00.000.000/0001-02',
      address: 'Av Principal, 456',
      owner: 'Maria Santos',
      mainEmail: 'maria@empresa2.com',
      accountingId: 'accounting-1',
      users: [],
      active: true,
      createdAt: new Date(),
      status: 'active' as const, // Use 'as const' para garantir o tipo correto
      permissions: []
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Company | null>(null);

  // Filtragem de clientes usando useMemo para melhorar a performance
  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cnpj.includes(searchTerm)
    );
  }, [clients, searchTerm]);

  const handleViewClient = (client: Company) => {
    setSelectedClient(client);
  };

  const handleBackToList = () => {
    setSelectedClient(null);
  };

  const handleDownloadReport = (clientId: string) => {
    console.log('Download report:', clientId);
    // Implementar lógica de download do relatório
  };

  const handleViewAnalytics = (clientId: string) => {
    console.log('View analytics:', clientId);
    // Implementar lógica para visualizar análises
  };

  if (selectedClient) {
    return <ClientView client={selectedClient} onBack={handleBackToList} />;
  }

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
              placeholder="Buscar clientes..."
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
          {filteredClients.map((client) => (
            <li key={client.id}>
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {client.name}
                    </h3>
                    <div className="mt-1 text-sm text-gray-500">
                      CNPJ: {client.cnpj}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleViewClient(client)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Acessar Área
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadReport(client.id)}
                      className="p-2 text-gray-400 hover:text-green-600"
                      title="Baixar relatório"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleViewAnalytics(client.id)}
                      className="p-2 text-gray-400 hover:text-purple-600"
                      title="Ver análises"
                    >
                      <BarChart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Responsável
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {client.owner}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Email
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {client.mainEmail}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {client.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </dd>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}