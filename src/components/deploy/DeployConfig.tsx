import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface DeployConfigProps {
  onDeploy: (config: DeployConfig) => void;
}

interface DeployConfig {
  buildCommand: string;
  publishDirectory: string;
  basePath: string;
  nodeVersion: string;
}

export function DeployConfig({ onDeploy }: DeployConfigProps) {
  const [config, setConfig] = useState<DeployConfig>({
    buildCommand: 'npm run build',
    publishDirectory: 'dist',
    basePath: '/',
    nodeVersion: '18'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDeploy(config);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Estas configurações serão usadas para fazer o deploy no Netlify.
              Os valores padrão são recomendados para a maioria dos projetos React.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Comando de Build
          </label>
          <input
            type="text"
            value={config.buildCommand}
            onChange={(e) => setConfig({ ...config, buildCommand: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Comando usado para construir seu projeto
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Diretório de Publicação
          </label>
          <input
            type="text"
            value={config.publishDirectory}
            onChange={(e) => setConfig({ ...config, publishDirectory: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Diretório que contém os arquivos estáticos após o build
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Caminho Base
          </label>
          <input
            type="text"
            value={config.basePath}
            onChange={(e) => setConfig({ ...config, basePath: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Diretório base do seu projeto
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Versão do Node.js
          </label>
          <select
            value={config.nodeVersion}
            onChange={(e) => setConfig({ ...config, nodeVersion: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="18">Node.js 18</option>
            <option value="16">Node.js 16</option>
            <option value="14">Node.js 14</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Versão do Node.js usada para build
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Salvar e Fazer Deploy
          </button>
        </div>
      </form>
    </div>
  );
}