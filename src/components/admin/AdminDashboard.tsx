import React, { useState } from 'react';
import { Users, Building2, Calculator, Settings, LogOut } from 'lucide-react';
import { CompanyList } from './CompanyList';
import { AccountingList } from './AccountingList';
import { AppSettings } from './AppSettings';

type Tab = 'companies' | 'accounting' | 'settings';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [currentTab, setCurrentTab] = useState<Tab>('companies');

  const renderContent = () => {
    switch (currentTab) {
      case 'companies':
        return <CompanyList />;
      case 'accounting':
        return <AccountingList />;
      case 'settings':
        return <AppSettings />;
      default:
        return <CompanyList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-800">Financial Control</h1>
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
                onClick={() => setCurrentTab('companies')}
                className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                  currentTab === 'companies'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Building2 className={`-ml-1 mr-2 h-5 w-5 ${
                  currentTab === 'companies' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                Empresas
              </button>

              <button
                onClick={() => setCurrentTab('accounting')}
                className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                  currentTab === 'accounting'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calculator className={`-ml-1 mr-2 h-5 w-5 ${
                  currentTab === 'accounting' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                Contabilidades
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