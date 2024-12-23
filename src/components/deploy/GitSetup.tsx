import React, { useState } from 'react';
import { GitBranch, Key, Check } from 'lucide-react';

interface GitSetupProps {
  onSetupComplete: () => void;
}

export function GitSetup({ onSetupComplete }: GitSetupProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [deployKey, setDeployKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);

    try {
      // Here you would implement the actual repository connection logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Repositório conectado com sucesso!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      onSetupComplete();
    } catch (error) {
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Erro ao conectar repositório';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Conectar Repositório Git
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              URL do Repositório
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GitBranch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://github.com/usuario/repositorio.git"
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Insira a URL HTTPS do seu repositório Git
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Branch Principal
            </label>
            <div className="mt-1">
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Branch que será usada para deploy (geralmente main ou master)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Chave de Deploy
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={deployKey}
                onChange={(e) => setDeployKey(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••••••••••"
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Chave de acesso ao repositório (Deploy Key ou Personal Access Token)
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Próximos passos:
            </h4>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>Adicione a chave de deploy nas configurações do repositório</li>
              <li>Configure os webhooks para notificações automáticas</li>
              <li>Faça um commit de teste para verificar a integração</li>
            </ol>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isConnecting}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isConnecting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isConnecting ? (
                <>
                  <span className="mr-2">Conectando...</span>
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Conectar Repositório
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}