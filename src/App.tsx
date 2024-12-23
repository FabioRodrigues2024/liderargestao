import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Banks } from './components/Banks';
import { Customers } from './components/Customers';
import { Products } from './components/Products';
import { Reports } from './components/Reports';
import { Services } from './components/services/Services';
import { Quotes } from './components/quotes/Quotes';
import { CompanySettings } from './components/settings/CompanySettings';
import { LoginPage } from './components/auth/LoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AccountingDashboard } from './components/accounting/AccountingDashboard';
import { AccountsPayable } from './components/financial/AccountsPayable';
import { AccountsReceivable } from './components/financial/AccountsReceivable';
import { ChartOfAccounts } from './components/financial/ChartOfAccounts';

export type View = 'dashboard' | 'transactions' | 'banks' | 'customers' | 'products' | 'services' | 
           'quotes' | 'reports' | 'settings' | 'payables' | 'receivables' | 'chart-accounts';

export type UserRole = 'admin' | 'client' | 'accounting' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountingId?: string;
  companyId?: string;
}

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [user, setUser] = useState<User | null>(null);

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  if (user.role === 'accounting') {
    return <AccountingDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <Layout onNavigate={handleNavigate} currentView={currentView} user={user} onLogout={handleLogout}>
      {renderView()}
    </Layout>
  );

  function renderView() {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'banks':
        return <Banks />;
      case 'customers':
        return <Customers />;
      case 'products':
        return <Products />;
      case 'services':
        return <Services />;
      case 'quotes':
        return <Quotes />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <CompanySettings onSave={() => {}} />;
      case 'payables':
        return <AccountsPayable />;
      case 'receivables':
        return <AccountsReceivable />;
      case 'chart-accounts':
        return <ChartOfAccounts />;
      default:
        return <Dashboard />;
    }
  }
}

export default App;