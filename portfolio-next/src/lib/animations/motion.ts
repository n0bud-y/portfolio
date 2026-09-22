'use client';

/**
 * Motion foundation: shared curves/durations and the React-safe GSAP wrapper.
 *
 * useMotion() runs `setup` inside gsap.matchMedia(), so:
 *  - every tween / ScrollTrigger created inside is reverted automatically on unmount,
 *    on hot-reload and when a media query flips (no duplicate triggers in dev)
 *  - selectors passed to gsap are scoped to `scope`
 *  - prefers-reduced-motion is honoured centrally
 */
import { useEffect, useLayoutEffect, type RefObject } from 'react';
import { gsap } from '../gsap';

/** Preferred curves (brief §77). */
export const EASE = {
  out: 'power3.out',
  strong: 'power4.out',
  inOut: 'power4.inOut',
  expo: 'expo.out',
  ambient: 'sine.inOut',
} as const;

/** Motion durations in seconds (brief §78). */
export const DUR = {
  micro: 0.3,
  button: 0.4,
  hover: 0.7,
  reveal: 1.0,
  title: 1.1,
  page: 0.45,
} as const;

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type MotionInfo = {
  /** ≥1024px AND motion allowed — gate parallax / pinning-style effects on this. */
  desktop: boolean;
  /** User asked for reduced motion (only ever true when `allowReduced` was passed). */
  reduced: boolean;
  /** Wrap event handlers so tweens created inside them are tracked by the context. */
  safe: <T extends (...args: never[]) => unknown>(fn: T) => T;
};

export function useMotion(
  scope: RefObject<HTMLElement | null>,
  setup: (info: MotionInfo) => void | (() => void),
  deps: unknown[] = [],
  /** Also run under reduced motion (for simple opacity fades only). */
  allowReduced = false,
) {
  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        full: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
        desktop: '(min-width: 1024px)',
      },
      (ctx) => {
        const c = ctx.conditions as { full: boolean; reduce: boolean; desktop: boolean };
        if (c.reduce && !allowReduced) return;
        const safe = ((ctx as unknown as { contextSafe?: (fn: unknown) => unknown }).contextSafe ??
          ((fn: unknown) => fn)) as MotionInfo['safe'];
        return setup({ desktop: c.desktop && !c.reduce, reduced: c.reduce, safe });
      },
      scope.current ?? undefined,
    );
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
