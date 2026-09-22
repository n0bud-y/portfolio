'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { track, type AnalyticsEvent } from '@/lib/analytics';

/** Global, render-less behaviours: analytics click delegation + ScrollTrigger refresh after load. */
export function PageEffects() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
      if (!el) return;
      track(el.dataset.track as AnalyticsEvent, { label: el.dataset.trackLabel ?? '' });
    };
    document.addEventListener('click', onClick);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    // Fonts finishing after first layout can shift trigger positions.
    document.fonts?.ready.then(refresh);

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('load', refresh);
    };
  }, []);

  return null;
}
