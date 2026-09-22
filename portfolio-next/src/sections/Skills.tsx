'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import { skillGroups, type Skill } from '@/data/skills';
import { projects } from '@/data/projects';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';

const norm = (s: string) => s.trim().toLowerCase();

/** Projects whose technology list mentions this skill (or one of its aliases). */
function usedIn(skill: Skill) {
  const names = [skill.name, ...(skill.aliases ?? [])].map(norm);
  return projects.filter((p) => p.technologies.some((t) => names.includes(norm(t))));
}

/** Plain contextual note (no card): status, what it's used for, and the projects that prove it. */
function SkillDetail({ skill }: { skill: Skill }) {
  const ref = useRef<HTMLDivElement>(null);
  const proof = usedIn(skill);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !ref.current) return;
    const tween = gsap.fromTo(ref.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' });
    return () => {
      tween.kill();
    };
  }, [skill.name]);

  return (
    <div ref={ref} aria-live="polite" className="border-l border-mint/60 pl-5">
      <p className="micro flex items-center gap-3">
        <span className={cn(skill.status === 'Core' ? 'text-mint' : 'text-fg2')}>{skill.status}</span>
      </p>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight">{skill.name}</p>
      <p className="mt-3 text-fg2">{skill.usage}</p>
      {proof.length > 0 && (
        <p className="mt-4 text-sm">
          <span className="micro mr-3">Used in</span>
          {proof.map((p, i) => (
            <span key={p.slug}>
              <Link href={`/work/${p.slug}`} className="link-u text-fg">
                {p.name}
              </Link>
              {i < proof.length - 1 && <span className="text-muted">, </span>}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

export function Skills() {
  const [selected, setSelected] = useState<Skill>(skillGroups[1].skills[0]); // WordPress

  return (
    <section id="stack" className="section-pad">
      <div className="wrap grid gap-y-14 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading label="Stack" title="Stack." subtitle="Grouped by what each is used for. Hover or select a technology to see how I have used it." />
            <div className="mt-12 hidden lg:block">
              <SkillDetail skill={selected} />
            </div>
          </div>
        </div>

        <div className="space-y-10 lg:col-span-7 lg:col-start-6">
          {skillGroups.map((group) => (
            <Reveal key={group.id} className="border-t border-line pt-6">
              <h3 className="micro mb-5">{group.label}</h3>
              <ul className="flex flex-wrap gap-x-8 gap-y-2">
                {group.skills.map((skill) => {
                  const active = skill.name === selected.name;
                  return (
                    <li key={skill.name}>
                      <button
                        type="button"
                        aria-pressed={active}
                        onMouseEnter={() => setSelected(skill)}
                        onFocus={() => setSelected(skill)}
                        onClick={() => setSelected(skill)}
                        className={cn(
                          'link-u min-h-11 font-display text-2xl font-medium tracking-tight transition-colors duration-300 md:text-4xl',
                          active ? 'text-fg after:scale-x-100 after:bg-mint' : 'text-muted hover:text-fg',
                        )}
                      >
                        {skill.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {/* Mobile: the note sits right under the group it belongs to */}
              {group.skills.some((s) => s.name === selected.name) && (
                <div className="mt-6 lg:hidden">
                  <SkillDetail skill={selected} />
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
