'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useMotion } from '@/lib/animations';

/** Near-black backdrop: one very low-opacity accent glow and a grid that drifts ±40px with scroll. */
export function ContactBackdrop() {
  const root = useRef<HTMLDivElement>(null);

  useMotion(root, ({ desktop }) => {
    if (!desktop) return;
    gsap.fromTo(
      '[data-drift]',
      { y: -40 },
      {
        y: 40,
        ease: 'none',
        scrollTrigger: { trigger: root.current?.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div data-drift className="bg-grid absolute -inset-y-16 inset-x-0 opacity-70" />
      <div
        className="absolute left-1/2 top-[38%] h-[70vw] max-h-[60rem] w-[70vw] max-w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.09] blur-3xl"
        style={{ background: 'radial-gradient(circle, #6c63ff 0%, transparent 65%)' }}
      />
    </div>
  );
}
