import { about } from '@/data/content';
import { siteConfig } from '@/data/siteConfig';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { LineReveal } from '@/components/motion/LineReveal';

/** Typography-first: huge two-line heading, narrow reading column, metadata under a growing rule. */
export function About() {
  return (
    <section id="about" className="pb-(--space-section)">
      <div className="wrap">
        <LineReveal />
      </div>
      <div className="wrap pt-(--space-section)">
        <SectionHeading size="xl" index="02" label="About" title={'More than\na CMS developer.'} />

        <div className="mt-16 grid gap-y-14 md:mt-24 lg:grid-cols-12 lg:gap-x-6">
          <Reveal as="blockquote" className="lg:col-span-5">
            <p className="font-display text-[clamp(1.4rem,2.1vw,2rem)] font-medium leading-[1.2] tracking-[-0.02em] text-fg">
              {about.quote}
            </p>
          </Reveal>

          <Stagger className="max-w-[40rem] space-y-6 lg:col-span-6 lg:col-start-7" stagger={0.1}>
            {about.paragraphs.map((p, i) => (
              <p key={i} data-stagger className={i === 0 ? 'lede text-fg!' : 'lede'}>
                {p}
              </p>
            ))}
          </Stagger>
        </div>

        <LineReveal className="mt-20 md:mt-28" />
        <Reveal variant="fade">
          <dl className="mt-6 grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...about.facts, ['Status', siteConfig.availability] as [string, string]].map(([k, v]) => (
              <div key={k}>
                <dt className="micro">{k}</dt>
                <dd className="mt-1 text-sm text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
