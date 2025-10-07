'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { showToast } from '@/components/Toast';
import { db } from '@/lib/db';
import { formatRelativeTime, formatCost } from '@/lib/utils';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants';
import type { RenderJob } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function QueuePage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<RenderJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const loadJobs = async () => {
    const allJobs = await db.jobs.orderBy('createdAt').reverse().toArray();
    setJobs(allJobs);
    setIsLoading(false);
  };

  const handleCancel = async (jobId: string) => {
    try {
      await db.jobs.update(jobId, {
        status: 'canceled',
        updatedAt: Date.now(),
      });
      showToast('Job canceled', 'success');
      loadJobs();
    } catch {
      showToast('Failed to cancel job', 'error');
    }
  };

  const handleRetry = async (_job: RenderJob) => {
    // Navigate to new render with pre-filled data
    router.push('/new');
    showToast('Please resubmit the job', 'info');
  };

  const handleDelete = async (jobId: string) => {
    try {
      await db.jobs.delete(jobId);
      showToast('Job deleted', 'success');
      loadJobs();
    } catch {
      showToast('Failed to delete job', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const activeJobs = jobs.filter((j) => j.status === 'queued' || j.status === 'running');
  const completedJobs = jobs.filter((j) => j.status === 'succeeded');
  const failedJobs = jobs.filter(
    (j) => j.status === 'failed' || j.status === 'blocked' || j.status === 'canceled'
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Render Queue</h1>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-text-secondary">{activeJobs.length} Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-text-secondary">{completedJobs.length} Complete</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-text-secondary">{failedJobs.length} Failed</span>
            </div>
          </div>
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            icon="⏳"
            title="No jobs yet"
            description="Create your first video generation job to see it here."
            action={{
              label: 'New Render',
              onClick: () => router.push('/new'),
            }}
          />
        ) : (
          <div className="space-y-4">
            {/* Active Jobs */}
            {activeJobs.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3 text-text-secondary">Active</h2>
                <div className="space-y-3">
                  {activeJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onCancel={handleCancel}
                      onRetry={handleRetry}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Completed Jobs */}
            {completedJobs.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3 text-text-secondary">Completed</h2>
                <div className="space-y-3">
                  {completedJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onCancel={handleCancel}
                      onRetry={handleRetry}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Failed Jobs */}
            {failedJobs.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3 text-text-secondary">Failed</h2>
                <div className="space-y-3">
                  {failedJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onCancel={handleCancel}
                      onRetry={handleRetry}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function JobCard({
  job,
  onCancel,
  onRetry,
  onDelete,
}: {
  job: RenderJob;
  onCancel: (id: string) => void;
  onRetry: (job: RenderJob) => void;
  onDelete: (id: string) => void;
}) {
  const isActive = job.status === 'queued' || job.status === 'running';
  const isFailed = job.status === 'failed' || job.status === 'blocked';
  const isComplete = job.status === 'succeeded';

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`badge ${STATUS_COLORS[job.status]}`}>
              {STATUS_LABELS[job.status]}
            </span>
            <span className="text-xs text-text-tertiary">{formatRelativeTime(job.createdAt)}</span>
          </div>
          <p className="text-text-primary font-medium mb-1 line-clamp-2">{job.prompt}</p>
          <div className="flex items-center space-x-3 text-xs text-text-secondary">
            <span>{job.model}</span>
            <span>•</span>
            <span>{job.resolution}</span>
            <span>•</span>
            <span>{job.durationSec}s</span>
            <span>•</span>
            <span>{formatCost(job.costUsdEstimate)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {isActive && (
            <>
              <LoadingSpinner size="sm" />
              <button onClick={() => onCancel(job.id)} className="btn-secondary text-sm">
                Cancel
              </button>
            </>
          )}
          {isFailed && (
            <>
              <button onClick={() => onRetry(job)} className="btn-secondary text-sm">
                Retry
              </button>
              <button onClick={() => onDelete(job.id)} className="btn-danger text-sm">
                Delete
              </button>
            </>
          )}
          {isComplete && (
            <button onClick={() => onDelete(job.id)} className="btn-ghost text-sm">
              Remove
            </button>
          )}
        </div>
      </div>

      {job.error && (
        <div className="mt-3 p-3 bg-error/10 border border-error/30 rounded text-sm text-error">
          {job.error}
        </div>
      )}

      {isActive && (
        <div className="mt-3">
          <div className="h-1 bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-accent animate-pulse-slow w-1/3" />
          </div>
        </div>
      )}
    </div>
  );
}

