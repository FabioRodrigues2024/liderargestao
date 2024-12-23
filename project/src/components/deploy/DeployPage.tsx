import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { ManualUpload } from './ManualUpload';
import { DeployHistory } from './DeployHistory';
import { GitSetup } from './GitSetup';

export function DeployPage() {
  const [activeTab, setActiveTab] = useState('git');
  const [isGitConnected, setIsGitConnected] = useState(false);

  const handleGitSetupComplete = () => {
    setIsGitConnected(true);
    setActiveTab('history');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Deploy do Site</h2>
      </div>

      <div className="bg-white rounded-xl border">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b px-6 pt-4">
            <TabsList className="flex space-x-8">
              <TabsTrigger value="git" className="pb-4 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300">
                Repositório Git
              </TabsTrigger>
              <TabsTrigger value="upload" className="pb-4 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300">
                Upload Manual
              </TabsTrigger>
              <TabsTrigger value="history" className="pb-4 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300">
                Histórico de Deploys
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="git">
              <GitSetup onSetupComplete={handleGitSetupComplete} />
            </TabsContent>
            <TabsContent value="upload">
              <ManualUpload />
            </TabsContent>
            <TabsContent value="history">
              <DeployHistory />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}