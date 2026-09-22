/**
 * Tiny coordination layer between the page loader and the entrance animations.
 * Components call onIntroDone(cb): it fires immediately if the intro already finished
 * (repeat visit, reduced motion) or as soon as the loader hands over.
 */
declare global {
  interface Window {
    __introDone?: boolean;
  }
}

const EVENT = 'portfolio:intro-done';

export function markIntroDone() {
  window.__introDone = true;
  window.dispatchEvent(new Event(EVENT));
}

export function onIntroDone(cb: () => void): () => void {
  if (window.__introDone) {
    cb();
    return () => {};
  }
  window.addEventListener(EVENT, cb, { once: true });
  return () => window.removeEventListener(EVENT, cb);
}
