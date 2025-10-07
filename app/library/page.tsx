'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Modal } from '@/components/Modal';
import { showToast } from '@/components/Toast';
import { db } from '@/lib/db';
import { downloadBlob, formatBytes, formatRelativeTime } from '@/lib/utils';
import type { Asset, RenderJob } from '@/lib/types';

export default function LibraryPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Asset[]>([]);
  const [jobs, setJobs] = useState<Map<string, RenderJob>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Asset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModel, setFilterModel] = useState<string>('all');

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    const videoAssets = await db.assets.where('kind').equals('video').toArray();
    const allJobs = await db.jobs.toArray();
    const jobsMap = new Map(allJobs.map((j) => [j.id, j]));

    setVideos(videoAssets);
    setJobs(jobsMap);
    setIsLoading(false);
  };

  const handleDownload = (video: Asset) => {
    downloadBlob(video.blob, video.name);
    showToast('Download started', 'success');
  };

  const handleDelete = async (videoId: string) => {
    try {
      await db.assets.delete(videoId);
      // Also delete associated thumbnail
      const thumbs = await db.assets.where('jobId').equals(videoId).toArray();
      await db.assets.bulkDelete(thumbs.map((t) => t.id));

      showToast('Video deleted', 'success');
      loadLibrary();
      setSelectedVideo(null);
    } catch {
      showToast('Failed to delete video', 'error');
    }
  };

  const handleOpenInNewTab = (video: Asset) => {
    const url = URL.createObjectURL(video.blob);
    window.open(url, '_blank');
  };

  const filteredVideos = videos.filter((video) => {
    const job = video.jobId ? jobs.get(video.jobId) : null;

    // Filter by model
    if (filterModel !== 'all' && job?.model !== filterModel) {
      return false;
    }

    // Filter by search query
    if (searchQuery && job) {
      return job.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return true;
  });

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Library</h1>
          <div className="text-sm text-text-secondary">
            {videos.length} {videos.length === 1 ? 'video' : 'videos'}
          </div>
        </div>

        {videos.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No videos yet"
            description="Your generated videos will appear here once they're complete."
            action={{
              label: 'Create First Video',
              onClick: () => router.push('/new'),
            }}
          />
        ) : (
          <>
            {/* Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input flex-1 max-w-md"
              />

              <select
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                className="input w-48"
              >
                <option value="all">All Models</option>
                <option value="sora-2">Sora 2</option>
                <option value="sora-2-pro">Sora 2 Pro</option>
              </select>
            </div>

            {/* Video Grid */}
            {filteredVideos.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No videos found"
                description="Try adjusting your filters or search query."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    job={video.jobId ? jobs.get(video.jobId) : undefined}
                    onClick={() => setSelectedVideo(video)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Video Detail Modal */}
      {selectedVideo && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedVideo(null)}
          title="Video Details"
          size="xl"
        >
          <VideoDetail
            video={selectedVideo}
            job={selectedVideo.jobId ? jobs.get(selectedVideo.jobId) : undefined}
            onDownload={() => handleDownload(selectedVideo)}
            onDelete={() => handleDelete(selectedVideo.id)}
            onOpenInNewTab={() => handleOpenInNewTab(selectedVideo)}
          />
        </Modal>
      )}
    </div>
  );
}

function VideoCard({
  video,
  job,
  onClick,
}: {
  video: Asset;
  job?: RenderJob;
  onClick: () => void;
}) {
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(video.blob);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [video]);

  return (
    <button
      onClick={onClick}
      className="glass-card-hover p-0 overflow-hidden text-left group"
    >
      <div className="relative aspect-video bg-background-secondary">
        <video
          src={videoUrl}
          className="w-full h-full object-cover"
          muted
          loop
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="text-4xl">▶️</div>
        </div>
      </div>

      <div className="p-3">
        {job && (
          <>
            <p className="text-sm text-text-primary font-medium line-clamp-2 mb-2">
              {job.prompt}
            </p>
            <div className="flex items-center justify-between text-xs text-text-tertiary">
              <span>{job.model}</span>
              <span>{job.resolution}</span>
              <span>{job.durationSec}s</span>
            </div>
          </>
        )}
        <div className="text-xs text-text-tertiary mt-2">
          {formatRelativeTime(video.createdAt)}
        </div>
      </div>
    </button>
  );
}

function VideoDetail({
  video,
  job,
  onDownload,
  onDelete,
  onOpenInNewTab,
}: {
  video: Asset;
  job?: RenderJob;
  onDownload: () => void;
  onDelete: () => void;
  onOpenInNewTab: () => void;
}) {
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(video.blob);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [video]);

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <video src={videoUrl} controls className="w-full rounded-lg bg-black" />

      {/* Metadata */}
      {job && (
        <div className="glass-card p-4 space-y-3">
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-1">Prompt</h3>
            <p className="text-text-primary">{job.prompt}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Model:</span>
              <span className="ml-2 text-text-primary">{job.model}</span>
            </div>
            <div>
              <span className="text-text-secondary">Resolution:</span>
              <span className="ml-2 text-text-primary">{job.resolution}</span>
            </div>
            <div>
              <span className="text-text-secondary">Duration:</span>
              <span className="ml-2 text-text-primary">{job.durationSec}s</span>
            </div>
            <div>
              <span className="text-text-secondary">Cost:</span>
              <span className="ml-2 text-text-primary">${job.costUsdEstimate.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* File Info */}
      <div className="glass-card p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-text-secondary">File Size:</span>
          <span className="text-text-primary">{formatBytes(video.bytes)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Created:</span>
          <span className="text-text-primary">{formatRelativeTime(video.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button onClick={onDownload} className="btn-primary flex-1">
          Download
        </button>
        <button onClick={onOpenInNewTab} className="btn-secondary flex-1">
          Open in New Tab
        </button>
        <button onClick={onDelete} className="btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
}

