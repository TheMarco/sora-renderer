// Core type definitions for Sora Renderer

export type ModelId = 'sora-2' | 'sora-2-pro';
export type Orientation = 'landscape' | 'portrait';
export type Resolution = '1280x720' | '720x1280' | '1792x1024' | '1024x1792';
export type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'blocked' | 'canceled';

export interface KeyVault {
  id: 'openai';
  encKey: ArrayBuffer; // encrypted API key (AES-GCM)
  createdAt: number;
}

export interface RenderJob {
  id: string; // uuid
  model: ModelId;
  resolution: Resolution;
  durationSec: number; // 1..max
  prompt: string;
  refImageId?: string; // FK to Asset.id
  costUsdEstimate: number;
  apiJobId?: string; // returned by OpenAI
  status: JobStatus;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Asset {
  id: string; // uuid
  kind: 'image' | 'video' | 'thumb';
  mime: string;
  name: string;
  bytes: number;
  blob: Blob; // stored via Dexie Blob support
  jobId?: string; // for outputs
  createdAt: number;
  meta?: Record<string, any>; // e.g., width, height, aspect
}

export interface Settings {
  id: 'app';
  theme: 'dark' | 'light' | 'system';
  pollingMs: number; // default 2500
  autoDownload: boolean; // also persist blob locally in FS Access
  showAdvanced: boolean;
}

// API types
export interface CreateVideoJobParams {
  model: ModelId;
  prompt: string;
  resolution: Resolution;
  duration: number;
  image?: {
    mime_type: string;
    data: string; // base64
  };
}

export interface VideoJobResponse {
  job_id: string;
  status: JobStatus;
  assets?: Array<{
    url: string;
    mime: string;
  }>;
  error?: string;
}

// UI types
export interface CostEstimate {
  rate: number;
  seconds: number;
  cost: number;
}

export interface ResolutionOption {
  value: Resolution;
  label: string;
  aspect: string;
  width: number;
  height: number;
  orientation: Orientation;
}

