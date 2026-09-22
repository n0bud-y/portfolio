PUBLIC ASSETS — what to drop in here
====================================

resume.pdf
  Put your resume at  public/resume.pdf  (path is set in src/data/siteConfig.ts).
  Until it exists, the site shows a clearly marked "Resume — add PDF" placeholder.

projects/<slug>.jpg      main screenshot for each project (.webp / .png also work)
projects/<slug>-2.jpg    extra screenshots, -2 to -6 (project detail page)
projects/<slug>-mobile.jpg   mobile view (project detail page)

Slugs: hanks-heating-cooling, a1-window-cleaning, twin-movers,
       americaport, polygon-pt, purplecan-apparel

Recommended: 1600x1200 or larger, top-of-page (above the fold) screenshots,
consistent framing. Restart `npm run dev` / rebuild after adding files.
