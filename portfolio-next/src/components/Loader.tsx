'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { markIntroDone } from '@/lib/intro';
import { siteConfig } from '@/data/siteConfig';

/**
 * ~1.3s intro: name, a technical progress line, 0 → 100, then the panel lifts away.
 * Skipped on repeat visits (sessionStorage) and under prefers-reduced-motion — the
 * inline script in layout.tsx sets html[data-intro="skip"] before first paint.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const skip = document.documentElement.dataset.intro === 'skip';
    if (skip) {
      setGone(true);
      markIntroDone();
      return;
    }

    const counter = { v: 0 };
    const num = root.current?.querySelector('[data-count]');
    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem('intro-seen', '1');
        } catch {}
        setGone(true);
        markIntroDone();
      },
    });

    tl.from('[data-name] span', { yPercent: 110, duration: 0.55, stagger: 0.05, ease: 'power3.out' })
      .from('[data-meta]', { opacity: 0, y: 10, duration: 0.4 }, '-=0.3')
      .to(counter, {
        v: 100,
        duration: 0.7,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (num) num.textContent = String(Math.round(counter.v)).padStart(3, '0');
        },
      }, 0.1)
      .to('[data-line]', { scaleX: 1, duration: 0.7, ease: 'power2.inOut' }, 0.1)
      .to(root.current, { yPercent: -100, duration: 0.55, ease: 'power4.inOut' }, '+=0.05');

    return () => {
      tl.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="loader flex flex-col justify-between p-6 md:p-10" aria-hidden>
      <div data-meta className="micro flex justify-between">
        <span>{siteConfig.role}</span>
        <span>System / Loading</span>
      </div>
      <div>
        <p
          data-name
          className="flex overflow-hidden font-display text-[clamp(4rem,18vw,12rem)] font-medium leading-[0.9] tracking-[-0.05em]"
        >
          {siteConfig.shortName.split('').map((c, i) => (
            <span key={i} className="inline-block">
              {c}
            </span>
          ))}
        </p>
        <div className="mt-6 h-px w-full bg-white/10">
          <div data-line className="h-full origin-left scale-x-0 bg-mint" />
        </div>
      </div>
      <div data-meta className="micro flex justify-between">
        <span>{siteConfig.location}</span>
        <span data-count className="tabular-nums text-fg">
          000
        </span>
      </div>
    </div>
  );
}
