'use client';

import { useCallback, useState } from 'react';
import { MAX_IMAGE_SIZE, SUPPORTED_IMAGE_TYPES } from '@/lib/constants';
import { formatBytes } from '@/lib/utils';
import { showToast } from '@/components/Toast';
import type { Resolution } from '@/lib/types';

interface ImageDropZoneProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
  targetResolution?: Resolution;
  isProcessing?: boolean;
}

export function ImageDropZone({
  onImageSelect,
  selectedImage,
  onClear,
  targetResolution,
  isProcessing = false
}: ImageDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      showToast('Unsupported file type. Please use PNG, JPEG, or WebP.', 'error');
      return false;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      showToast(`File too large. Maximum size is ${formatBytes(MAX_IMAGE_SIZE)}.`, 'error');
      return false;
    }

    return true;
  };

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        onImageSelect(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleClear = () => {
    onClear();
    setPreview(null);
  };

  if (selectedImage && preview) {
    return (
      <div className="glass-card p-4">
        <div className="flex items-start space-x-4">
          <img
            src={preview}
            alt="Selected reference"
            className="w-32 h-32 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h4 className="font-medium text-text-primary mb-1">Reference Image</h4>
            <p className="text-sm text-text-secondary mb-2">{selectedImage.name}</p>
            <div className="space-y-1">
              <p className="text-xs text-text-tertiary">{formatBytes(selectedImage.size)}</p>
              {targetResolution && (
                <p className="text-xs text-text-tertiary">
                  Resized to {targetResolution} to match video resolution
                </p>
              )}
            </div>
            <button
              onClick={handleClear}
              className="btn-secondary mt-3 text-sm"
              disabled={isProcessing}
            >
              Remove Image
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`glass-card p-8 border-2 border-dashed transition-all ${
        isProcessing
          ? 'border-accent bg-accent/10 cursor-wait'
          : isDragging
            ? 'border-accent bg-accent/10 cursor-pointer'
            : 'border-border hover:border-accent/50 cursor-pointer'
      }`}
    >
      <input
        type="file"
        accept={SUPPORTED_IMAGE_TYPES.join(',')}
        onChange={handleFileInput}
        className="hidden"
        id="image-input"
        disabled={isProcessing}
      />
      <label htmlFor="image-input" className={`block text-center ${isProcessing ? 'cursor-wait' : 'cursor-pointer'}`}>
        <div className="text-4xl mb-3">{isProcessing ? '⏳' : '🖼️'}</div>
        <h4 className="font-medium text-text-primary mb-2">
          {isProcessing ? 'Resizing Image...' : 'Add Reference Image (Optional)'}
        </h4>
        <p className="text-sm text-text-secondary mb-1">
          {isProcessing ? 'Please wait' : 'Drag and drop or click to select'}
        </p>
        <div className="space-y-1">
          <p className="text-xs text-text-tertiary">
            PNG, JPEG, or WebP • Max {formatBytes(MAX_IMAGE_SIZE)}
          </p>
          {targetResolution && !isProcessing && (
            <p className="text-xs text-accent">
              Will be automatically resized to {targetResolution}
            </p>
          )}
        </div>
      </label>
    </div>
  );
}

