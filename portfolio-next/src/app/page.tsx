import { getProjects, hasResume } from '@/lib/assets';
import { Hero } from '@/sections/Hero';
import { ProofStrip } from '@/sections/ProofStrip';
import { SelectedWork } from '@/sections/SelectedWork';
import { FeaturedProject } from '@/sections/FeaturedProject';
import { Skills } from '@/sections/Skills';
import { About } from '@/sections/About';
import { Experience } from '@/sections/Experience';
import { WhatIBuild } from '@/sections/WhatIBuild';
import { CurrentFocus } from '@/sections/CurrentFocus';
import { ResumeCTA } from '@/sections/ResumeCTA';
import { Contact } from '@/sections/Contact';

export default function HomePage() {
  const projects = getProjects();
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const resumeAvailable = hasResume();

  return (
    <>
      <Hero resumeAvailable={resumeAvailable} />
      <ProofStrip />
      <SelectedWork projects={projects} />
      <FeaturedProject project={featured} />
      <Skills />
      <About />
      <Experience />
      <WhatIBuild />
      <CurrentFocus />
      <ResumeCTA resumeAvailable={resumeAvailable} />
      <Contact />
    </>
  );
}
