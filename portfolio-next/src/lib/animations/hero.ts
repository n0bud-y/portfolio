'use client';

import { gsap } from '../gsap';
import { onIntroDone } from '../intro';
import { EASE } from './motion';

/**
 * The hero's master timeline (brief §13), ambient pointer motion (§15) and scroll exit (§16).
 * Call inside useMotion(); returns a cleanup for the listeners it adds.
 *
 *   0.00  background fades in          0.65  supporting copy
 *   0.15  metadata                     0.75  buttons
 *   0.25  headline lines rise (masked) 0.90  rule + coordinates
 *   1.00+ ambient (pointer) motion
 */
export function heroAnimation(root: HTMLElement, { desktop }: { desktop: boolean }): () => void {
  const q = gsap.utils.selector(root);

  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.out } });
  tl.from(q('[data-hero=bg]'), { opacity: 0, duration: 0.5 }, 0)
    .from(q('[data-hero=meta] > *'), { y: 16, opacity: 0, duration: 0.6, stagger: 0.06 }, 0.15)
    .from(q('[data-hero=title] .line-inner'), { yPercent: 105, duration: 1.05, stagger: 0.08, ease: EASE.strong }, 0.25)
    .from(q('[data-hero=title]'), { opacity: 0, duration: 0.3 }, 0.3)
    .from(q('[data-hero=sub]'), { y: 18, opacity: 0, duration: 0.7 }, 0.65)
    .from(q('[data-hero=cta] > *'), { y: 18, opacity: 0, duration: 0.6, stagger: 0.07 }, 0.75)
    .from(q('[data-hero=rule]'), { scaleX: 0, transformOrigin: 'left center', duration: 1, ease: EASE.strong }, 0.9)
    .from(q('[data-hero=deco]'), { opacity: 0, duration: 0.7, stagger: 0.08 }, 0.9);

  const cleanups: (() => void)[] = [onIntroDone(() => tl.play()), () => tl.kill()];

  if (desktop) {
    const glow = root.querySelector<HTMLElement>('[data-hero-glow]');
    const type = root.querySelector<HTMLElement>('[data-hero-type]');
    const rule = root.querySelector<HTMLElement>('[data-hero=rule]');

    // Pointer: background glow, outlined type and the rule drift 5–15px. Primary text never moves.
    if (glow && type && rule) {
      gsap.set(glow, { xPercent: -50, yPercent: -50, x: root.clientWidth * 0.7, y: root.clientHeight * 0.35 });
      const gx = gsap.quickTo(glow, 'x', { duration: 1.4, ease: 'power3' });
      const gy = gsap.quickTo(glow, 'y', { duration: 1.4, ease: 'power3' });
      const tx = gsap.quickTo(type, 'x', { duration: 1.2, ease: 'power3' });
      const ty = gsap.quickTo(type, 'y', { duration: 1.2, ease: 'power3' });
      const rx = gsap.quickTo(rule, 'x', { duration: 1.2, ease: 'power3' });

      const move = (e: MouseEvent) => {
        const r = root.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        gx(e.clientX - r.left);
        gy(e.clientY - r.top);
        tx(-nx * 30); // ±15px
        ty(-ny * 20); // ±10px
        rx(nx * 16); // ±8px
      };
      root.addEventListener('mousemove', move);
      cleanups.push(() => root.removeEventListener('mousemove', move));
    }

    // Scroll exit: content lifts, fades and settles back a touch; the big type moves at another rate.
    const exit = { trigger: root, start: 'top top', end: 'bottom 25%', scrub: true };
    gsap.to(q('[data-hero-content]'), { y: -70, opacity: 0.1, scale: 0.98, transformOrigin: 'left top', ease: 'none', scrollTrigger: exit });
    gsap.to(q('[data-hero-depth]'), { y: -30, ease: 'none', scrollTrigger: exit });
  }

  return () => cleanups.forEach((fn) => fn());
}
