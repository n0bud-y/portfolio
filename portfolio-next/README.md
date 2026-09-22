# Muhammad Ayan Asif — Portfolio

Next.js (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · lucide-react.
No other animation or 3D libraries.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
```

## What to fill in (placeholders are clearly marked in the UI)

| Item | Where | Until then |
| --- | --- | --- |
| Email | `src/data/siteConfig.ts` → `email` | Marked placeholder; "Start a conversation" opens LinkedIn |
| GitHub URL | `src/data/siteConfig.ts` → `github` | Marked placeholder |
| Resume PDF | drop at `public/resume.pdf` | "Resume — add PDF" placeholder (never a broken button) |
| Project screenshots | `public/projects/<slug>.jpg` | Labelled "Screenshot pending" panel |
| Live domain | env `NEXT_PUBLIC_SITE_URL` (or `siteConfig.url`) | `https://example.com` — set before deploying (canonical, sitemap, OG) |
| Employer + dates | `src/data/experience.ts` | "Software House / Startup", period "Present" |
| Project years / live URLs | `src/data/projects.ts` | Hidden when empty |

Screenshot names: `<slug>.jpg` (main), `<slug>-2.jpg … -6.jpg` (gallery), `<slug>-mobile.jpg`
(`.webp`/`.png` also work). Slugs: `hanks-heating-cooling`, `a1-window-cleaning`, `twin-movers`,
`americaport`, `polygon-pt`, `purplecan-apparel`. Rebuild (or restart dev) after adding files.

## Please review (honesty)

Nothing here invents metrics, clients, testimonials or company names. Still, some copy is *draft* and
should be checked against reality:

- `projects.ts` — technologies come from the "potential technologies" in the brief; `role` is assumed
  (`CMS / Frontend Developer`); case-study text is qualitative draft copy.
- `skills.ts` — the `Core / Growing / Exploring` labels are my best reading of the brief. Edit any that
  don't match.
- WooCommerce: the brief says ~6–7 projects. No count is shown. Add confirmed ones to
  `additionalWooProjects` in `projects.ts` and they appear under Selected Work.

## Structure

```
src/
  app/            layout (fonts, SEO, JSON-LD), page, work/[slug], not-found, robots, sitemap, OG image, icon
  components/     Navbar, Footer, ProjectCard, ProjectVisual, MagneticButton, ResumeButton, Marquee,
                  SplitText, SectionHeading, Reveal/Stagger, CustomCursor, Loader, DevConsole, PageEffects…
  sections/       Hero, ProofStrip, SelectedWork, FeaturedProject, Skills, About, Experience,
                  WhatIBuild, CurrentFocus, ResumeCTA, Contact
  data/           siteConfig, projects, skills, experience, socials, content   ← all copy lives here
  lib/            gsap (registration), animations (hooks), intro, analytics, assets (server), utils
```

### Animation system (`src/lib/animations.ts`)

`useMotion` (base; respects `prefers-reduced-motion`, scopes selectors, reverts on unmount),
`useReveal`, `useStaggerReveal`, `useSplitReveal`, `useParallax`, `useImageReveal`.
Under reduced motion nothing is hidden or moved: content is simply visible. Parallax and pinning-style
effects run on desktop only.

### Other behaviours

- **Loader** ~1.3s, skipped on repeat visits (sessionStorage) and for reduced motion. A tiny inline script
  in `layout.tsx` decides before first paint, so there is no flash.
- **Custom cursor** only on fine-pointer, ≥1024px, motion-allowed devices. `data-cursor="view|open"` on
  any element gives the VIEW ↗ / OPEN ↗ bubble.
- **Easter egg:** press the backtick key (`` ` ``) for a tiny console (`help`, `whoami`, `stack`, `focus`…).
- **Analytics-ready:** elements carry `data-track="resume_click|project_open|contact_click|linkedin_click|github_click"`.
  Listen with `window.addEventListener('portfolio:track', e => …)`. No third-party analytics is installed.
- **SEO:** metadata, Open Graph/Twitter, canonical, generated OG image, favicon, `robots.txt`,
  `sitemap.xml`, Person + WebSite JSON-LD.
