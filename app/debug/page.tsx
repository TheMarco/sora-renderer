'use client';

import { useState } from 'react';
import { db } from '@/lib/db';
import { decryptString } from '@/lib/crypto';

export default function DebugPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testApiKey = async () => {
    setLoading(true);
    setResult('Testing API key...\n');
    
    try {
      // Get API key
      const vault = await db.keyvault.get('openai');
      if (!vault) {
        setResult(prev => prev + '❌ No API key found in vault\n');
        return;
      }
      
      const apiKey = await decryptString(vault.encKey);
      setResult(prev => prev + `✅ API key retrieved: ${apiKey.substring(0, 10)}...\n`);
      
      // Test API proxy with /models endpoint
      setResult(prev => prev + '\nTesting /api/openai proxy...\n');
      
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: '/models',
          method: 'GET',
          apiKey,
        }),
      });
      
      setResult(prev => prev + `Response status: ${response.status}\n`);
      
      const data = await response.json();
      setResult(prev => prev + `Response data: ${JSON.stringify(data, null, 2)}\n`);
      
      if (response.ok) {
        setResult(prev => prev + '\n✅ API proxy working!\n');
      } else {
        setResult(prev => prev + '\n❌ API proxy returned error\n');
      }
      
    } catch (error) {
      setResult(prev => prev + `\n❌ Error: ${(error as Error).message}\n`);
      setResult(prev => prev + `Stack: ${(error as Error).stack}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testVideoEndpoint = async () => {
    setLoading(true);
    setResult('Testing video generation endpoint...\n');
    
    try {
      const vault = await db.keyvault.get('openai');
      if (!vault) {
        setResult(prev => prev + '❌ No API key found\n');
        return;
      }
      
      const apiKey = await decryptString(vault.encKey);
      
      const testPayload = {
        model: 'sora-2',
        input: {
          type: 'video.generate',
          prompt: 'A test video',
          resolution: '1280x720',
          duration: 5,
        },
      };
      
      setResult(prev => prev + `Payload: ${JSON.stringify(testPayload, null, 2)}\n\n`);
      
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: '/video/generations',
          method: 'POST',
          apiKey,
          data: testPayload,
        }),
      });
      
      setResult(prev => prev + `Response status: ${response.status}\n`);
      
      const data = await response.json();
      setResult(prev => prev + `Response: ${JSON.stringify(data, null, 2)}\n`);
      
    } catch (error) {
      setResult(prev => prev + `\n❌ Error: ${(error as Error).message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Debug Page</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testApiKey}
            disabled={loading}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50"
          >
            Test API Key & /models Endpoint
          </button>
          
          <button
            onClick={testVideoEndpoint}
            disabled={loading}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 ml-4"
          >
            Test Video Generation Endpoint
          </button>
        </div>
        
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Results:</h2>
          <pre className="text-sm text-text-secondary whitespace-pre-wrap font-mono">
            {result || 'Click a button to test...'}
          </pre>
        </div>
        
        <div className="mt-8 bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Notes:</h2>
          <ul className="list-disc list-inside space-y-2 text-text-secondary">
            <li>Make sure you have added your API key in Settings first</li>
            <li>The /models endpoint should work if your API key is valid</li>
            <li>The /video/generations endpoint may not exist yet (Sora 2 API is not publicly available)</li>
            <li>Check the browser console for additional logs</li>
            <li>Check Vercel function logs for server-side errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

