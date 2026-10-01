# Portfolio – Muhammad Ayan Asif

Static site (HTML / CSS / JS). No build step. Everything it needs is in this folder —
no CDNs, so it works with a strict Content-Security-Policy.

```
index.html          page
404.html            "page not found" page
style.css           all styles
script.js           projects data, filters, nav, theme, hover effects
animations.js       GSAP + ScrollTrigger animations, Lenis smooth scroll
scene3d.js          three.js 3D background (loaded on first interaction)
assets/vendor/      gsap, ScrollTrigger, lenis, three (version in file name)
assets/fonts/       self-hosted Space Grotesk, Inter, Roboto Mono (woff2)
assets/img/         social preview image + app icons
favicon.svg  site.webmanifest  robots.txt  sitemap.xml
vercel.json         Vercel headers (security + caching)
.htaccess           same for Apache / cPanel hosting
```

## Before going live

1. **Domain** – replace `https://your-domain.com` with your real URL
   (your `*.vercel.app` URL for now) in: `index.html`, `robots.txt`, `sitemap.xml`.
2. **Content placeholders** – search `TODO` in `index.html` (email, GitHub, company, dates)
   and add `resume.pdf` to this folder.
3. **Project screenshots** – put images in `assets/img/projects/` (WebP, ~1280×800)
   and set `image` / `link` for each project in `script.js`.

## Preview locally

Fonts, icons and the security policy need a real web server (double-clicking
`index.html` works, but fonts fall back to system fonts):

```bash
npx serve .
```

## Deploy – Vercel (now)

- **With GitHub:** push this folder to a repo → vercel.com → *Add New Project* → import
  the repo → Framework preset **Other**, no build command, output directory `.` → Deploy.
- **With the CLI:** `npm i -g vercel` → run `vercel` in this folder → `vercel --prod`.

`vercel.json` adds the security headers and caching. `.vercelignore` / `.gitignore`
keep private files (the `.docx`, `temp.txt`) from being published.

## Deploy – own hosting later (cPanel / Hostinger / any Apache host)

Upload these to `public_html/`:

```
index.html 404.html style.css script.js animations.js scene3d.js
favicon.svg site.webmanifest robots.txt sitemap.xml .htaccess assets/
```

Do **not** upload: `*.docx`, `temp.txt`, `README.md`, `vercel.json`.
`.htaccess` forces HTTPS, sets the same security headers, caching and compression,
and blocks private file types even if one is uploaded by mistake.
Point your domain to the host, enable the free SSL (AutoSSL / Let's Encrypt), then
update the domain placeholders (step 1 above).

## Notes

- **Adding analytics / a contact form service later?** The Content-Security-Policy only
  allows files from this site. Add the service's domain to `script-src` / `connect-src` /
  `form-action` in **both** `vercel.json` and `.htaccess`, or it will be blocked.
- **Updating a library:** download the new version into `assets/vendor/` with the new
  version in the file name and update the `<script>` tag (the old name is cached for a year).
- **Icons** are an inline SVG sprite in `index.html` (Font Awesome Free, CC BY 4.0).
  To add one, copy its `<symbol>` from the Font Awesome SVG and use
  `<svg class="icon"><use href="#i-name"></use></svg>`.
