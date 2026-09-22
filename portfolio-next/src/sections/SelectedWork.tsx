import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { ProjectCard } from '@/components/ProjectCard';
import { Reveal } from '@/components/motion/Reveal';
import { LineReveal } from '@/components/motion/LineReveal';
import { additionalWooProjects } from '@/data/projects';
import type { ResolvedProject } from '@/lib/assets';

/**
 * Strong introduction first (no grid straight away), then the projects one at a time,
 * each in its own editorial composition.
 */
export function SelectedWork({ projects }: { projects: ResolvedProject[] }) {
  const total = projects.length;

  return (
    <section id="work" className="section-pad">
      <div className="wrap">
        <SectionHeading
          size="xl"
          index="01"
          label="Selected work"
          title={'Real projects.\nReal builds.'}
          subtitle="A collection of business websites, CMS builds, ecommerce experiences, and frontend work."
        />

        <Reveal variant="fade" className="mt-12 md:mt-16">
          <LineReveal />
          <p className="micro mt-5 flex flex-wrap gap-x-10 gap-y-2">
            <span>{String(total).padStart(2, '0')} selected projects</span>
            <span>Frontend / CMS / E-commerce</span>
          </p>
        </Reveal>

        <div className="mt-(--space-project) flex flex-col gap-(--space-project)">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} total={total} />
          ))}
        </div>

        {/* Renders only once real additional WooCommerce projects are added to data/projects.ts */}
        {additionalWooProjects.length > 0 && (
          <Reveal className="mt-(--space-project)">
            <LineReveal />
            <p className="micro mb-6 mt-5">More WooCommerce builds</p>
            <ul>
              {additionalWooProjects.map((p) => (
                <li key={p.name} className="border-b border-line">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="open"
                      className="group flex items-center justify-between gap-6 py-5"
                    >
                      <span className="display-project">{p.name}</span>
                      <span className="micro hidden sm:block">{p.note}</span>
                      <ArrowUpRight aria-hidden className="text-mint transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-2" />
                    </a>
                  ) : (
                    <div className="flex items-center justify-between gap-6 py-5">
                      <span className="display-project">{p.name}</span>
                      <span className="micro">{p.note}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
