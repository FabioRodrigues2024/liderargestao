import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Wallet,
  Users, 
  Package,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  Menu,
  FileCheck,
  Receipt,
  CalendarClock,
  BookOpen,
} from 'lucide-react';
import { View, User } from '../App';  // Importando View e User do App.tsx

interface LayoutProps {
  onNavigate: (view: View) => void;
  currentView: View;
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

export function Layout({ children, onNavigate, currentView, user, onLogout }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isFinanceOpen, setIsFinanceOpen] = React.useState(false);
  const systemLogo = localStorage.getItem('systemLogo');
  const systemName = localStorage.getItem('systemName') || 'Financial Control';

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', value: 'dashboard' as View },
    {
      icon: Wallet,
      label: 'Financeiro',
      value: 'finance' as View,
      submenu: [
        { icon: Receipt, label: 'Lançamentos', value: 'transactions' as View },
        { icon: CalendarClock, label: 'Contas a Pagar', value: 'payables' as View },
        { icon: CalendarClock, label: 'Contas a Receber', value: 'receivables' as View },
        { icon: BookOpen, label: 'Plano de Contas', value: 'chart-accounts' as View }
      ]
    },
    { icon: Building2, label: 'Bancos', value: 'banks' as View },
    { icon: Users, label: 'Clientes', value: 'customers' as View },
    { icon: Package, label: 'Produtos', value: 'products' as View },
    { icon: Briefcase, label: 'Serviços', value: 'services' as View },
    { icon: FileCheck, label: 'Orçamentos', value: 'quotes' as View },
    { icon: FileText, label: 'Relatórios', value: 'reports' as View },
    { icon: Settings, label: 'Configurações', value: 'settings' as View }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>
        {systemLogo ? (
          <img src={systemLogo} alt={systemName} className="h-8" />
        ) : (
          <span className="text-lg font-semibold">{systemName}</span>
        )}
      </div>

      {/* Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed lg:static lg:translate-x-0 z-50 
          w-72 h-full min-h-screen
          bg-white border-r transition-transform duration-200 ease-in-out
          flex flex-col
        `}
      >
        <div className="h-24 flex items-center justify-center px-4 border-b">
          {systemLogo ? (
            <img src={systemLogo} alt={systemName} className="h-16 w-auto" />
          ) : (
            <div className="h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-10 w-10 text-white" />
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.value}>
              {item.submenu ? (
                <div className="space-y-1">
                  <button
                    onClick={() => setIsFinanceOpen(!isFinanceOpen)}
                    className={`
                      w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm
                      ${currentView === item.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <svg
                      className={`h-5 w-5 transform transition-transform ${isFinanceOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isFinanceOpen && (
                    <div className="pl-4 space-y-1">
                      {item.submenu.map((subitem) => {
                        const SubIcon = subitem.icon;
                        return (
                          <button
                            key={subitem.value}
                            onClick={() => {
                              onNavigate(subitem.value);
                              setIsSidebarOpen(false);
                            }}
                            className={`
                              w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm
                              ${currentView === subitem.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
                            `}
                          >
                            <SubIcon className="h-5 w-5" />
                            <span className="font-medium">{subitem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    onNavigate(item.value);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm
                    ${currentView === item.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t mt-auto">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen p-4 lg:p-8 lg:ml-0 mt-16 lg:mt-0">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}