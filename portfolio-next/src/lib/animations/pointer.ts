'use client';

/** Pointer-driven effects: magnetic buttons and the custom cursor. Desktop / fine-pointer only. */
import { gsap } from '../gsap';

/** Fine pointer + ≥1024px + motion allowed. Everything here is gated on this. */
export function canUsePointerFx(): boolean {
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    window.matchMedia('(min-width: 1024px)').matches &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  );
}

/** Subtle magnetic pull, capped at `max` px (brief §37: 8–15px). Returns a cleanup. */
export function magnetic(el: HTMLElement, { max = 12, strength = 0.3 } = {}): () => void {
  if (!canUsePointerFx()) return () => {};
  const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
  const clamp = gsap.utils.clamp(-max, max);

  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    xTo(clamp((e.clientX - (r.left + r.width / 2)) * strength));
    yTo(clamp((e.clientY - (r.top + r.height / 2)) * strength));
  };
  const leave = () => {
    xTo(0);
    yTo(0);
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', leave);
  return () => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerleave', leave);
    gsap.killTweensOf(el);
    gsap.set(el, { x: 0, y: 0 });
  };
}

/**
 * Custom cursor: 6px dot → ~40px ring over links → ~80px "VIEW" bubble over elements
 * with data-cursor. quickTo + transforms only; one listener per event type.
 */
export function initCursor(dot: HTMLElement, ring: HTMLElement, label: HTMLElement): () => void {
  if (!canUsePointerFx()) return () => {};

  document.documentElement.classList.add('has-cursor');
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });
  gsap.set(ring, { scale: 0 });

  const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'none' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'none' });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3' });
  let shown = false;

  const move = (e: MouseEvent) => {
    if (!shown) {
      shown = true;
      gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    }
    dx(e.clientX);
    dy(e.clientY);
    rx(e.clientX);
    ry(e.clientY);
  };

  const setMode = (mode: 'default' | 'link' | 'view', text = '') => {
    label.textContent = text;
    gsap.to(ring, {
      scale: mode === 'default' ? 0 : mode === 'link' ? 0.5 : 1, // ring is 80px → 40px for links
      backgroundColor: mode === 'view' ? 'rgba(124,247,212,1)' : 'rgba(124,247,212,0)',
      borderColor: mode === 'view' ? 'rgba(124,247,212,1)' : 'rgba(255,255,255,0.45)',
      duration: 0.35,
      ease: 'power3.out',
    });
    gsap.to(label, { opacity: mode === 'view' ? 1 : 0, duration: 0.2 });
    gsap.to(dot, { scale: mode === 'view' ? 0 : 1, duration: 0.2 });
  };

  const over = (e: MouseEvent) => {
    const t = e.target as Element | null;
    const custom = t?.closest<HTMLElement>('[data-cursor]');
    if (custom) return setMode('view', (custom.dataset.cursor ?? 'view').toUpperCase());
    if (t?.closest('a, button, [role="button"], summary, input')) return setMode('link');
    setMode('default');
  };
  const leave = () => {
    shown = false;
    gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
  };

  window.addEventListener('mousemove', move, { passive: true });
  document.addEventListener('mouseover', over, { passive: true });
  document.documentElement.addEventListener('mouseleave', leave);

  return () => {
    window.removeEventListener('mousemove', move);
    document.removeEventListener('mouseover', over);
    document.documentElement.removeEventListener('mouseleave', leave);
    document.documentElement.classList.remove('has-cursor');
    gsap.killTweensOf([dot, ring, label]);
  };
}
