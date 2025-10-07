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

  console.log('[OpenAI Client] Making request:', { endpoint, method: options.method || 'POST' });

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

  console.log('[OpenAI Client] Response status:', response.status);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'API request failed' }));
    console.error('[OpenAI Client] Error:', error);

    // Extract the most useful error message
    const errorMessage = error.error || error.message || error.details?.error?.message || `API request failed: ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  console.log('[OpenAI Client] Success:', data);
  return data;
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
 * Create a video generation job
 */
export async function createVideoJob(
  params: CreateVideoJobParams
): Promise<{ jobId: string }> {
  const apiKey = await getApiKey();

  // If there's an image, use multipart/form-data
  if (params.image) {
    const formData = new FormData();
    formData.append('endpoint', '/videos');
    formData.append('apiKey', apiKey);
    formData.append('method', 'POST');
    formData.append('model', params.model);
    formData.append('prompt', params.prompt);
    formData.append('size', params.resolution);
    formData.append('seconds', params.duration.toString());

    // Convert base64 image back to File/Blob
    const base64Data = params.image.data.split(',')[1] || params.image.data;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: params.image.mime_type });
    const file = new File([blob], 'input_reference.png', { type: params.image.mime_type });

    formData.append('input_reference', file);

    const response = await fetch('/api/openai', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create video job');
    }

    const data = await response.json();
    return { jobId: data.id };
  }

  // No image - use JSON request
  const requestBody: any = {
    model: params.model,
    prompt: params.prompt,
    size: params.resolution,
    seconds: params.duration.toString(),
  };

  const response = await apiRequest<{ id: string }>('/videos', {
    method: 'POST',
    body: requestBody,
  });

  return { jobId: response.id };
}

/**
 * Get the status of a video generation job
 */
export async function getVideoJob(jobId: string): Promise<VideoJobResponse> {
  // OpenAI Sora 2 API uses /videos/{id} endpoint
  const response = await apiRequest<any>(`/videos/${jobId}`, {
    method: 'GET',
  });

  console.log('[OpenAI] Full job response:', JSON.stringify(response, null, 2));

  // Extract error message from various possible locations
  let errorMessage: string | undefined;
  if (response.error) {
    // Try different error formats
    errorMessage = response.error.message || response.error.code || response.error;
    if (typeof errorMessage === 'object') {
      errorMessage = JSON.stringify(errorMessage);
    }
  } else if (response.failure_reason) {
    errorMessage = response.failure_reason;
  } else if (response.status === 'failed' || response.status === 'blocked') {
    // If status is failed/blocked but no error message, provide a generic one
    errorMessage = response.status === 'blocked'
      ? 'Content blocked by safety filters'
      : 'Generation failed - please check your prompt and try again';
  }

  return {
    job_id: response.id || jobId,
    status: mapApiStatus(response.status),
    assets: response.output?.map((item: any) => ({
      url: item.url,
      mime: 'video/mp4',
    })),
    error: errorMessage,
  };
}

/**
 * Map API status to our internal status type
 */
function mapApiStatus(apiStatus: string): JobStatus {
  const statusMap: Record<string, JobStatus> = {
    'queued': 'queued',
    'in_progress': 'running',  // OpenAI uses 'in_progress'
    'processing': 'running',
    'running': 'running',
    'succeeded': 'succeeded',
    'completed': 'succeeded',
    'failed': 'failed',
    'blocked': 'blocked',
    'canceled': 'canceled',
    'cancelled': 'canceled',
  };

  const mapped = statusMap[apiStatus.toLowerCase()];
  if (!mapped) {
    console.warn(`[OpenAI] Unknown status: ${apiStatus}, defaulting to 'failed'`);
  }
  return mapped || 'failed';
}

/**
 * Download a video file from OpenAI
 * @param endpoint - The API endpoint (e.g., '/videos/{id}/content?variant=video')
 */
export async function downloadAsset(endpoint: string): Promise<Blob> {
  console.log(`[OpenAI Client] Downloading asset from: ${endpoint}`);

  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error('API key not found');
  }

  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint,
      method: 'GET',
      apiKey,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('[OpenAI Client] Download failed:', error);
    throw new Error(error.error || 'Failed to download asset');
  }

  const blob = await response.blob();
  console.log(`[OpenAI Client] Downloaded ${blob.size} bytes`);
  return blob;
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

