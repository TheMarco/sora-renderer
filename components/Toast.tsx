'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const toasts: Toast[] = [];
const listeners: Array<(toasts: Toast[]) => void> = [];

function notifyListeners() {
  listeners.forEach((listener) => listener([...toasts]));
}

export function showToast(message: string, type: ToastType = 'info', duration = 5000) {
  const id = Math.random().toString(36).substring(7);
  const toast: Toast = { id, message, type, duration };

  toasts.push(toast);
  notifyListeners();

  if (duration > 0) {
    setTimeout(() => {
      const index = toasts.findIndex((t) => t.id === id);
      if (index !== -1) {
        toasts.splice(index, 1);
        notifyListeners();
      }
    }, duration);
  }
}

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.push(setCurrentToasts);
    return () => {
      const index = listeners.indexOf(setCurrentToasts);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const removeToast = (id: string) => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.splice(index, 1);
      notifyListeners();
    }
  };

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2" aria-live="polite">
      {currentToasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const typeStyles = {
    success: 'bg-success/20 border-success/30 text-success',
    error: 'bg-error/20 border-error/30 text-error',
    warning: 'bg-warning/20 border-warning/30 text-warning',
    info: 'bg-accent/20 border-accent/30 text-accent-light',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div
      className={cn(
        'glass-card px-4 py-3 min-w-[300px] max-w-md animate-slide-up',
        'flex items-center space-x-3',
        typeStyles[toast.type]
      )}
      role="alert"
    >
      <span className="text-xl flex-shrink-0">{icons[toast.type]}</span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded hover:bg-surface-hover transition-colors"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

