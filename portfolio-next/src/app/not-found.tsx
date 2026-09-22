import type { Metadata } from 'next';
import { MagneticButton } from '@/components/motion/MagneticButton';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className="wrap flex min-h-svh flex-col justify-center py-32">
      <p className="micro mb-6">Error / 404</p>
      <h1 className="display-hero">
        Page not
        <br />
        <span className="text-mint">found.</span>
      </h1>
      <p className="lede mt-8 max-w-md">That page does not exist or has moved. Head back to the work.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <MagneticButton href="/" variant="primary" icon="arrow">
          Back home
        </MagneticButton>
        <MagneticButton href="/#work" variant="secondary" icon="arrow">
          View my work
        </MagneticButton>
      </div>
    </section>
  );
}
