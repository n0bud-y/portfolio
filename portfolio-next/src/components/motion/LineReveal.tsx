'use client';

import { useRef } from 'react';
import { useReveal } from '@/lib/animations';
import { cn } from '@/lib/utils';

/** A 1px structural rule that draws itself in (scaleX 0 → 1, from the left). */
export function LineReveal({ className, strong }: { className?: string; strong?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, 'line');
  return <div ref={ref} aria-hidden className={cn('h-px w-full origin-left', strong ? 'bg-line-strong' : 'bg-line', className)} />;
}
