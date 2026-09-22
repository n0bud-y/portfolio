'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { EASE, useImageReveal, useMotion, useParallax, useReveal } from '@/lib/animations';
import { cn } from '@/lib/utils';
import type { ResolvedProject } from '@/lib/assets';
import { ProjectVisual } from './ProjectVisual';

/**
 * Editorial compositions (12-col). The image is the hero (58–67% of the width);
 * text sits in the remaining columns and the composition flips between projects.
 */
const compositions = [
  { img: 'lg:col-start-1 lg:col-span-8', txt: 'lg:col-start-9 lg:col-span-4 lg:self-end' },
  { img: 'lg:col-start-6 lg:col-span-7', txt: 'lg:col-start-1 lg:col-span-4 lg:self-center' },
  { img: 'lg:col-start-1 lg:col-span-7', txt: 'lg:col-start-9 lg:col-span-4 lg:self-start lg:pt-20' },
  { img: 'lg:col-start-5 lg:col-span-8', txt: 'lg:col-start-1 lg:col-span-4 lg:self-end' },
] as const;

export function ProjectCard({ project, index, total }: { project: ResolvedProject; index: number; total: number }) {
  const card = useRef<HTMLElement>(null);
  const mask = useRef<HTMLDivElement>(null);
  const par = useRef<HTMLDivElement>(null);
  const comp = compositions[index % compositions.length];

  useReveal(card, 'fade');
  useImageReveal(mask);
  useParallax(par, 20);

  // Coordinated hover (desktop): image 1→1.03, overlay, title +4px, arrow +8px, metadata brightens.
  useMotion(card, ({ desktop, safe }) => {
    const el = card.current;
    if (!desktop || !el) return;
    const img = el.querySelector('[data-hover-img]');
    const shade = el.querySelector('[data-hover-shade]');
    const title = el.querySelector('[data-hover-title]');
    const arrow = el.querySelector('[data-hover-arrow]');
    const meta = el.querySelector('[data-hover-meta]');
    const to = (on: boolean) =>
      safe(() => {
        gsap.to(img, { scale: on ? 1.03 : 1, duration: 0.7, ease: EASE.out });
        gsap.to(shade, { opacity: on ? 0.14 : 0, duration: 0.7, ease: EASE.out });
        gsap.to(title, { x: on ? 4 : 0, duration: 0.5, ease: EASE.out });
        gsap.to(arrow, { x: on ? 8 : 0, y: on ? -3 : 0, duration: 0.5, ease: EASE.out });
        gsap.to(meta, { opacity: on ? 1 : 0.6, duration: 0.5, ease: EASE.out });
      });
    const enter = to(true);
    const leave = to(false);
    gsap.set(meta, { opacity: 0.6 });
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
    };
  });

  return (
    <article ref={card} className="min-w-0">
      <Link
        href={`/work/${project.slug}`}
        data-cursor="view"
        data-track="project_open"
        data-track-label={project.slug}
        aria-label={`${project.name} — view project`}
        className="group grid gap-8 lg:grid-cols-12 lg:gap-x-6"
      >
        <div ref={mask} className={cn('relative aspect-[4/3] overflow-hidden rounded-[6px] border border-line bg-elevated lg:row-start-1', comp.img)}>
          {/* parallax layer is taller than the frame so it never reveals an edge */}
          <div ref={par} className="absolute inset-0 lg:-inset-y-8">
            <div data-hover-img className="absolute inset-0">
              <ProjectVisual project={project} sizes="(min-width:1024px) 58vw, 100vw" />
            </div>
          </div>
          <div data-hover-shade aria-hidden className="pointer-events-none absolute inset-0 bg-bg opacity-0" />
        </div>

        <div className={cn('min-w-0 lg:row-start-1', comp.txt)}>
          <p className="micro flex items-center gap-3">
            <span className="text-mint">{project.number}</span>
            <span>/ {String(total).padStart(2, '0')}</span>
            <span aria-hidden className="h-px w-8 bg-white/20" />
            <span>{project.category}</span>
          </p>
          <h3 data-hover-title className="display-project mt-6">
            {project.name}
          </h3>
          <p className="mt-6 max-w-[28rem] text-fg2">{project.description}</p>
          <ul data-hover-meta className="micro mt-6 flex flex-wrap gap-x-3 gap-y-1">
            {project.technologies.map((t, i) => (
              <li key={t}>
                {t}
                {i < project.technologies.length - 1 && <span className="ml-3 text-muted">/</span>}
              </li>
            ))}
          </ul>
          <span className="micro mt-8 inline-flex items-center gap-2 text-fg!">
            View project
            <ArrowUpRight data-hover-arrow aria-hidden size={16} className="text-mint" />
          </span>
        </div>
      </Link>
    </article>
  );
}
