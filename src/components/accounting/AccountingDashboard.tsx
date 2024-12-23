import React, { useState } from 'react';
import { Building2, FileText, Users, Settings, LogOut } from 'lucide-react';
import { ClientList } from './ClientList';
import { ReportsList } from './ReportsList';
import { AccountingSettings } from './AccountingSettings';

type Tab = 'clients' | 'reports' | 'settings';

interface AccountingDashboardProps {
  user: any;
  onLogout: () => void;
}

export function AccountingDashboard({ user, onLogout }: AccountingDashboardProps) {
  const [currentTab, setCurrentTab] = useState<Tab>('clients');
  const systemName = localStorage.getItem('systemName') || 'Financial Control';
  const systemLogo = localStorage.getItem('systemLogo');

  const renderContent = () => {
    switch (currentTab) {
      case 'clients':
        return <ClientList accountingId={user.accountingId} />;
      case 'reports':
        return <ReportsList accountingId={user.accountingId} />;
      case 'settings':
        return <AccountingSettings accountingId={user.accountingId} />;
      default:
        return <ClientList accountingId={user.accountingId} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {systemLogo ? (
                <img src={systemLogo} alt={systemName} className="h-8" />
              ) : (
                <h1 className="text-xl font-semibold text-gray-800">{systemName}</h1>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{user.name}</span>
              <button
                onClick={onLogout}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setCurrentTab('clients')}
                className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                  currentTab === 'clients'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Building2 className={`-ml-1 mr-2 h-5 w-5 ${
                  currentTab === 'clients' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                Clientes
              </button>

              <button
                onClick={() => setCurrentTab('reports')}
                className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                  currentTab === 'reports'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className={`-ml-1 mr-2 h-5 w-5 ${
                  currentTab === 'reports' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                Relatórios
              </button>

              <button
                onClick={() => setCurrentTab('settings')}
                className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                  currentTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className={`-ml-1 mr-2 h-5 w-5 ${
                  currentTab === 'settings' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                Configurações
              </button>
            </nav>
          </div>

          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}