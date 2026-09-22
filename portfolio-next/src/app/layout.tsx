import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/data/siteConfig';
import { hasResume } from '@/lib/assets';
import { Loader } from '@/components/Loader';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/motion/CustomCursor';
import { PageTransition } from '@/components/motion/PageTransition';
import { DevConsole } from '@/components/DevConsole';
import { PageEffects } from '@/components/PageEffects';

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });
const sans = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.seo.title, template: `%s — ${siteConfig.name}` },
  description: siteConfig.seo.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  keywords: ['web developer', 'full-stack developer', 'WordPress developer', 'WooCommerce', 'React', 'Next.js', 'Karachi'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: siteConfig.name,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: siteConfig.seo.title, description: siteConfig.seo.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#090A0C', colorScheme: 'dark' };

/** Runs before first paint: skip the intro on repeat visits and for reduced-motion users. */
const introScript = `try{var r=matchMedia('(prefers-reduced-motion: reduce)').matches;if(r||sessionStorage.getItem('intro-seen'))document.documentElement.dataset.intro='skip'}catch(e){}`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      name: siteConfig.name,
      jobTitle: siteConfig.role,
      url: siteConfig.url,
      address: { '@type': 'PostalAddress', addressLocality: 'Karachi', addressCountry: 'PK' },
      sameAs: [siteConfig.linkedin, siteConfig.github].filter(Boolean),
      knowsAbout: ['WordPress', 'WooCommerce', 'PHP', 'JavaScript', 'React', 'Next.js', 'GSAP'],
    },
    { '@type': 'WebSite', name: `${siteConfig.name} — Portfolio`, url: siteConfig.url },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const resumeAvailable = hasResume();

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: '.loader{display:none!important}' }} />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:bg-mint focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <Loader />
        <Navbar resumeAvailable={resumeAvailable} />
        <main id="main">{children}</main>
        <Footer />
        <PageTransition />
        <CustomCursor />
        <DevConsole />
        <PageEffects />
      </body>
    </html>
  );
}
