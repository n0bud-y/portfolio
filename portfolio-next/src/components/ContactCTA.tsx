'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { magnetic } from '@/lib/animations';
import type { AnalyticsEvent } from '@/lib/analytics';

/**
 * The primary contact CTA: the whole band is the button. On hover a mint field sweeps in
 * (transform only), the text inverts, the arrow travels, and the label drifts ≤12px toward
 * the pointer.
 */
export function ContactCTA({
  href,
  external,
  track,
}: {
  href: string;
  external: boolean;
  track: AnalyticsEvent;
}) {
  const inner = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inner.current) return;
    return magnetic(inner.current, { max: 12, strength: 0.05 });
  }, []);

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      data-track={track}
      data-track-label="contact-cta"
      className="group relative block overflow-hidden border-y border-line-strong"
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-mint transition-transform duration-[650ms] ease-[var(--ease-out-strong)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
      <span
        ref={inner}
        className="relative flex items-center justify-between gap-6 py-10 font-display text-[clamp(1.75rem,8vw,6.5rem)] font-semibold uppercase leading-[0.95] tracking-[-0.04em] transition-colors duration-500 group-hover:text-bg group-focus-visible:text-bg md:py-16"
      >
        <span>
          Start a<br />
          conversation
        </span>
        <ArrowUpRight
          aria-hidden
          className="size-[0.9em] shrink-0 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-2 group-hover:translate-x-3"
        />
      </span>
    </a>
  );
}
