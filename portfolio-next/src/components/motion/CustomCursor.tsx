'use client';

import { useEffect, useRef } from 'react';
import { initCursor } from '@/lib/animations';

/** Renders the cursor elements; all behaviour lives in lib/animations/pointer.ts. Off on touch/reduced motion. */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!dot.current || !ring.current || !label.current) return;
    return initCursor(dot.current, ring.current, label.current);
  }, []);

  return (
    <div className="cursor pointer-events-none fixed left-0 top-0 z-[150]" aria-hidden>
      <div ref={dot} className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-mint" />
      <div
        ref={ring}
        className="fixed left-0 top-0 flex h-20 w-20 items-center justify-center rounded-full border border-white/45"
      >
        <span ref={label} className="text-[0.65rem] font-semibold tracking-[0.14em] text-bg opacity-0" />
      </div>
    </div>
  );
}
