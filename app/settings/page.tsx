'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Modal } from '@/components/Modal';
import { showToast } from '@/components/Toast';
import { db } from '@/lib/db';
import { encryptString, decryptString, wipeAppSecret } from '@/lib/crypto';
import { validateApiKey } from '@/lib/openai';
import { formatBytes } from '@/lib/utils';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [storageStats, setStorageStats] = useState({ videos: 0, images: 0, thumbs: 0, total: 0 });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    loadApiKey();
    loadStorageStats();
  }, []);

  const loadApiKey = async () => {
    const vault = await db.keyvault.get('openai');
    if (vault) {
      setHasKey(true);
      try {
        const decrypted = await decryptString(vault.encKey);
        setApiKey(decrypted);
      } catch (error) {
        console.error('Failed to decrypt API key:', error);
      }
    }
  };

  const loadStorageStats = async () => {
    const assets = await db.assets.toArray();
    const stats = assets.reduce(
      (acc, asset) => {
        if (asset.kind === 'video') acc.videos += asset.bytes;
        else if (asset.kind === 'image') acc.images += asset.bytes;
        else if (asset.kind === 'thumb') acc.thumbs += asset.bytes;
        acc.total += asset.bytes;
        return acc;
      },
      { videos: 0, images: 0, thumbs: 0, total: 0 }
    );
    setStorageStats(stats);
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      showToast('Please enter an API key', 'error');
      return;
    }

    setIsValidating(true);
    const isValid = await validateApiKey(apiKey.trim());
    setIsValidating(false);

    if (!isValid) {
      showToast('Invalid API key. Please check and try again.', 'error');
      return;
    }

    try {
      const encrypted = await encryptString(apiKey.trim());
      await db.keyvault.put({
        id: 'openai',
        encKey: encrypted,
        createdAt: Date.now(),
      });

      setHasKey(true);
      showToast('API key saved successfully', 'success');
    } catch (error) {
      console.error('Failed to save API key:', error);
      showToast('Failed to save API key', 'error');
    }
  };

  const handleWipeKey = async () => {
    await db.keyvault.delete('openai');
    wipeAppSecret();
    setApiKey('');
    setHasKey(false);
    showToast('API key wiped', 'success');
  };

  const handleClearThumbs = async () => {
    const thumbs = await db.assets.where('kind').equals('thumb').toArray();
    await db.assets.bulkDelete(thumbs.map((t) => t.id));
    showToast(`Deleted ${thumbs.length} thumbnails`, 'success');
    loadStorageStats();
  };

  const handlePurgeFailedJobs = async () => {
    const failed = await db.jobs.where('status').anyOf(['failed', 'blocked', 'canceled']).toArray();
    await db.jobs.bulkDelete(failed.map((j) => j.id));
    showToast(`Purged ${failed.length} failed jobs`, 'success');
  };

  const handleHardReset = async () => {
    await db.delete();
    wipeAppSecret();
    showToast('App reset complete. Reloading...', 'success');
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* API Key Section */}
        <section className="glass-card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">OpenAI API Key</h2>
          <p className="text-text-secondary text-sm mb-4">
            Your API key is encrypted and stored locally in your browser. It never leaves your device.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">API Key</label>
              <div className="flex space-x-2">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="input flex-1"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="btn-secondary"
                  aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                >
                  {showApiKey ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSaveApiKey}
                disabled={isValidating}
                className="btn-primary"
              >
                {isValidating ? 'Validating...' : hasKey ? 'Update Key' : 'Save Key'}
              </button>
              {hasKey && (
                <button onClick={handleWipeKey} className="btn-danger">
                  Wipe Key
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Storage Section */}
        <section className="glass-card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Storage Management</h2>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Videos:</span>
              <span className="font-medium">{formatBytes(storageStats.videos)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Images:</span>
              <span className="font-medium">{formatBytes(storageStats.images)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Thumbnails:</span>
              <span className="font-medium">{formatBytes(storageStats.thumbs)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
              <span>Total:</span>
              <span>{formatBytes(storageStats.total)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={handleClearThumbs} className="btn-secondary text-sm">
              Clear Thumbnails
            </button>
            <button onClick={handlePurgeFailedJobs} className="btn-secondary text-sm">
              Purge Failed Jobs
            </button>
            <button onClick={() => setShowResetConfirm(true)} className="btn-danger text-sm">
              Hard Reset
            </button>
          </div>
        </section>

        {/* Privacy Notice */}
        <section className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Privacy & Security</h2>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>
              ⚠️ <strong>Important:</strong> This app stores your API key locally using browser encryption.
              While we use industry-standard encryption (AES-GCM), any browser-based app is vulnerable if
              your device is compromised.
            </p>
            <p>
              ✓ All data (API keys, videos, metadata) stays on your device. Nothing is sent to any server
              except direct API calls to OpenAI.
            </p>
            <p>
              ✓ You can export/import your data for backup or migration to another device.
            </p>
          </div>
        </section>
      </main>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Confirm Hard Reset"
      >
        <p className="text-text-secondary mb-6">
          This will delete ALL data including your API key, jobs, and videos. This action cannot be undone.
        </p>
        <div className="flex space-x-2 justify-end">
          <button onClick={() => setShowResetConfirm(false)} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleHardReset} className="btn-danger">
            Reset Everything
          </button>
        </div>
      </Modal>
    </div>
  );
}

