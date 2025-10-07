import type { ModelId, Resolution, CostEstimate } from './types';

// Pricing table based on OpenAI Sora 2 pricing
const PRICE_TABLE: Record<ModelId, Partial<Record<Resolution, number>>> = {
  'sora-2': {
    '1280x720': 0.1, // $/sec (landscape)
    '720x1280': 0.1, // $/sec (portrait)
  },
  'sora-2-pro': {
    '1280x720': 0.3,
    '720x1280': 0.3,
    '1792x1024': 0.5,
    '1024x1792': 0.5,
  },
} as const;

/**
 * Calculate the estimated cost for a video generation job
 */
export function estimateCostUsd(
  model: ModelId,
  resolution: Resolution,
  seconds: number
): CostEstimate {
  const rate = PRICE_TABLE[model]?.[resolution] ?? 0;
  const cost = parseFloat((rate * seconds).toFixed(2));

  return {
    rate,
    seconds,
    cost,
  };
}

/**
 * Get the price per second for a given model and resolution
 */
export function getPricePerSecond(model: ModelId, resolution: Resolution): number {
  return PRICE_TABLE[model]?.[resolution] ?? 0;
}

/**
 * Format cost as USD string
 */
export function formatCost(cost: number): string {
  return `$${cost.toFixed(2)}`;
}

/**
 * Format rate as cents per second
 */
export function formatRate(rate: number): string {
  const cents = Math.round(rate * 100);
  return `${cents}¢/sec`;
}

/**
 * Get all available resolutions for a model
 */
export function getAvailableResolutions(model: ModelId): Resolution[] {
  return Object.keys(PRICE_TABLE[model] || {}) as Resolution[];
}

/**
 * Check if a resolution is available for a model
 */
export function isResolutionAvailable(model: ModelId, resolution: Resolution): boolean {
  return resolution in (PRICE_TABLE[model] || {});
}

