'use client';

import { useRef } from 'react';
import { ScrollTrigger, gsap } from '@/lib/gsap';
import { useMotion } from '@/lib/animations';
import type { ExperienceEntry } from '@/data/experience';
import { Reveal } from './motion/Reveal';

/**
 * Vertical timeline: date | role + company | description (desktop). A 1px spine fills with
 * scroll progress and each entry activates as it enters the viewport. Stacks on mobile.
 */
export function ExperienceTimeline({ entries }: { entries: ExperienceEntry[] }) {
  const root = useRef<HTMLOListElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>('.tl-item'));
    el.classList.add('js-timeline');
    items.forEach((i) => i.classList.remove('is-active'));

    gsap.fromTo(
      '[data-spine]',
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 70%', end: 'bottom 60%', scrub: true } },
    );
    items.forEach((item) =>
      ScrollTrigger.create({
        trigger: item,
        start: 'top 68%',
        onEnter: () => item.classList.add('is-active'),
        onLeaveBack: () => item.classList.remove('is-active'),
      }),
    );

    return () => {
      el.classList.remove('js-timeline');
      items.forEach((i) => i.classList.add('is-active'));
    };
  });

  return (
    <ol ref={root} className="relative mt-16 md:mt-24">
      <span aria-hidden className="absolute bottom-0 left-[0.4rem] top-3 w-px bg-white/10">
        <span data-spine className="block h-full w-full origin-top bg-mint" />
      </span>

      {entries.map((e, idx) => (
        <li key={`${e.role}-${e.company}`} className="tl-item is-active relative pb-20 pl-10 last:pb-0 md:pl-16">
          <span aria-hidden className="tl-dot absolute left-0 top-2.5 h-3.5 w-3.5 rounded-full" />
          <Reveal className="tl-body relative grid gap-y-8 lg:grid-cols-12 lg:gap-x-6">
            <div className="lg:col-span-2">
              <p className="micro">Date</p>
              <p className={e.current ? 'mt-1 text-mint' : 'mt-1 text-fg'}>{e.period}</p>
            </div>
            <div className="relative lg:col-span-4">
              {/* oversized faint index, sitting behind the role title */}
              <span
                aria-hidden
                className="pointer-events-none absolute -left-4 -top-14 hidden select-none font-display text-[clamp(8rem,13vw,13rem)] font-semibold leading-none text-fg/[0.04] md:block"
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h3 className="display-project">{e.role}</h3>
              <p className="mt-4 text-fg">{e.company}</p>
              <p className="micro mt-1">{e.location}</p>
            </div>
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
              {e.highlights.map((h) => (
                <li key={h} className="flex gap-3 border-t border-line pt-3 text-fg2">
                  <span aria-hidden className="text-mint">→</span>
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
