import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Company } from '../../types/auth';
import { Dashboard } from '../Dashboard';
import { Transactions } from '../Transactions';
import { Banks } from '../Banks';
import { Reports } from '../Reports';

interface ClientViewProps {
  client: Company;
  onBack: () => void;
}

export function ClientView({ client, onBack }: ClientViewProps) {
  const [currentView, setCurrentView] = React.useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'banks':
        return <Banks />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {client.name}
            </h2>
            <p className="text-sm text-gray-500">CNPJ: {client.cnpj}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'transactions', label: 'Transações' },
              { id: 'banks', label: 'Bancos' },
              { id: 'reports', label: 'Relatórios' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`px-4 py-4 text-sm font-medium border-b-2 ${
                  currentView === item.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}