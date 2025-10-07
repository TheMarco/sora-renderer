import type { CreateVideoJobParams, VideoJobResponse, JobStatus } from './types';
import { db } from './db';
import { decryptString } from './crypto';

/**
 * Get the decrypted API key from the vault
 */
async function getApiKey(): Promise<string> {
  const vault = await db.keyvault.get('openai');
  if (!vault) {
    throw new Error('No API key found. Please add your OpenAI API key in Settings.');
  }

  return await decryptString(vault.encKey);
}

/**
 * Make an authenticated request to the OpenAI API via our proxy
 */
async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: any;
  } = {}
): Promise<T> {
  const apiKey = await getApiKey();

  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint,
      method: options.method || 'POST',
      apiKey,
      data: options.body,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'API request failed' }));
    throw new Error(error.error || `API request failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Validate the API key by making a lightweight request
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
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

    return response.ok;
  } catch (error) {
    console.error('API key validation failed:', error);
    return false;
  }
}

/**
 * Create a video generation job (text-only)
 */
export async function createVideoJob(
  params: CreateVideoJobParams
): Promise<{ jobId: string }> {
  const requestBody: any = {
    model: params.model,
    input: {
      type: 'video.generate',
      prompt: params.prompt,
      resolution: params.resolution,
      duration: params.duration,
    },
  };

  // Add image if provided
  if (params.image) {
    requestBody.input.image = params.image;
  }

  // Note: This endpoint structure is based on the spec.
  // The actual OpenAI Sora API endpoint may differ.
  // Adjust this when the real API is available.
  const response = await apiRequest<{ job_id: string }>('/video/generations', {
    method: 'POST',
    body: requestBody,
  });

  return { jobId: response.job_id };
}

/**
 * Get the status of a video generation job
 */
export async function getVideoJob(jobId: string): Promise<VideoJobResponse> {
  // Note: Adjust endpoint when real API is available
  const response = await apiRequest<any>(`/video/generations/${jobId}`, {
    method: 'GET',
  });

  return {
    job_id: response.job_id || jobId,
    status: mapApiStatus(response.status),
    assets: response.assets,
    error: response.error,
  };
}

/**
 * Map API status to our internal status type
 */
function mapApiStatus(apiStatus: string): JobStatus {
  const statusMap: Record<string, JobStatus> = {
    'queued': 'queued',
    'processing': 'running',
    'running': 'running',
    'succeeded': 'succeeded',
    'completed': 'succeeded',
    'failed': 'failed',
    'blocked': 'blocked',
    'canceled': 'canceled',
    'cancelled': 'canceled',
  };

  return statusMap[apiStatus.toLowerCase()] || 'failed';
}

/**
 * Download a video file from a URL
 */
export async function downloadAsset(url: string): Promise<Blob> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download asset: ${response.status}`);
  }

  return response.blob();
}

/**
 * Retry logic with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on 4xx errors (client errors)
      if (error instanceof Error && error.message.includes('4')) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

/**
 * Map common API errors to user-friendly messages
 */
export function mapApiError(error: Error): string {
  const message = error.message.toLowerCase();

  if (message.includes('unauthorized') || message.includes('401')) {
    return 'Invalid API key. Please check your settings.';
  }

  if (message.includes('rate limit') || message.includes('429')) {
    return 'Rate limit exceeded. Please try again later.';
  }

  if (message.includes('policy') || message.includes('content')) {
    return 'Content policy violation. Please modify your prompt.';
  }

  if (message.includes('insufficient') || message.includes('quota')) {
    return 'Insufficient quota. Please check your OpenAI account.';
  }

  return error.message || 'An unexpected error occurred.';
}

