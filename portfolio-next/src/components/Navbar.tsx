'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { EASE, useMotion } from '@/lib/animations';
import { onIntroDone } from '@/lib/intro';
import { cn } from '@/lib/utils';
import { navLinks, siteConfig } from '@/data/siteConfig';

export function Navbar({ resumeAvailable }: { resumeAvailable: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  const links = [
    ...navLinks.map((l) => ({ ...l, track: undefined as string | undefined, external: false })),
    // Without a PDF the link points at the section that shows the editable placeholder.
    resumeAvailable
      ? { label: 'Resume', href: siteConfig.resume, track: 'resume_click', external: true }
      : { label: 'Resume', href: '/#resume', track: undefined, external: false },
  ];

  // Transparent at top → blurred dark bar; nudges up while scrolling down, returns when scrolling up.
  useEffect(() => {
    let last = window.scrollY;
    const el = header.current;
    const canMove = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    const toY = el && canMove ? gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' }) : null;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (toY && !document.body.style.overflow) toY(y > last && y > 160 ? -10 : 0);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Entrance, synchronised with the hero timeline (nav at ~0.05s).
  useMotion(bar, () => {
    gsap.set(bar.current, { y: -24, opacity: 0 });
    return onIntroDone(() => {
      gsap.to(bar.current, { y: 0, opacity: 1, duration: 0.7, delay: 0.05, ease: EASE.out });
    });
  });

  // Fullscreen menu: panel wipes in, links stagger; closing reverses it.
  useEffect(() => {
    const el = overlay.current;
    if (!el) return;
    const items = el.querySelectorAll('[data-menu-item]');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.killTweensOf([el, items]);

    if (open) {
      el.style.visibility = 'visible';
      document.body.style.overflow = 'hidden';
      if (reduce) {
        gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)' });
      } else {
        gsap.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: EASE.inOut });
        gsap.fromTo(items, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, delay: 0.25, ease: EASE.out });
      }
      (items[0] as HTMLElement | undefined)?.focus();
    } else {
      document.body.style.overflow = '';
      if (reduce) {
        gsap.set(el, { clipPath: 'inset(0% 0% 100% 0%)' });
        el.style.visibility = 'hidden';
      } else {
        gsap.to(el, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.45,
          ease: EASE.inOut,
          onComplete: () => {
            el.style.visibility = 'hidden';
          },
        });
      }
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open]);

  return (
    <>
      <header ref={header} className="fixed inset-x-0 top-0 z-50">
        <div
          ref={bar}
          className={cn(
            'border-b transition-[padding,background-color,border-color,backdrop-filter] duration-500',
            scrolled
              ? 'border-white/[0.06] bg-[rgba(9,10,12,0.75)] py-4 backdrop-blur-[16px]'
              : 'border-transparent bg-transparent py-6 md:py-7',
          )}
        >
          <nav aria-label="Primary" className="wrap flex items-center justify-between">
            <Link
              href="/"
              className="font-display text-xl font-semibold tracking-[0.02em]"
              aria-label={`${siteConfig.name} — home`}
            >
              {siteConfig.logo.slice(0, -1)}
              <span className="text-mint">.</span>
            </Link>

            <ul className="hidden items-center gap-9 lg:flex">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    data-track={l.track}
                    data-track-label="nav"
                    className="link-u micro inline-flex items-center gap-1 text-fg! transition-colors hover:text-mint!"
                    {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {l.label}
                    {l.label === 'Resume' && <ArrowUpRight aria-hidden size={12} />}
                  </a>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="micro relative z-50 -mr-2 inline-flex min-h-11 items-center px-2 text-fg! lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </nav>
        </div>
      </header>

      <div
        ref={overlay}
        id="mobile-menu"
        aria-hidden={!open}
        inert={!open}
        style={{ visibility: 'hidden', clipPath: 'inset(0% 0% 100% 0%)' }}
        className="fixed inset-0 z-40 flex flex-col justify-between bg-bg px-5 pb-10 pt-28 lg:hidden"
      >
        <ul className="flex flex-col">
          {links.map((l, i) => (
            <li key={l.label} data-menu-item tabIndex={-1} className="border-b border-line">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                data-track={l.track}
                data-track-label="nav-mobile"
                className="flex min-h-16 items-baseline justify-between py-4 font-display text-[clamp(2.25rem,11vw,3.5rem)] font-semibold uppercase leading-none tracking-[-0.03em]"
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span>
                  {l.label}
                  {l.label === 'Resume' && <span className="text-mint"> ↗</span>}
                </span>
                <span className="micro">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <div data-menu-item className="micro flex flex-col gap-1">
          <span>{siteConfig.location}</span>
          <span className="text-mint">{siteConfig.availability}</span>
        </div>
      </div>
    </>
  );
}
