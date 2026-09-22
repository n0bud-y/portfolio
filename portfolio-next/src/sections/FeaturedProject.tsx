'use client';

import Link from 'next/link';
import { useRef, type ReactNode } from 'react';
import { ScrollTrigger, gsap } from '@/lib/gsap';
import { useImageReveal, useMotion } from '@/lib/animations';
import type { ResolvedProject } from '@/lib/assets';
import { SectionHeading } from '@/components/SectionHeading';
import { ProjectVisual } from '@/components/ProjectVisual';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Reveal } from '@/components/motion/Reveal';

/**
 * Featured case study — the site's ONE pinned interaction.
 * Desktop: the screenshot stays pinned (CSS sticky, no scroll-jacking) while the four text
 * steps scroll past and each activates in turn. Mobile / reduced motion: normal document flow.
 */
export function FeaturedProject({ project }: { project: ResolvedProject }) {
  const stage = useRef<HTMLDivElement>(null);
  const mask = useRef<HTMLDivElement>(null);
  useImageReveal(mask);
  const cs = project.caseStudy;

  const steps: { n: string; label: string; body: ReactNode }[] = [
    { n: '01', label: 'The challenge', body: <p className="lede">{cs.challenge}</p> },
    {
      n: '02',
      label: 'The build',
      body: (
        <>
          <p className="lede">{cs.approach}</p>
          <ul className="mt-6 space-y-2 text-fg2">
            {cs.implementation.map((i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="text-muted">—</span>
                {i}
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      n: '03',
      label: 'Technology',
      body: (
        <ul className="font-display text-2xl font-medium leading-snug tracking-tight md:text-3xl">
          {project.technologies.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      ),
    },
    {
      n: '04',
      label: 'Outcome',
      body: (
        <ul className="space-y-2 text-fg2">
          {cs.outcome.map((o) => (
            <li key={o} className="flex gap-3">
              <span aria-hidden className="text-mint">✓</span>
              {o}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  // Desktop: activate the step nearest the middle of the viewport; label the pinned image.
  useMotion(stage, ({ desktop }) => {
    const el = stage.current;
    if (!desktop || !el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>('.cs-step'));
    const no = el.querySelector('[data-step-no]');
    const label = el.querySelector('[data-step-label]');
    el.classList.add('js-steps');
    items.forEach((s) => s.classList.remove('is-active'));

    items.forEach((step) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 60%',
        end: 'bottom 60%',
        onToggle: (self) => {
          step.classList.toggle('is-active', self.isActive);
          if (self.isActive && no && label) {
            no.textContent = step.dataset.no ?? '';
            label.textContent = step.dataset.label ?? '';
          }
        },
      });
    });

    // The pinned frame settles slowly closer as you read.
    gsap.fromTo(
      el.querySelector('[data-pin-img]'),
      { scale: 1 },
      { scale: 1.05, ease: 'none', scrollTrigger: { trigger: el, start: 'top 60%', end: 'bottom 60%', scrub: true } },
    );

    return () => {
      el.classList.remove('js-steps');
      items.forEach((s) => s.classList.add('is-active'));
    };
  });

  return (
    <section id="case-study" className="section-pad border-y border-line bg-bg2">
      <div className="wrap">
        <SectionHeading size="xl" label="Featured case study" title={project.name} />

        <div ref={stage} className="mt-16 grid gap-y-14 md:mt-24 lg:grid-cols-12 lg:gap-x-6">
          {/* Pinned image (first in DOM so it leads on mobile) */}
          <div className="self-start lg:sticky lg:top-24 lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <Link
              href={`/work/${project.slug}`}
              data-cursor="open"
              data-track="project_open"
              data-track-label={`${project.slug}-featured`}
              aria-label={`${project.name} — open case study`}
              className="block"
            >
              <div
                ref={mask}
                className="relative aspect-[4/3] overflow-hidden rounded-[6px] border border-line bg-elevated lg:aspect-auto lg:h-[min(74vh,46rem)]"
              >
                <div data-pin-img className="absolute inset-0">
                  <ProjectVisual project={project} sizes="(min-width:1024px) 58vw, 100vw" />
                </div>
                <p className="micro absolute left-4 top-4 rounded-[4px] bg-bg/75 px-3 py-1.5 backdrop-blur-sm">
                  <span className="text-mint" data-step-no>
                    {project.number}
                  </span>{' '}
                  / <span data-step-label>{project.category}</span>
                </p>
              </div>
            </Link>
          </div>

          {/* Text column */}
          <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:pr-6">
            <Reveal>
              <p className="micro flex items-center gap-3">
                <span className="text-mint">{project.number}</span>
                <span aria-hidden className="h-px w-8 bg-white/20" />
                <span>{project.category}</span>
              </p>
              <p className="lede mt-6 max-w-[30rem]">{project.description}</p>
            </Reveal>

            <ol className="mt-12 lg:mt-24">
              {steps.map((s) => (
                <li
                  key={s.n}
                  data-no={s.n}
                  data-label={s.label}
                  className="cs-step is-active relative py-10 lg:min-h-[58vh] lg:last:min-h-[36vh]"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -left-2 -top-2 select-none font-display text-[clamp(8rem,14vw,13rem)] font-semibold leading-none text-fg/[0.045]"
                  >
                    {s.n}
                  </span>
                  <h3 className="micro relative mb-6 text-mint!">{s.label}</h3>
                  <div className="relative max-w-[30rem]">{s.body}</div>
                </li>
              ))}
            </ol>

            <div className="mt-10 lg:mt-16">
              <MagneticButton
                href={`/work/${project.slug}`}
                variant="primary"
                icon="up-right"
                track="project_open"
                trackLabel={project.slug}
                magnetic
              >
                View project
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
