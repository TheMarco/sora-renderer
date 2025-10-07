'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useWorkers } from '@/lib/hooks/useWorkers';
import { useAppStore } from '@/lib/store';
import { db } from '@/lib/db';

function WorkerManager() {
  const { startPolling } = useWorkers();
  const jobs = useAppStore((state) => state.jobs);

  useEffect(() => {
    // Load jobs from DB on mount
    const loadJobs = async () => {
      const dbJobs = await db.jobs.toArray();

      // Start polling for any active jobs
      dbJobs.forEach((job) => {
        if ((job.status === 'queued' || job.status === 'running') && job.apiJobId) {
          console.log(`[WorkerManager] Starting polling for job ${job.id} (API ID: ${job.apiJobId})`);
          startPolling(job.id, job.apiJobId);
        }
      });
    };

    loadJobs();
  }, [startPolling]);

  // Start polling when new jobs are added
  useEffect(() => {
    jobs.forEach((job) => {
      if ((job.status === 'queued' || job.status === 'running') && job.apiJobId) {
        console.log(`[WorkerManager] Starting polling for new job ${job.id} (API ID: ${job.apiJobId})`);
        startPolling(job.id, job.apiJobId);
      }
    });
  }, [jobs, startPolling]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <WorkerManager />
      {children}
    </QueryClientProvider>
  );
}

