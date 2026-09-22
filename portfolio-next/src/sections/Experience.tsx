import { experience } from '@/data/experience';
import { SectionHeading } from '@/components/SectionHeading';
import { ExperienceTimeline } from '@/components/ExperienceTimeline';
import { LineReveal } from '@/components/motion/LineReveal';

export function Experience() {
  return (
    <section id="experience" className="bg-bg2 pb-(--space-section)">
      <div className="wrap">
        <LineReveal />
      </div>
      <div className="wrap pt-(--space-section)">
        <SectionHeading size="xl" index="03" label="Experience" title={'Professional\nexperience.'} />
        <ExperienceTimeline entries={experience} />
      </div>
    </section>
  );
}
