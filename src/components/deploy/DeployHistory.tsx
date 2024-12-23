import React from 'react';
import { Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface Deploy {
  id: string;
  date: Date;
  status: 'success' | 'failed';
  url?: string;
  commitMessage?: string;
  deployedBy: string;
}

export function DeployHistory() {
  // Mock data - in a real app, this would come from your API
  const deploys: Deploy[] = [
    {
      id: '1',
      date: new Date(),
      status: 'success',
      url: 'https://your-site.netlify.app',
      commitMessage: 'Updated landing page',
      deployedBy: 'John Doe'
    },
    {
      id: '2',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'failed',
      commitMessage: 'Fixed responsive issues',
      deployedBy: 'Jane Smith'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mensagem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Autor
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deploys.map((deploy) => (
              <tr key={deploy.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {deploy.status === 'success' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Sucesso
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle className="w-4 h-4 mr-1" />
                      Falha
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {deploy.date.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {deploy.commitMessage}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {deploy.deployedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {deploy.status === 'success' && deploy.url && (
                    <a
                      href={deploy.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                    >
                      Visitar
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}