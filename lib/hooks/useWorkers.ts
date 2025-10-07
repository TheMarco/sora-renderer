import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store';
import { db } from '../db';
import { getVideoJob, downloadAsset } from '../openai';
import { v4 as uuidv4 } from 'uuid';

export function usePollingWorker() {
  const workerRef = useRef<Worker | null>(null);
  const thumbnailWorkerRef = useRef<Worker | null>(null);
  const updateJob = useAppStore((state) => state.updateJob);
  const addAsset = useAppStore((state) => state.addAsset);

  useEffect(() => {
    // Initialize polling worker
    workerRef.current = new Worker(new URL('../../workers/poller.ts', import.meta.url));

    // Initialize thumbnail worker
    thumbnailWorkerRef.current = new Worker(new URL('../../workers/thumbs.ts', import.meta.url));

    // Handle thumbnail worker messages
    thumbnailWorkerRef.current.onmessage = async (event: MessageEvent) => {
      const { type, payload } = event.data;

      if (type === 'THUMBNAIL_READY') {
        const thumbId = uuidv4();
        const thumbRecord = {
          id: thumbId,
          kind: 'thumb' as const,
          mime: 'image/jpeg',
          name: `thumb-${payload.videoId}.jpg`,
          bytes: payload.thumbnail.size,
          blob: payload.thumbnail,
          jobId: payload.videoId,
          createdAt: Date.now(),
        };

        await db.assets.add(thumbRecord);
        addAsset(thumbRecord);
      }
    };

    // Handle polling worker messages
    workerRef.current.onmessage = async (event: MessageEvent) => {
      const { type, payload } = event.data;

      switch (type) {
        case 'POLL_REQUEST':
          await handlePollRequest(payload);
          break;
        case 'JOB_UPDATE':
          await handleJobUpdate(payload);
          break;
        case 'JOB_COMPLETE':
          await handleJobComplete(payload, thumbnailWorkerRef.current);
          break;
        case 'POLL_ERROR':
          console.error('Polling error:', payload);
          break;
      }
    };

    return () => {
      workerRef.current?.terminate();
      thumbnailWorkerRef.current?.terminate();
    };
  }, [addAsset, updateJob]);

  const handlePollRequest = async (payload: { jobId: string; apiJobId: string }) => {
    try {
      const response = await getVideoJob(payload.apiJobId);

      // Send response back to worker
      workerRef.current?.postMessage({
        type: 'POLL_RESPONSE',
        payload: {
          jobId: payload.jobId,
          status: response.status,
          assets: response.assets,
          error: response.error,
        },
      });
    } catch (error) {
      console.error('Failed to poll job:', error);
    }
  };

  const handleJobUpdate = async (payload: { jobId: string; status: string }) => {
    // Update job status in store and DB
    updateJob(payload.jobId, { status: payload.status as any });
    await db.jobs.update(payload.jobId, { status: payload.status as any, updatedAt: Date.now() });
  };

  const handleJobComplete = async (
    payload: {
      jobId: string;
      status: string;
      assets?: Array<{ url: string; mime: string }>;
      error?: string;
    },
    thumbnailWorker: Worker | null
  ) => {
    // Update job status
    updateJob(payload.jobId, {
      status: payload.status as any,
      error: payload.error,
    });

    await db.jobs.update(payload.jobId, {
      status: payload.status as any,
      error: payload.error,
      updatedAt: Date.now(),
    });

    // Download assets if succeeded
    if (payload.status === 'succeeded' && payload.assets) {
      for (const asset of payload.assets) {
        try {
          const blob = await downloadAsset(asset.url);
          const assetId = uuidv4();

          const assetRecord = {
            id: assetId,
            kind: 'video' as const,
            mime: asset.mime,
            name: `video-${Date.now()}.mp4`,
            bytes: blob.size,
            blob,
            jobId: payload.jobId,
            createdAt: Date.now(),
          };

          // Save to DB
          await db.assets.add(assetRecord);

          // Update store
          addAsset(assetRecord);

          // Generate thumbnail
          if (thumbnailWorker) {
            thumbnailWorker.postMessage({
              type: 'GENERATE_THUMBNAIL',
              payload: { videoId: assetId, videoBlob: blob },
            });
          }
        } catch (error) {
          console.error('Failed to download asset:', error);
        }
      }
    }
  };

  const startPolling = useCallback((jobId: string, apiJobId: string) => {
    workerRef.current?.postMessage({
      type: 'START_POLLING',
      payload: { jobId, apiJobId },
    });
  }, []);

  const stopPolling = useCallback((jobId: string) => {
    workerRef.current?.postMessage({
      type: 'STOP_POLLING',
      payload: { jobId },
    });
  }, []);

  return { startPolling, stopPolling };
}

// Export the main hook
export function useWorkers() {
  return usePollingWorker();
}

