import { MagneticButton, PlaceholderButton } from './motion/MagneticButton';
import { siteConfig } from '@/data/siteConfig';

/**
 * Resume link that never renders a broken button: if /public/resume.pdf is missing,
 * a clearly marked placeholder is shown instead. Magnetic — it is a major CTA.
 */
export function ResumeButton({
  available,
  variant = 'secondary',
  label = 'Download resume',
}: {
  available: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  label?: string;
}) {
  if (!available) {
    return <PlaceholderButton hint={`Add resume.pdf to /public (${siteConfig.resume})`}>Resume — add PDF</PlaceholderButton>;
  }
  return (
    <MagneticButton
      href={siteConfig.resume}
      variant={variant}
      icon="download"
      track="resume_click"
      trackLabel="resume"
      download
      magnetic
    >
      {label}
    </MagneticButton>
  );
}
