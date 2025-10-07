'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Navigation } from '@/components/Navigation';
import { Modal } from '@/components/Modal';
import { showToast } from '@/components/Toast';
import { PromptEditor } from '@/components/render/PromptEditor';
import { ModelPicker } from '@/components/render/ModelPicker';
import { ResolutionPicker } from '@/components/render/ResolutionPicker';
import { DurationSlider } from '@/components/render/DurationSlider';
import { CostBadge } from '@/components/render/CostBadge';
import { ImageDropZone } from '@/components/render/ImageDropZone';
import { db } from '@/lib/db';
import { createVideoJob } from '@/lib/openai';
import { fileToBase64 } from '@/lib/utils';
import { estimateCostUsd } from '@/lib/cost';
import { useAppStore } from '@/lib/store';
import { DEFAULT_DURATION } from '@/lib/constants';
import type { ModelId, Resolution, RenderJob } from '@/lib/types';

export default function NewRenderPage() {
  const router = useRouter();
  const addJob = useAppStore((state) => state.addJob);

  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<ModelId>('sora-2');
  const [resolution, setResolution] = useState<Resolution>('1280x720');
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    checkFirstRun();
  }, []);

  const checkFirstRun = async () => {
    const vault = await db.keyvault.get('openai');
    if (!vault) {
      setShowWelcome(true);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!prompt.trim()) {
      showToast('Please enter a prompt', 'error');
      return;
    }

    // Check for API key
    const vault = await db.keyvault.get('openai');
    if (!vault) {
      showToast('Please add your API key in Settings first', 'error');
      router.push('/settings');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare image data if provided
      let imageData: { mime_type: string; data: string } | undefined;
      if (selectedImage) {
        const base64 = await fileToBase64(selectedImage);
        imageData = {
          mime_type: selectedImage.type,
          data: base64,
        };
      }

      // Create job in OpenAI
      const { jobId: apiJobId } = await createVideoJob({
        model,
        prompt: prompt.trim(),
        resolution,
        duration,
        image: imageData,
      });

      // Calculate cost estimate
      const costEstimate = estimateCostUsd(model, resolution, duration);

      // Create local job record
      const jobId = uuidv4();
      const job: RenderJob = {
        id: jobId,
        model,
        resolution,
        durationSec: duration,
        prompt: prompt.trim(),
        costUsdEstimate: costEstimate.cost,
        apiJobId,
        status: 'queued',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Save to DB
      await db.jobs.add(job);

      // Update store
      addJob(job);

      showToast('Job submitted successfully!', 'success');

      // Reset form
      setPrompt('');
      setSelectedImage(null);
      setDuration(DEFAULT_DURATION);

      // Navigate to queue
      router.push('/queue');
    } catch (error) {
      console.error('Failed to submit job:', error);
      showToast((error as Error).message || 'Failed to submit job', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">New Render</h1>

        <div className="space-y-6">
          {/* Prompt Editor */}
          <section className="glass-card p-6">
            <PromptEditor value={prompt} onChange={setPrompt} />
          </section>

          {/* Image Upload */}
          <section>
            <ImageDropZone
              onImageSelect={setSelectedImage}
              selectedImage={selectedImage}
              onClear={() => setSelectedImage(null)}
            />
          </section>

          {/* Model Selection */}
          <section className="glass-card p-6">
            <ModelPicker value={model} onChange={setModel} resolution={resolution} />
          </section>

          {/* Resolution Selection */}
          <section className="glass-card p-6">
            <ResolutionPicker value={resolution} onChange={setResolution} model={model} />
          </section>

          {/* Duration Slider */}
          <section className="glass-card p-6">
            <DurationSlider value={duration} onChange={setDuration} model={model} />
          </section>

          {/* Cost Estimate */}
          <section>
            <CostBadge model={model} resolution={resolution} duration={duration} />
          </section>

          {/* Submit Button */}
          <section className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setPrompt('');
                setSelectedImage(null);
                setDuration(DEFAULT_DURATION);
              }}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Clear
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !prompt.trim()}
              className="btn-primary px-8"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner mr-2" />
                  Submitting...
                </>
              ) : (
                'Generate Video'
              )}
            </button>
          </section>

          {/* Legal Notice */}
          <section className="glass-card p-4 text-xs text-text-tertiary">
            <p>
              ⚠️ By submitting, you confirm you have rights to any uploaded media and comply with
              OpenAI&apos;s usage policies. Content policy violations may incur costs even if output is
              restricted.
            </p>
          </section>
        </div>
      </main>

      {/* Welcome Modal */}
      <Modal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        title="Welcome to Sora Renderer"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            This is a local-first video generation client for OpenAI Sora 2. All your data stays on
            your device.
          </p>

          <div className="glass-card p-4 space-y-2">
            <h3 className="font-semibold text-text-primary">To get started:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-text-secondary">
              <li>Add your OpenAI API key in Settings</li>
              <li>Create a prompt describing your video</li>
              <li>Choose model, resolution, and duration</li>
              <li>Submit and track progress in the Queue</li>
              <li>View completed videos in your Library</li>
            </ol>
          </div>

          <div className="flex justify-end space-x-2">
            <button onClick={() => setShowWelcome(false)} className="btn-secondary">
              Got it
            </button>
            <button
              onClick={() => {
                setShowWelcome(false);
                router.push('/settings');
              }}
              className="btn-primary"
            >
              Add API Key
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

