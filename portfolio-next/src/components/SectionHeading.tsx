'use client';

import { useRef } from 'react';
import { SplitText } from './motion/SplitText';
import { Reveal } from './motion/Reveal';
import { useLabelReveal, useLineReveal } from '@/lib/animations';
import { cn } from '@/lib/utils';

type Props = {
  index?: string; // e.g. "01"
  label?: string; // e.g. "Selected work"
  title: string; // "\n" = new line, *word* = accent
  subtitle?: string;
  className?: string;
  as?: 'h1' | 'h2';
  size?: 'md' | 'xl';
};

/** Micro-label ("01 / SELECTED WORK") + masked, line-by-line uppercase title + optional lede. */
export function SectionHeading({ index, label, title, subtitle, className, as: Tag = 'h2', size = 'md' }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  useLineReveal(root);
  useLabelReveal(labelRef);

  return (
    <div ref={root} className={className}>
      {label && (
        <p ref={labelRef} className="micro mb-8 flex items-center gap-4 md:mb-10">
          <span data-label-line aria-hidden className="h-px w-10 origin-left bg-white/30" />
          <span data-label-text>{index ? `${index} / ${label}` : label}</span>
        </p>
      )}
      <Tag className={cn(size === 'xl' ? 'display-xl' : 'display-section')}>
        <SplitText text={title} />
      </Tag>
      {subtitle && (
        <Reveal className="mt-8 max-w-[38rem] md:mt-10">
          <p className="lede">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}
