import type { ResolutionOption, ModelId } from './types';

// Model configurations
export const MODELS: Array<{
  id: ModelId;
  name: string;
  description: string;
  maxDuration: number;
}> = [
  {
    id: 'sora-2',
    name: 'Sora 2',
    description: 'Standard quality video generation',
    maxDuration: 12,
  },
  {
    id: 'sora-2-pro',
    name: 'Sora 2 Pro',
    description: 'Enhanced quality with higher resolutions',
    maxDuration: 12,
  },
];

// Resolution options
export const RESOLUTIONS: ResolutionOption[] = [
  {
    value: '1280x720',
    label: '1280×720',
    aspect: '16:9',
    width: 1280,
    height: 720,
    orientation: 'landscape',
  },
  {
    value: '720x1280',
    label: '720×1280',
    aspect: '9:16',
    width: 720,
    height: 1280,
    orientation: 'portrait',
  },
  {
    value: '1792x1024',
    label: '1792×1024',
    aspect: '16:9',
    width: 1792,
    height: 1024,
    orientation: 'landscape',
  },
  {
    value: '1024x1792',
    label: '1024×1792',
    aspect: '9:16',
    width: 1024,
    height: 1792,
    orientation: 'portrait',
  },
];

// Duration constraints - Sora 2 only supports 4, 8, and 12 seconds
export const ALLOWED_DURATIONS = [4, 8, 12] as const;
export const DEFAULT_DURATION = 4;

// Polling configuration
export const DEFAULT_POLLING_INTERVAL = 2500; // ms
export const MAX_POLLING_INTERVAL = 30000; // ms
export const POLLING_BACKOFF_MULTIPLIER = 1.5;

// File size limits
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

// Status colors
export const STATUS_COLORS = {
  queued: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  running: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  succeeded: 'bg-green-500/20 text-green-400 border-green-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  blocked: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  canceled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

// Status labels
export const STATUS_LABELS = {
  queued: 'Queued',
  running: 'Generating',
  succeeded: 'Complete',
  failed: 'Failed',
  blocked: 'Blocked',
  canceled: 'Canceled',
};

