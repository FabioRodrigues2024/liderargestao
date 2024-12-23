import React, { useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { FileUploader } from './FileUploader';
import { DeployStatus } from './DeployStatus';

export function ManualUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (selectedFiles: FileList) => {
    setFiles(Array.from(selectedFiles));
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDeploy = async () => {
    if (files.length === 0) {
      setError('Por favor, selecione os arquivos para fazer o deploy.');
      return;
    }

    try {
      setIsDeploying(true);
      // Here you would implement the actual deployment logic
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Deploy realizado com sucesso!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      setFiles([]);
    } catch (err) {
      setError('Erro ao fazer o deploy. Por favor, tente novamente.');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Upload Manual e Deploy</h2>
      </div>

      <div className="bg-white rounded-xl border p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <FileUploader onFilesSelected={handleFilesSelected} />

        {files.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Arquivos Selecionados</h3>
            <ul className="divide-y divide-gray-200">
              {files.map((file, index) => (
                <li key={index} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <Upload className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex justify-end">
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  isDeploying
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Upload className="h-5 w-5" />
                <span>{isDeploying ? 'Fazendo Deploy...' : 'Fazer Deploy'}</span>
              </button>
            </div>
          </div>
        )}

        {isDeploying && <DeployStatus />}
      </div>
    </div>
  );
}