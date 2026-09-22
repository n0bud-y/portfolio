'use client';

import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { EASE, useMotion } from '@/lib/animations';
import { capabilities } from '@/data/content';
import { SectionHeading } from '@/components/SectionHeading';
import { LineReveal } from '@/components/motion/LineReveal';
import { Stagger } from '@/components/motion/Reveal';

/**
 * Four large statements separated by rules — no cards. Desktop: rows rest at ~120px and open
 * to ~170px on hover/focus (text fades in, title shifts, arrow slides). Mobile / reduced
 * motion: everything stays visible, no expansion.
 */
export function WhatIBuild() {
  const list = useRef<HTMLElement>(null);

  useMotion(list, ({ desktop, safe }) => {
    const el = list.current;
    if (!desktop || !el) return;

    const cleanups = Array.from(el.querySelectorAll<HTMLElement>('[data-row]')).map((row) => {
      const panel = row.querySelector('[data-row-panel]');
      const title = row.querySelector('[data-row-title]');
      const arrow = row.querySelector('[data-row-arrow]');
      gsap.set(panel, { height: 0, opacity: 0 });
      gsap.set(arrow, { x: -14, opacity: 0 });

      const to = (on: boolean) =>
        safe(() => {
          gsap.to(panel, { height: on ? 'auto' : 0, opacity: on ? 1 : 0, duration: 0.5, ease: EASE.out });
          gsap.to(title, { x: on ? 8 : 0, duration: 0.5, ease: EASE.out });
          gsap.to(arrow, { x: on ? 0 : -14, opacity: on ? 1 : 0, duration: 0.4, ease: EASE.out });
          gsap.to(row, { backgroundColor: on ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0)', duration: 0.5 });
        });
      const enter = to(true);
      const leave = to(false);
      row.addEventListener('mouseenter', enter);
      row.addEventListener('mouseleave', leave);
      row.addEventListener('focusin', enter);
      row.addEventListener('focusout', leave);
      return () => {
        row.removeEventListener('mouseenter', enter);
        row.removeEventListener('mouseleave', leave);
        row.removeEventListener('focusin', enter);
        row.removeEventListener('focusout', leave);
      };
    });
    return () => cleanups.forEach((fn) => fn());
  });

  return (
    <section ref={list} id="capabilities" className="bg-bg2 pb-(--space-section)">
      <div className="wrap">
        <LineReveal />
      </div>
      <div className="wrap pt-(--space-section)">
        <SectionHeading size="xl" index="04" label="What I build" title={'What I\nbuild.'} />

        <Stagger as="ul" className="mt-16 border-b border-line md:mt-24" stagger={0.1}>
          {capabilities.map((c) => (
            <li key={c.number} data-stagger>
              <article data-row tabIndex={0} className="border-t border-line">
                <div className="grid items-center gap-x-6 gap-y-3 py-8 md:min-h-[7.5rem] md:grid-cols-12 md:py-6">
                  <span className="micro md:col-span-1">{c.number}</span>
                  <h3 data-row-title className="display-project uppercase md:col-span-9">
                    {c.title}
                  </h3>
                  <ArrowUpRight
                    data-row-arrow
                    aria-hidden
                    size={34}
                    className="hidden justify-self-end text-mint md:col-span-2 md:block"
                  />
                </div>
                <div data-row-panel className="overflow-hidden">
                  <div className="grid gap-x-6 gap-y-3 pb-6 md:grid-cols-12">
                    <p className="text-[0.95rem] leading-snug text-fg2 md:col-span-7 md:col-start-2">{c.text}</p>
                    <ul className="micro flex flex-wrap content-start gap-x-3 gap-y-1 md:col-span-3 md:col-start-10">
                      {c.stack.map((s, i) => (
                        <li key={s} className="text-fg">
                          {s}
                          {i < c.stack.length - 1 && <span className="ml-3 text-muted">/</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
