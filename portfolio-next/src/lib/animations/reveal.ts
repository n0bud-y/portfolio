'use client';

/** Scroll-driven hooks built on useMotion + presets. Components never repeat animation code. */
import type { RefObject } from 'react';
import { gsap } from '../gsap';
import { DUR, EASE, useMotion } from './motion';
import { revealTween, type RevealVariant } from './presets';

type Ref = RefObject<HTMLElement | null>;
type Opts = { start?: string; delay?: number };

/** Reveal the element itself (any preset). Reduced motion → plain fade. */
export function useReveal(ref: Ref, variant: RevealVariant = 'up', opts: Opts = {}) {
  useMotion(
    ref,
    ({ reduced }) => {
      revealTween(ref.current, variant, { reduced, trigger: ref.current, ...opts });
    },
    [],
    true,
  );
}

/** Reveal the children matching `selector` with a stagger (0.05–0.12s). */
export function useStagger(
  ref: Ref,
  selector: string,
  variant: RevealVariant = 'up',
  opts: Opts & { stagger?: number } = {},
) {
  useMotion(
    ref,
    ({ reduced }) => {
      revealTween(selector, variant, { reduced, trigger: ref.current, stagger: 0.09, ...opts });
    },
    [],
    true,
  );
}

/** Headline masking: each `.line-inner` rises out of its `.line-mask`. */
export function useLineReveal(ref: Ref, opts: Opts = {}) {
  useMotion(
    ref,
    ({ reduced }) => {
      const scrollTrigger = { trigger: ref.current, start: opts.start ?? 'top 88%', once: true };
      if (reduced) {
        gsap.from('.line-inner', { opacity: 0, duration: 0.4, ease: 'none', scrollTrigger });
      } else {
        gsap.from('.line-inner', {
          yPercent: 110,
          duration: DUR.title,
          stagger: 0.08,
          ease: EASE.strong,
          delay: opts.delay ?? 0,
          scrollTrigger,
        });
      }
    },
    [],
    true,
  );
}

/** Section label: the rule grows, then the text slides/fades in (brief §42). */
export function useLabelReveal(ref: Ref) {
  useMotion(
    ref,
    ({ reduced }) => {
      const scrollTrigger = { trigger: ref.current, start: 'top 92%', once: true };
      if (reduced) {
        gsap.from(ref.current, { opacity: 0, duration: 0.4, ease: 'none', scrollTrigger });
        return;
      }
      gsap
        .timeline({ scrollTrigger })
        .from('[data-label-line]', { scaleX: 0, transformOrigin: 'left center', duration: 0.7, ease: EASE.strong })
        .from('[data-label-text]', { opacity: 0, x: -12, duration: 0.6, ease: EASE.out }, '-=0.25');
    },
    [],
    true,
  );
}

/** Masked image entrance (brief §22): begins just before the image is fully in view. */
export function useImageReveal(ref: Ref) {
  useMotion(
    ref,
    ({ reduced }) => {
      revealTween(ref.current, 'image', { reduced, trigger: ref.current, start: 'top 92%' });
    },
    [],
    true,
  );
}

/** Subtle parallax in px (brief §45: ~10–40px). Desktop + full motion only. */
export function useParallax(ref: Ref, px = 24) {
  useMotion(ref, ({ desktop }) => {
    if (!desktop || !ref.current || px === 0) return;
    gsap.fromTo(
      ref.current,
      { y: px },
      {
        y: -px,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current.parentElement ?? ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
}
