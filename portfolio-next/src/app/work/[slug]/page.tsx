import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { getProject } from '@/lib/assets';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/SectionHeading';
import { ProjectVisual } from '@/components/ProjectVisual';
import { RevealFrame } from '@/components/RevealFrame';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { LineReveal } from '@/components/motion/LineReveal';
import { Reveal } from '@/components/motion/Reveal';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: `${project.name} — Muhammad Ayan Asif`, description: project.description, url: `/work/${project.slug}` },
  };
}

/** One editorial block: oversized faint number behind, micro-label left, readable text right. */
function Block({ n, label, children }: { n: string; label: string; children: React.ReactNode }) {
  return (
    <section aria-label={label}>
      <LineReveal />
      <Reveal className="relative grid gap-6 py-12 md:grid-cols-12 md:gap-x-6 md:py-20">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-1 left-0 select-none font-display text-[clamp(6rem,11vw,10rem)] font-semibold leading-none text-fg/[0.04]"
        >
          {n}
        </span>
        <h2 className="micro relative text-mint! md:col-span-4">{label}</h2>
        <div className="relative max-w-[44rem] md:col-span-8">{children}</div>
      </Reveal>
    </section>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const cs = project.caseStudy;
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const meta: [string, string][] = [
    ['Role', project.role],
    ['Stack', project.technologies.join(' / ')],
    ['Category', project.category],
    ['Status', project.status],
    ...(project.year ? ([['Year', project.year]] as [string, string][]) : []),
  ];
  const gallerySizes = (i: number) => (i === 0 ? '(min-width:1024px) 1360px, 94vw' : '(min-width:768px) 44vw, 94vw');

  return (
    <article className="pb-(--space-section) pt-32 md:pt-44">
      <div className="wrap">
        <Link href="/#work" className="micro link-u mb-14 inline-flex items-center gap-2 hover:text-fg">
          <ArrowLeft aria-hidden size={14} /> All work
        </Link>

        <SectionHeading as="h1" size="xl" index={project.number} label="Project" title={project.name} />
        <Reveal variant="fade" className="mt-8">
          <p className="micro">{project.category}</p>
          <p className="lede mt-6 max-w-[40rem]">{project.description}</p>
        </Reveal>

        <RevealFrame className="relative mt-14 aspect-[4/3] overflow-hidden rounded-[6px] border border-line bg-elevated md:mt-20 md:aspect-[16/9]">
          <ProjectVisual project={project} sizes="(min-width:1024px) 1360px, 94vw" priority />
        </RevealFrame>

        <Reveal variant="fade">
          <dl className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {meta.slice(0, 4).map(([k, v], i) => (
              <div key={k} className={i === 1 ? 'sm:col-span-2 lg:col-span-2' : undefined}>
                <dt className="micro">{k}</dt>
                <dd className="mt-1 text-fg">{v}</dd>
              </div>
            ))}
            {project.year && (
              <div>
                <dt className="micro">Year</dt>
                <dd className="mt-1 text-fg">{project.year}</dd>
              </div>
            )}
          </dl>
        </Reveal>

        {project.liveUrl && (
          <div className="mt-10">
            <MagneticButton href={project.liveUrl} variant="primary" icon="up-right" magnetic>
              Visit website
            </MagneticButton>
          </div>
        )}

        <div className="mt-(--space-project)">
          <Block n="01" label="Overview">
            <p className="lede text-fg!">{cs.overview}</p>
          </Block>
          <Block n="02" label="The challenge">
            <p className="lede">{cs.challenge}</p>
          </Block>
          <Block n="03" label="Approach">
            <p className="lede">{cs.approach}</p>
          </Block>
          <Block n="04" label="Implementation">
            <ul className="space-y-3">
              {cs.implementation.map((i) => (
                <li key={i} className="flex gap-3 text-fg2">
                  <span aria-hidden className="text-mint">→</span>
                  {i}
                </li>
              ))}
            </ul>
          </Block>
          <Block n="05" label="Key features">
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {cs.keyFeatures.map((f) => (
                <li key={f} className="border-t border-line pt-3 text-fg">
                  {f}
                </li>
              ))}
            </ul>
          </Block>
          <Block n="06" label="Responsive views">
            <p className="lede mb-8">{cs.responsive}</p>
            {project.mobileImage ? (
              <div className="relative aspect-[9/16] w-52 overflow-hidden rounded-[6px] border border-line bg-elevated">
                <Image src={project.mobileImage} alt={`${project.name} mobile view`} fill sizes="208px" className="object-cover object-top" />
              </div>
            ) : (
              <p className="inline-block rounded-[4px] border border-dashed border-white/25 px-3 py-2 text-sm text-fg2">
                Mobile screenshot pending — add /public/projects/{project.slug}-mobile.jpg
              </p>
            )}
          </Block>
          <Block n="07" label="Result">
            <ul className="space-y-3">
              {cs.outcome.map((o) => (
                <li key={o} className="flex gap-3 text-fg">
                  <span aria-hidden className="text-mint">✓</span>
                  {o}
                </li>
              ))}
            </ul>
          </Block>
        </div>

        {/* Screenshots: one large image, then smaller supporting pairs, generous spacing */}
        <div className="mt-(--space-project)">
          <LineReveal />
          <p className="micro mb-10 mt-5">Screenshots</p>
          {project.gallery.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-12 md:gap-6">
              {project.gallery.map((src, i) => (
                <RevealFrame
                  key={src}
                  className={cn(
                    'relative overflow-hidden rounded-[6px] border border-line bg-elevated',
                    i === 0 ? 'aspect-[16/9] md:col-span-12' : 'aspect-[4/3] md:col-span-6',
                  )}
                >
                  <Image src={src} alt={`${project.name} screenshot ${i + 2}`} fill sizes={gallerySizes(i)} className="object-cover object-top" />
                </RevealFrame>
              ))}
            </div>
          ) : (
            <p className="inline-block rounded-[4px] border border-dashed border-white/25 px-3 py-2 text-sm text-fg2">
              Additional screenshots pending — add /public/projects/{project.slug}-2.jpg (up to -6)
            </p>
          )}
        </div>

        {/* Exit path: next project, then contact */}
        <Link
          href={`/work/${next.slug}`}
          data-cursor="view"
          data-track="project_open"
          data-track-label={`${next.slug}-next`}
          className="group mt-(--space-project) block border-y border-line-strong py-12 md:py-20"
        >
          <span className="micro flex items-center justify-between">
            <span>Next project</span>
            {/* number rolls to the next project's on hover */}
            <span className="block h-[1.5em] overflow-hidden">
              <span className="block transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-full">
                <span className="block h-[1.5em]">{project.number}</span>
                <span className="block h-[1.5em] text-mint">{next.number}</span>
              </span>
            </span>
          </span>
          <span className="mt-8 flex items-end justify-between gap-6">
            <span className="display-xl block transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-2">
              {next.name}
            </span>
            <ArrowUpRight aria-hidden className="size-[clamp(2rem,6vw,5rem)] shrink-0 text-mint transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-2" />
          </span>
        </Link>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
          <Link href="/#work" className="micro link-u inline-flex items-center gap-2 hover:text-fg">
            <ArrowLeft aria-hidden size={14} /> All work
          </Link>
          <MagneticButton href="/#contact" variant="primary" icon="up-right" magnetic>
            Contact
          </MagneticButton>
        </div>
      </div>
    </article>
  );
}
