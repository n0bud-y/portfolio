import { Marquee } from '@/components/motion/Marquee';
import { Reveal } from '@/components/motion/Reveal';
import { proofItems } from '@/data/content';

/** Quiet strip after the hero: label, then a slow editorial marquee between two rules. */
export function ProofStrip() {
  return (
    <section aria-label="Technologies" className="border-y border-line py-8 md:py-12">
      <Reveal variant="fade" className="wrap mb-6 md:mb-8">
        <p className="micro">What I work with</p>
      </Reveal>
      <Marquee items={proofItems} label="What I work with" />
    </section>
  );
}
