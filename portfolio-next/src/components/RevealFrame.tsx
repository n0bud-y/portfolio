'use client';

import { useRef, type ReactNode } from 'react';
import { useImageReveal } from '@/lib/animations';

/** Wraps a screenshot so it enters through a mask (clip-path inset + slight scale). */
export function RevealFrame({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useImageReveal(ref);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
