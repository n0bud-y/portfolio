'use client';

import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { heroAnimation, useMotion } from '@/lib/animations';
import { siteConfig } from '@/data/siteConfig';
import { heroStack } from '@/data/content';
import { SplitText } from '@/components/motion/SplitText';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { ResumeButton } from '@/components/ResumeButton';

/**
 * Asymmetric hero: a huge four-line headline with editorial indents, supporting copy tucked
 * into the empty right-hand space beside the short lines, and a typographic composition
 * (outlined AYAN clipped by the viewport edge + a bordered DEV) as the only "visual".
 */
export function Hero({ resumeAvailable }: { resumeAvailable: boolean }) {
  const root = useRef<HTMLElement>(null);
  useMotion(root, ({ desktop }) => heroAnimation(root.current!, { desktop }));

  return (
    <section ref={root} id="top" className="relative flex min-h-[92svh] flex-col overflow-hidden pb-8 pt-28 md:pt-32">
      {/* Background: barely-there grid + noise + one pointer-following glow */}
      <div data-hero="bg" aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0" />
        <div className="bg-noise absolute inset-0" />
        <div
          data-hero-glow
          className="absolute left-0 top-0 hidden h-[32rem] w-[32rem] rounded-full opacity-[0.11] blur-3xl lg:block"
          style={{ background: 'radial-gradient(circle, #6c63ff 0%, transparent 65%)' }}
        />
      </div>

      {/* Typographic composition — decorative, moves at a different rate to the content */}
      <div data-hero-depth aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        <div data-hero="deco" data-hero-type className="absolute -right-[5vw] bottom-[9vh] select-none text-right">
          <span className="text-outline block font-display text-[clamp(9rem,25vw,30rem)] font-semibold uppercase leading-[0.8] tracking-[-0.06em]">
            AYAN
          </span>
          <span className="ml-auto mr-[5vw] mt-[0.6vw] inline-block rounded-[4px] border border-line-strong px-[1.4vw] py-[0.5vw] font-display text-[clamp(1.75rem,5vw,6rem)] font-semibold uppercase leading-none tracking-[-0.04em] text-fg/30">
            DEV
          </span>
        </div>
      </div>

      <div data-hero-content className="wrap relative z-10 flex flex-1 flex-col">
        <div data-hero="meta" className="mb-10 flex items-start justify-between gap-6 md:mb-14">
          <p className="micro flex flex-col gap-1">
            <span className="text-fg!">{siteConfig.name}</span>
            <span>{siteConfig.role}</span>
          </p>
          <p className="micro hidden flex-col gap-1 text-right sm:flex">
            {siteConfig.heroMeta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </p>
        </div>

        <div className="relative">
          <h1 data-hero="title" className="display-hero">
            <SplitText
              text={'I build\nwebsites\nthat feel\n*alive.*'}
              lineClassName={['', 'md:pl-[0.9em]', '', 'md:pl-[1.5em]']}
            />
          </h1>

          <div className="mt-10 max-w-[30rem] lg:absolute lg:bottom-1 lg:right-0 lg:mt-0 lg:w-[22rem] xl:w-[26rem]">
            <div data-hero="sub">
              <p className="lede">{siteConfig.subline}</p>
              <p className="micro mt-5 flex flex-wrap gap-x-3 gap-y-1">
                {heroStack.map((t, i) => (
                  <span key={t}>
                    {t}
                    {i < heroStack.length - 1 && <span className="ml-3 text-muted">/</span>}
                  </span>
                ))}
              </p>
            </div>
            <div data-hero="cta" className="mt-8 flex flex-wrap items-center gap-3">
              <div>
                <MagneticButton href="#work" variant="primary" icon="arrow">
                  View my work
                </MagneticButton>
              </div>
              <div>
                <ResumeButton available={resumeAvailable} />
              </div>
              <div>
                <MagneticButton href="#contact" variant="ghost" icon="up-right">
                  Let&apos;s talk
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Technical footer: thin rule with tiny grid markers, availability, scroll cue */}
        <div className="mt-auto pt-14">
          <div className="relative">
            <div data-hero="rule" className="h-px w-full bg-white/15" />
            <span aria-hidden className="absolute -top-[6px] left-0 text-[11px] leading-none text-white/30">+</span>
            <span aria-hidden className="absolute -top-[6px] right-0 text-[11px] leading-none text-white/30">+</span>
          </div>
          <div data-hero="deco" className="micro mt-4 flex items-center justify-between gap-6">
            <p className="flex items-center gap-2.5">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-mint" />
              {siteConfig.availability}
            </p>
            <a href="#work" className="flex items-center gap-2 hover:text-fg">
              Scroll <ArrowDown aria-hidden size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
