import { SectionHeading } from '@/components/SectionHeading';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { ResumeButton } from '@/components/ResumeButton';
import { Reveal } from '@/components/motion/Reveal';
import { LineReveal } from '@/components/motion/LineReveal';

/** Quiet recruiter strip before the big contact statement. */
export function ResumeCTA({ resumeAvailable }: { resumeAvailable: boolean }) {
  return (
    <section id="resume" className="pb-(--space-section)">
      <div className="wrap">
        <LineReveal />
      </div>
      <div className="wrap grid gap-y-10 pt-16 md:pt-24 lg:grid-cols-12 lg:gap-x-6">
        <SectionHeading className="lg:col-span-7" label="Recruiters & collaborators" title={'Looking for\na developer?'} />
        <Reveal className="self-end lg:col-span-4 lg:col-start-9">
          <p className="lede">For recruiters, collaborators, and clients:</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton href="/#work" variant="primary" icon="arrow">
              View my work
            </MagneticButton>
            <ResumeButton available={resumeAvailable} />
            <MagneticButton href="#contact" variant="ghost" icon="up-right">
              Get in touch
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
