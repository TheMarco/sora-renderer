/**
 * Image processing utilities for reference images
 */

import type { Resolution } from './types';

/**
 * Resize an image to match the target resolution
 * @param file - The original image file
 * @param targetResolution - The target video resolution (e.g., '1280x720')
 * @returns A new File object with the resized image
 */
export async function resizeImageToResolution(
  file: File,
  targetResolution: Resolution
): Promise<File> {
  // Parse target dimensions
  const [targetWidth, targetHeight] = targetResolution.split('x').map(Number);

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    img.onload = () => {
      // Set canvas to target dimensions
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Calculate scaling to cover the canvas while maintaining aspect ratio
      const imgAspect = img.width / img.height;
      const targetAspect = targetWidth / targetHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgAspect > targetAspect) {
        // Image is wider - fit height and crop width
        drawHeight = targetHeight;
        drawWidth = img.width * (targetHeight / img.height);
        offsetX = (targetWidth - drawWidth) / 2;
        offsetY = 0;
      } else {
        // Image is taller - fit width and crop height
        drawWidth = targetWidth;
        drawHeight = img.height * (targetWidth / img.width);
        offsetX = 0;
        offsetY = (targetHeight - drawHeight) / 2;
      }

      // Fill with black background (in case of transparency)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Draw the image centered and scaled
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob from canvas'));
            return;
          }

          // Create a new File object with the same name
          const resizedFile = new File([blob], file.name, {
            type: 'image/png',
            lastModified: Date.now(),
          });

          resolve(resizedFile);
        },
        'image/png',
        0.95 // Quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load the image
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Get the dimensions of an image file
 * @param file - The image file
 * @returns Promise with width and height
 */
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Check if an image needs resizing for the target resolution
 * @param file - The image file
 * @param targetResolution - The target video resolution
 * @returns Promise with boolean indicating if resize is needed
 */
export async function needsResize(
  file: File,
  targetResolution: Resolution
): Promise<boolean> {
  const [targetWidth, targetHeight] = targetResolution.split('x').map(Number);
  const { width, height } = await getImageDimensions(file);
  
  return width !== targetWidth || height !== targetHeight;
}

