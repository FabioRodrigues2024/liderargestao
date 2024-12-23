import { env } from '../config/env';
import { getDeploymentStatus } from './getDeploymentStatus';

interface DeployConfig {
  buildCommand: string;
  publishDirectory: string;
  basePath: string;
  nodeVersion: string;
}

interface DeployOptions {
  config: DeployConfig;
}

export async function deployToNetlify({ config }: DeployOptions) {
  try {
    console.log('Triggering Netlify build...');
    
    const response = await fetch(env.netlify.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clear_cache: true,
        ...config
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to trigger deploy: ${errorText}`);
    }

    // Check deployment status
    const deployStatus = await getDeploymentStatus();
    
    return {
      success: true,
      deployUrl: deployStatus.url,
      siteId: env.netlify.siteId
    };
  } catch (error) {
    console.error('Deploy failed:', error);
    throw new Error(`Failed to deploy to Netlify: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}