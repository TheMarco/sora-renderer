// Thumbnail generation worker
// Extracts first frame from video and creates a thumbnail

self.addEventListener('message', async (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === 'GENERATE_THUMBNAIL') {
    try {
      const thumbnail = await generateThumbnail(payload.videoBlob, payload.videoId);
      self.postMessage({
        type: 'THUMBNAIL_READY',
        payload: { videoId: payload.videoId, thumbnail },
      });
    } catch (error) {
      self.postMessage({
        type: 'THUMBNAIL_ERROR',
        payload: { videoId: payload.videoId, error: (error as Error).message },
      });
    }
  }
});

async function generateThumbnail(videoBlob: Blob, videoId: string): Promise<Blob> {
  // Create a video element
  const video = document.createElement('video');
  video.preload = 'metadata';
  video.muted = true;

  // Create object URL for the video
  const videoUrl = URL.createObjectURL(videoBlob);
  video.src = videoUrl;

  return new Promise((resolve, reject) => {
    video.addEventListener('loadeddata', async () => {
      try {
        // Seek to 0.1 seconds to avoid black frames
        video.currentTime = 0.1;

        await new Promise<void>((resolveSeek) => {
          video.addEventListener('seeked', () => resolveSeek(), { once: true });
        });

        // Create canvas and draw video frame
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Set canvas size (maintain aspect ratio, max width 400px)
        const maxWidth = 400;
        const scale = maxWidth / video.videoWidth;
        canvas.width = maxWidth;
        canvas.height = video.videoHeight * scale;

        // Draw the video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(videoUrl);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create thumbnail blob'));
            }
          },
          'image/jpeg',
          0.85
        );
      } catch (error) {
        URL.revokeObjectURL(videoUrl);
        reject(error);
      }
    });

    video.addEventListener('error', () => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error('Failed to load video'));
    });
  });
}

export {};

