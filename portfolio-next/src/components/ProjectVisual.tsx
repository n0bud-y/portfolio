'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ResolvedProject } from '@/lib/assets';

const glow = { purple: '108,99,255', mint: '124,247,212', neutral: '166,169,178' } as const;

/**
 * Real screenshot (next/image) when /public/projects/<slug>.* exists;
 * otherwise a clearly-labelled typographic placeholder — never a broken image.
 */
export function ProjectVisual({
  project,
  src,
  alt,
  sizes,
  priority,
}: {
  project: ResolvedProject;
  src?: string;
  alt?: string;
  sizes: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const image = src ?? project.image;

  if (image && !failed) {
    return (
      <Image
        src={image}
        alt={alt ?? `${project.name} website screenshot`}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
        className="object-cover object-top"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${project.name} — screenshot placeholder`}
      className="absolute inset-0 flex flex-col justify-between overflow-hidden bg-elevated p-5 md:p-8 lg:pb-16"
      style={{
        backgroundImage: `radial-gradient(60% 55% at 85% 15%, rgba(${glow[project.accent]},0.16), transparent 70%)`,
      }}
    >
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
      {/* Keeps the top edge clear for the card badges / parallax overscan */}
      <span aria-hidden />
      <div className="relative min-w-0">
        <p className="micro mb-3 text-muted">Screenshot pending</p>
        <p className="font-display text-[clamp(1.5rem,4vw,3rem)] font-medium leading-none tracking-tight text-fg/90">
          {project.name}
        </p>
        <p className="micro mt-3 text-muted [overflow-wrap:anywhere]">Add /public/projects/{project.slug}.jpg</p>
      </div>
    </div>
  );
}
