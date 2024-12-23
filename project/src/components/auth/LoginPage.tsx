import React, { useState } from 'react';
import { Mail, Lock, Building2, Calculator, Settings, AlertCircle } from 'lucide-react';
import { RegisterPage } from './RegisterPage';
import { supabase } from '../../services/supabase';

type LoginType = 'client' | 'admin' | 'accounting';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

// Admin credentials
const ADMIN_EMAIL = 'fabio@fcontador.com.br';
const ADMIN_PASSWORD = 'F4b10@058';

// Demo company credentials 
const DEMO_EMAIL = 'empresa@teste.com.br';
const DEMO_PASSWORD = 'Empresa@123'; 

export function LoginPage({ onLogin }: LoginPageProps) {
  const [loginType, setLoginType] = useState<LoginType>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const systemLogo = localStorage.getItem('systemLogo');
  const systemName = localStorage.getItem('systemName') || 'Financial Control';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Admin authentication
    if (loginType === 'admin') {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        onLogin({
          id: '1',
          name: 'Administrador',
          email: ADMIN_EMAIL,
          role: 'admin'
        });
      } else {
        setError('Email ou senha inválidos');
      }
      return;
    }

    // Demo company authentication
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      onLogin({
        id: 'demo-company',
        name: 'Empresa Teste',
        email: DEMO_EMAIL,
        role: 'client'
      });
      return;
    }

    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (!user) {
        setError('Usuário não encontrado');
        return;
      }

      // Buscar dados da empresa/contabilidade
      const { data: profile, error: profileError } = await supabase
        .from(loginType === 'client' ? 'companies' : 'accountings')
        .select('*')
        .eq('owner', user.id)
        .single();

      if (profileError) throw profileError;

      if (!profile) {
        setError('Perfil não encontrado');
        return;
      }

      if (!profile.active) {
        setError('Sua conta está pendente de aprovação');
        return;
      }

      onLogin({
        id: user.id,
        name: profile.name,
        email: user.email,
        role: loginType,
        companyId: loginType === 'client' ? profile.id : undefined,
        accountingId: loginType === 'accounting' ? profile.id : undefined
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    }
  };

  if (showRegister) {
    return <RegisterPage onBack={() => setShowRegister(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            {systemLogo ? (
              <img src={systemLogo} alt={systemName} className="h-16 w-auto" />
            ) : (
              <div className="h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-10 w-10 text-white" />
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{systemName}</h2>
          <p className="mt-2 text-sm text-gray-600">
            Faça login para acessar sua conta
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setLoginType('client')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                loginType === 'client'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Building2 className="h-5 w-5 mr-2" />
              Empresa
            </button>
            <button
              onClick={() => setLoginType('accounting')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                loginType === 'accounting'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calculator className="h-5 w-5 mr-2" />
              Contabilidade
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                loginType === 'admin'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="h-5 w-5 mr-2" />
              Admin
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Entrar
              </button>
            </div>
          </form>

          {loginType === 'client' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Não tem uma conta?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowRegister(true)}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Criar nova conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}