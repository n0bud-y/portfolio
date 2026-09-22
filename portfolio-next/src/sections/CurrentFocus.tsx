'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useMotion } from '@/lib/animations';
import { exploring, roadmap } from '@/data/content';
import { SectionHeading } from '@/components/SectionHeading';
import { LineReveal } from '@/components/motion/LineReveal';
import { Reveal } from '@/components/motion/Reveal';

/**
 * Career path as a large vertical list. As you scroll the line draws itself and each step
 * activates (white text, mint dot + glow); steps not yet reached stay muted.
 */
export function CurrentFocus() {
  const root = useRef<HTMLDivElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const fill = el.querySelector('[data-fill]');
    const steps = Array.from(el.querySelectorAll<HTMLElement>('.rm-step'));
    steps.forEach((s) => s.classList.remove('is-active'));

    gsap.fromTo(
      fill,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 65%',
          end: 'bottom 65%',
          scrub: true,
          onUpdate: (self) => {
            const reached = self.progress * el.offsetHeight;
            steps.forEach((s) => s.classList.toggle('is-active', reached >= s.offsetTop + s.offsetHeight / 2 - 2));
          },
        },
      },
    );

    // Teardown / reduced motion: leave the whole path lit.
    return () => steps.forEach((s) => s.classList.add('is-active'));
  });

  return (
    <section id="focus" className="pb-(--space-section)">
      <div className="wrap">
        <LineReveal />
      </div>
      <div className="wrap pt-(--space-section)">
        <SectionHeading
          size="xl"
          label="Current focus"
          title={'Currently\nmoving forward.'}
          subtitle="Where I have come from and where I am actively heading — learning in public, without claiming mastery."
        />

        <div ref={root} className="relative mt-20 md:mt-28">
          <span aria-hidden className="absolute bottom-10 left-[7px] top-10 w-px bg-white/10 md:bottom-14 md:top-14">
            <span data-fill className="block h-full w-full origin-top bg-mint" />
          </span>
          <ol>
            {roadmap.map((s, i) => (
              <li
                key={s.name}
                className="rm-step is-active relative grid items-center gap-x-6 gap-y-1 py-6 pl-12 md:grid-cols-12 md:py-9 md:pl-16"
              >
                <span aria-hidden className="rm-dot absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full" />
                <span className="micro md:col-span-1">0{i + 1}</span>
                <p className="rm-name display-project uppercase md:col-span-7">{s.name}</p>
                <p className="rm-note text-fg2 md:col-span-4">{s.note}</p>
              </li>
            ))}
          </ol>
        </div>

        <Reveal className="mt-20 md:mt-28">
          <LineReveal />
          <p className="micro mt-6">Exploring now</p>
          <ul className="mt-3 flex max-w-3xl flex-wrap gap-y-1 text-fg">
            {exploring.map((e, i) => (
              <li key={e}>
                {e}
                {i < exploring.length - 1 && <span className="mx-3 text-muted">/</span>}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
