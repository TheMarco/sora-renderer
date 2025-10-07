import { create } from 'zustand';
import type { RenderJob, Asset, Settings } from './types';

interface AppState {
  // UI state
  isWelcomeModalOpen: boolean;
  isSettingsOpen: boolean;
  selectedJobId: string | null;
  selectedAssetId: string | null;

  // Data cache
  jobs: RenderJob[];
  assets: Asset[];
  settings: Settings | null;

  // Actions
  setWelcomeModalOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setSelectedJobId: (id: string | null) => void;
  setSelectedAssetId: (id: string | null) => void;

  // Data actions
  setJobs: (jobs: RenderJob[]) => void;
  addJob: (job: RenderJob) => void;
  updateJob: (id: string, updates: Partial<RenderJob>) => void;
  removeJob: (id: string) => void;

  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Asset) => void;
  removeAsset: (id: string) => void;

  setSettings: (settings: Settings) => void;
  updateSettings: (updates: Partial<Settings>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  isWelcomeModalOpen: false,
  isSettingsOpen: false,
  selectedJobId: null,
  selectedAssetId: null,
  jobs: [],
  assets: [],
  settings: null,

  // UI actions
  setWelcomeModalOpen: (open) => set({ isWelcomeModalOpen: open }),
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  setSelectedJobId: (id) => set({ selectedJobId: id }),
  setSelectedAssetId: (id) => set({ selectedAssetId: id }),

  // Job actions
  setJobs: (jobs) => set({ jobs }),
  addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
  updateJob: (id, updates) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, ...updates, updatedAt: Date.now() } : job
      ),
    })),
  removeJob: (id) => set((state) => ({ jobs: state.jobs.filter((job) => job.id !== id) })),

  // Asset actions
  setAssets: (assets) => set({ assets }),
  addAsset: (asset) => set((state) => ({ assets: [asset, ...state.assets] })),
  removeAsset: (id) =>
    set((state) => ({ assets: state.assets.filter((asset) => asset.id !== id) })),

  // Settings actions
  setSettings: (settings) => set({ settings }),
  updateSettings: (updates) =>
    set((state) => ({
      settings: state.settings ? { ...state.settings, ...updates } : null,
    })),
}));

// Selectors for derived state
export const selectActiveJobs = (state: AppState) =>
  state.jobs.filter((job) => job.status === 'queued' || job.status === 'running');

export const selectCompletedJobs = (state: AppState) =>
  state.jobs.filter((job) => job.status === 'succeeded');

export const selectFailedJobs = (state: AppState) =>
  state.jobs.filter((job) => job.status === 'failed' || job.status === 'blocked');

export const selectVideoAssets = (state: AppState) =>
  state.assets.filter((asset) => asset.kind === 'video');

export const selectAssetsByJobId = (jobId: string) => (state: AppState) =>
  state.assets.filter((asset) => asset.jobId === jobId);

