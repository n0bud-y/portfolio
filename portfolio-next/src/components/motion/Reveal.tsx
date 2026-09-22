'use client';

import { createElement, useRef, type ReactNode } from 'react';
import { useReveal, useStagger, type RevealVariant } from '@/lib/animations';

type Tag = 'div' | 'p' | 'li' | 'ul' | 'ol' | 'section' | 'article' | 'header' | 'footer' | 'dl' | 'blockquote';

/** Reveal one block on scroll. Variants: up · fade · scale · mask · line · image. */
export function Reveal({
  as = 'div',
  variant = 'up',
  className,
  children,
  delay,
}: {
  as?: Tag;
  variant?: RevealVariant;
  className?: string;
  children?: ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, variant, { delay });
  return createElement(as, { ref, className }, children);
}

/** Reveal the children matching `selector` (default `[data-stagger]`) with a stagger. */
export function Stagger({
  as = 'div',
  variant = 'up',
  className,
  children,
  selector = '[data-stagger]',
  stagger,
}: {
  as?: Tag;
  variant?: RevealVariant;
  className?: string;
  children: ReactNode;
  selector?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useStagger(ref, selector, variant, { stagger });
  return createElement(as, { ref, className }, children);
}
