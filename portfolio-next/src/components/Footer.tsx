'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useMotion } from '@/lib/animations';
import { siteConfig } from '@/data/siteConfig';
import { getSocial } from '@/data/socials';

function FooterLink({ label }: { label: 'LinkedIn' | 'GitHub' }) {
  const s = getSocial(label);
  if (!s.href) {
    return (
      <span className="text-muted" title={s.placeholder}>
        {label} <span className="sr-only">— {s.placeholder}</span>
      </span>
    );
  }
  return (
    <a
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      data-track={s.track}
      data-track-label="footer"
      className="link-u hover:text-fg"
    >
      {label}
    </a>
  );
}

/** Final frame of the story: one enormous, barely-there word, then quiet metadata. */
export function Footer() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    if (!desktop) return;
    gsap.from('[data-wordmark]', {
      y: 60,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
    });
  });

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-line">
      <div
        data-wordmark
        aria-hidden
        className="pointer-events-none select-none pt-10 text-center font-display text-[clamp(7rem,29vw,30rem)] font-semibold uppercase leading-[0.8] tracking-[-0.06em] text-fg/[0.04]"
      >
        {siteConfig.shortName}
      </div>
      <div className="wrap grid gap-4 py-8 text-sm text-fg2 md:grid-cols-3 md:items-center">
        <p>
          © {siteConfig.copyrightYear} {siteConfig.name}
        </p>
        <p className="md:text-center">
          Built with Next.js, React &amp; GSAP
          <span className="micro ml-3 hidden lg:inline">press ` for console</span>
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 md:justify-end">
          <FooterLink label="LinkedIn" />
          <FooterLink label="GitHub" />
          <span className="micro">{siteConfig.location}</span>
        </div>
      </div>
    </footer>
  );
}
