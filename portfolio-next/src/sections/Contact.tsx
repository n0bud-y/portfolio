import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { ContactCTA } from '@/components/ContactCTA';
import { ContactBackdrop } from '@/components/ContactBackdrop';
import { Reveal, Stagger } from '@/components/motion/Reveal';
import { LineReveal } from '@/components/motion/LineReveal';
import { siteConfig } from '@/data/siteConfig';
import { getSocial, socials } from '@/data/socials';

/** The final major statement: enormous headline, a full-width CTA band, then quiet contact rows. */
export function Contact() {
  const email = getSocial('Email');
  const linkedin = getSocial('LinkedIn');
  // Prefer email; until one is supplied the CTA opens LinkedIn so it is never a dead link.
  const cta = email.href ? email : linkedin;

  return (
    <section id="contact" className="relative overflow-hidden pb-(--space-section)">
      <div className="wrap relative z-10">
        <LineReveal />
      </div>
      <ContactBackdrop />

      <div className="wrap relative z-10 pt-(--space-section)">
        <SectionHeading size="xl" index="05" label="Contact" title={"Let's build\nsomething\nuseful."} />

        <Reveal className="mt-16 md:mt-24">
          <ContactCTA href={cta.href} external={cta.external} track={cta.track} />
          <p className="micro mt-6 flex flex-wrap gap-x-8 gap-y-1">
            <span>{siteConfig.availability}</span>
            <span>Based in Karachi</span>
          </p>
        </Reveal>

        <Stagger as="ul" className="mt-20 max-w-3xl border-b border-line" stagger={0.1}>
          {socials.map((s) => (
            <li
              key={s.label}
              data-stagger
              className="grid grid-cols-[5rem_1fr] items-center gap-4 border-t border-line py-5 sm:grid-cols-[6rem_1fr_auto]"
            >
              <span className="micro">{s.label}</span>
              {s.href ? (
                <a
                  href={s.href}
                  target={s.external ? '_blank' : undefined}
                  rel={s.external ? 'noopener noreferrer' : undefined}
                  data-track={s.track}
                  data-track-label="contact-list"
                  className="link-u w-fit text-sm text-fg [overflow-wrap:anywhere] sm:text-base"
                >
                  {s.display}
                </a>
              ) : (
                <span className="w-fit rounded-[4px] border border-dashed border-white/25 px-3 py-1 text-sm text-fg2">
                  {s.placeholder}
                </span>
              )}
              <ArrowUpRight aria-hidden size={18} className="hidden text-muted sm:block" />
            </li>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
