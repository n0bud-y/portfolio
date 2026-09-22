'use client';

import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Download } from 'lucide-react';
import { magnetic } from '@/lib/animations';
import { cn, isExternal } from '@/lib/utils';
import type { AnalyticsEvent } from '@/lib/analytics';

type Props = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: 'arrow' | 'up-right' | 'download' | 'down' | 'none';
  track?: AnalyticsEvent;
  trackLabel?: string;
  className?: string;
  download?: boolean;
  /** Reserved for major CTAs only (resume, view project, start a conversation). Max 12px pull. */
  magnetic?: boolean;
};

const variants = {
  primary:
    'border border-line-strong bg-white/[0.04] text-fg hover:border-fg hover:bg-fg hover:text-bg',
  secondary: 'border border-line bg-transparent text-fg hover:border-line-strong hover:bg-white/[0.06]',
  ghost: 'border border-transparent px-1 text-fg2 hover:text-fg',
};

const icons = { arrow: ArrowRight, 'up-right': ArrowUpRight, download: Download, down: ArrowDown };

export function MagneticButton({
  href,
  children,
  variant = 'secondary',
  icon = 'arrow',
  track,
  trackLabel,
  className,
  download,
  magnetic: useMagnet = false,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const Icon = icon === 'none' ? null : icons[icon];

  useEffect(() => {
    if (!useMagnet || !ref.current) return;
    return magnetic(ref.current, { max: 12 });
  }, [useMagnet]);

  const classes = cn(
    'group inline-flex min-h-12 items-center gap-3 rounded-full px-6 py-3 text-[0.75rem] font-medium uppercase tracking-[0.12em]',
    'transition-[background-color,border-color,color] duration-[400ms] ease-[var(--ease-out)]',
    variants[variant],
    className,
  );

  const inner = (
    <>
      <span className="transition-transform duration-[400ms] ease-[var(--ease-out)] group-hover:translate-x-0.5">{children}</span>
      {Icon && (
        <Icon
          aria-hidden
          size={15}
          className={cn(
            'transition-transform duration-[400ms] ease-[var(--ease-out)]',
            icon === 'up-right' && 'group-hover:-translate-y-0.5 group-hover:translate-x-1',
            icon === 'arrow' && 'group-hover:translate-x-1.5',
            icon === 'down' && 'group-hover:translate-y-1',
            icon === 'download' && 'group-hover:translate-y-0.5',
          )}
        />
      )}
    </>
  );

  const shared = { ref, className: classes, 'data-track': track, 'data-track-label': trackLabel };

  if (isExternal(href) || href.startsWith('mailto:') || download) {
    const external = isExternal(href);
    return (
      <a
        {...shared}
        href={href}
        download={download || undefined}
        target={external || download ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {inner}
      </a>
    );
  }
  if (href.startsWith('#')) {
    return (
      <a {...shared} href={href}>
        {inner}
      </a>
    );
  }
  return (
    <Link {...shared} href={href}>
      {inner}
    </Link>
  );
}

/** Marked, non-clickable stand-in used when a link target hasn't been supplied yet. */
export function PlaceholderButton({ children, hint }: { children: ReactNode; hint: string }) {
  return (
    <span
      title={hint}
      className="inline-flex min-h-12 items-center gap-3 rounded-full border border-dashed border-white/25 px-6 py-3 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-fg2"
    >
      {children}
      <span className="sr-only"> — {hint}</span>
    </span>
  );
}
