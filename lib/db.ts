import Dexie, { Table } from 'dexie';
import type { KeyVault, RenderJob, Asset, Settings } from './types';

// Database class
export class SoraRendererDB extends Dexie {
  keyvault!: Table<KeyVault, string>;
  jobs!: Table<RenderJob, string>;
  assets!: Table<Asset, string>;
  settings!: Table<Settings, string>;

  constructor() {
    super('sora-renderer');

    this.version(1).stores({
      keyvault: 'id',
      jobs: 'id, status, createdAt, [status+createdAt]',
      assets: 'id, kind, jobId, [kind+jobId]',
      settings: 'id',
    });
  }
}

// Singleton instance
export const db = new SoraRendererDB();

// Initialize default settings
export async function initializeSettings(): Promise<void> {
  const existing = await db.settings.get('app');
  if (!existing) {
    await db.settings.add({
      id: 'app',
      theme: 'dark',
      pollingMs: 2500,
      autoDownload: false,
      showAdvanced: false,
    });
  }
}

// Call on app initialization
if (typeof window !== 'undefined') {
  initializeSettings().catch(console.error);
}

