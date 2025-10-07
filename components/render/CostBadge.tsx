'use client';

import { estimateCostUsd, formatCost, formatRate } from '@/lib/cost';
import type { ModelId, Resolution } from '@/lib/types';

interface CostBadgeProps {
  model: ModelId;
  resolution: Resolution;
  duration: number;
}

export function CostBadge({ model, resolution, duration }: CostBadgeProps) {
  const estimate = estimateCostUsd(model, resolution, duration);

  return (
    <div className="glass-card p-4 border-accent/30">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-text-secondary mb-1">Estimated Cost</div>
          <div className="text-2xl font-bold text-accent-light">{formatCost(estimate.cost)}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-text-tertiary">{formatRate(estimate.rate)}</div>
          <div className="text-xs text-text-tertiary">{estimate.seconds} seconds</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-text-tertiary">
          💡 Based on official pricing. Actual cost may vary. Policy-blocked generations may still
          incur charges.
        </p>
      </div>
    </div>
  );
}

