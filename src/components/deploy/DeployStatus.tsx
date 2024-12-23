import React, { useEffect, useState } from 'react';
import { getDeploymentStatus } from '../../utils/deploy';

export function DeployStatus() {
  const [status, setStatus] = useState<string>('Iniciando deploy...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const deployStatus = await getDeploymentStatus({});
        
        if (deployStatus.status === 'success') {
          setStatus('Deploy concluído com sucesso!');
          setProgress(100);
        } else if (deployStatus.status === 'error') {
          setStatus('Erro no deploy');
          setProgress(0);
        } else {
          setProgress((prev) => Math.min(prev + 10, 90));
          setTimeout(checkStatus, 1000);
        }
      } catch (error) {
        setStatus('Erro ao verificar status do deploy');
        setProgress(0);
      }
    };

    checkStatus();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{status}</span>
        <span className="text-sm font-medium text-gray-700">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}