'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from '@/lib/gsap';
import { DUR, EASE } from '@/lib/animations';

/**
 * Route transition (brief §47): a dark panel wipes up over the page, the route changes,
 * then the panel wipes away. ~0.9s round trip total. Skipped for reduced motion, new tabs,
 * modifier clicks, downloads, external links and same-page (hash) navigation.
 */
export function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const panel = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const guard = useRef<number | undefined>(undefined);

  // New route rendered → reveal it.
  useEffect(() => {
    if (!pending.current || !panel.current) return;
    pending.current = false;
    window.clearTimeout(guard.current);
    gsap.to(panel.current, {
      yPercent: -100,
      duration: DUR.page,
      ease: EASE.inOut,
      onComplete: () => {
        gsap.set(panel.current, { yPercent: 100, visibility: 'hidden' });
      },
    });
  }, [pathname]);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    gsap.set(el, { yPercent: 100, visibility: 'hidden' });

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const a = (e.target as Element | null)?.closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;

      e.preventDefault();
      e.stopPropagation(); // stop next/link from also navigating
      pending.current = true;
      gsap.set(el, { visibility: 'visible', yPercent: 100 });
      gsap.to(el, {
        yPercent: 0,
        duration: 0.4,
        ease: EASE.inOut,
        onComplete: () => router.push(url.pathname + url.search + url.hash),
      });
      // Failsafe: never leave the panel stuck over the page.
      guard.current = window.setTimeout(() => {
        pending.current = false;
        gsap.to(el, { yPercent: -100, duration: DUR.page, ease: EASE.inOut });
      }, 4000);
    };

    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.clearTimeout(guard.current);
      gsap.killTweensOf(el);
    };
  }, [router]);

  return (
    <div
      ref={panel}
      data-page-transition
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[190] flex items-end bg-surface p-6 md:p-10"
      style={{ visibility: 'hidden', transform: 'translateY(100%)' }}
    >
      <span className="micro">Loading</span>
    </div>
  );
}
