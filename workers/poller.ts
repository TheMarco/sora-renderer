// Job polling worker with exponential backoff
// This worker polls job status and downloads completed assets

interface PollingJob {
  jobId: string;
  apiJobId: string;
  interval: number;
  nextPoll: number;
}

const pollingJobs = new Map<string, PollingJob>();
const MIN_INTERVAL = 2500;
const MAX_INTERVAL = 30000;
const BACKOFF_MULTIPLIER = 1.5;

// Listen for messages from the main thread
self.addEventListener('message', (event: MessageEvent) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'START_POLLING':
      startPolling(payload.jobId, payload.apiJobId);
      break;
    case 'STOP_POLLING':
      stopPolling(payload.jobId);
      break;
    case 'STOP_ALL':
      stopAllPolling();
      break;
    default:
      console.warn('Unknown message type:', type);
  }
});

function startPolling(jobId: string, apiJobId: string) {
  if (pollingJobs.has(jobId)) {
    return; // Already polling
  }

  const job: PollingJob = {
    jobId,
    apiJobId,
    interval: MIN_INTERVAL,
    nextPoll: Date.now(),
  };

  pollingJobs.set(jobId, job);
  scheduleNextPoll(jobId);
}

function stopPolling(jobId: string) {
  pollingJobs.delete(jobId);
}

function stopAllPolling() {
  pollingJobs.clear();
}

async function scheduleNextPoll(jobId: string) {
  const job = pollingJobs.get(jobId);
  if (!job) return;

  const now = Date.now();
  const delay = Math.max(0, job.nextPoll - now);

  setTimeout(() => {
    pollJob(jobId);
  }, delay);
}

async function pollJob(jobId: string) {
  const job = pollingJobs.get(jobId);
  if (!job) return;

  try {
    console.log(`[Poller] Polling job ${jobId} (API ID: ${job.apiJobId}), interval: ${job.interval}ms`);

    // Send poll request to main thread (which has access to the API key)
    self.postMessage({
      type: 'POLL_REQUEST',
      payload: { jobId, apiJobId: job.apiJobId },
    });

    // Increase interval with exponential backoff
    job.interval = Math.min(job.interval * BACKOFF_MULTIPLIER, MAX_INTERVAL);
    job.nextPoll = Date.now() + job.interval;

    // Schedule next poll
    scheduleNextPoll(jobId);
  } catch (error) {
    console.error('[Poller] Polling error:', error);

    // Notify main thread of error
    self.postMessage({
      type: 'POLL_ERROR',
      payload: { jobId, error: (error as Error).message },
    });

    // Continue polling with backoff
    job.interval = Math.min(job.interval * BACKOFF_MULTIPLIER, MAX_INTERVAL);
    job.nextPoll = Date.now() + job.interval;
    scheduleNextPoll(jobId);
  }
}

// Handle responses from main thread
self.addEventListener('message', (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === 'POLL_RESPONSE') {
    handlePollResponse(payload);
  }
});

function handlePollResponse(payload: any) {
  const { jobId, status, assets, error } = payload;

  console.log(`[Poller] Job ${jobId} status: ${status}`);

  // If job is complete or failed, stop polling
  if (status === 'succeeded' || status === 'failed' || status === 'blocked' || status === 'canceled') {
    console.log(`[Poller] Job ${jobId} finished with status: ${status}`);
    stopPolling(jobId);

    // Notify main thread
    self.postMessage({
      type: 'JOB_COMPLETE',
      payload: { jobId, status, assets, error },
    });
  } else {
    console.log(`[Poller] Job ${jobId} still in progress: ${status}`);
    // Job still in progress, notify main thread of status update
    self.postMessage({
      type: 'JOB_UPDATE',
      payload: { jobId, status },
    });
  }
}

export {};

