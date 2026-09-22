import { gsap } from '../gsap';
import { EASE, DUR } from './motion';

/**
 * Reveal presets (brief §41). One vocabulary used consistently across the site:
 *  up · fade · scale · mask · line · image
 */
export type RevealVariant = 'up' | 'fade' | 'scale' | 'mask' | 'line' | 'image';

type Preset = { from: gsap.TweenVars; to: gsap.TweenVars };

export const revealPresets: Record<RevealVariant, Preset> = {
  up: {
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0, duration: DUR.reveal, ease: EASE.out },
  },
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: 0.8, ease: EASE.out },
  },
  scale: {
    from: { opacity: 0, scale: 0.96 },
    to: { opacity: 1, scale: 1, duration: DUR.reveal, ease: EASE.out },
  },
  mask: {
    from: { clipPath: 'inset(100% 0% 0% 0%)', y: 24 },
    to: { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: DUR.reveal, ease: EASE.strong },
  },
  line: {
    from: { scaleX: 0, transformOrigin: 'left center' },
    to: { scaleX: 1, duration: 0.9, ease: EASE.strong },
  },
  image: {
    from: { clipPath: 'inset(10% 10% 10% 10% round 6px)', opacity: 0, scale: 1.05 },
    to: { clipPath: 'inset(0% 0% 0% 0% round 6px)', opacity: 1, scale: 1, duration: 1.2, ease: EASE.out },
  },
};

/** Reduced motion keeps only a short, movement-free fade. */
export const reducedPreset: Preset = {
  from: { opacity: 0 },
  to: { opacity: 1, duration: 0.4, ease: 'none' },
};

type RevealOpts = {
  reduced: boolean;
  trigger: Element | null;
  start?: string;
  delay?: number;
  stagger?: number;
};

/** Build a scroll-triggered reveal tween from a preset. */
export function revealTween(targets: gsap.TweenTarget, variant: RevealVariant, o: RevealOpts) {
  const p = o.reduced ? reducedPreset : revealPresets[variant];
  return gsap.fromTo(
    targets,
    { ...p.from },
    {
      ...p.to,
      delay: o.delay ?? 0,
      stagger: o.reduced ? 0 : (o.stagger ?? 0),
      scrollTrigger: { trigger: o.trigger, start: o.start ?? 'top 90%', once: true },
    },
  );
}
