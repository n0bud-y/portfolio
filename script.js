// ================= PROJECT DATA =================
// category: "webapp" | "business" | "corporate" | "ecommerce"
// image: path to a real screenshot, e.g. "images/hanks.jpg" (leave "" to show the gradient placeholder)
// link:  verified live URL (leave "" to hide the "Show project" button)
// caseStudy: path to a detailed project page (adds a "Read case study" button)
const projects = [
  {
    title: "AmericaPort",
    type: "Multi-Vendor Marketplace",
    category: "ecommerce",
    stack: ["Laravel", "Vue 2", "Vuetify", "Stripe", "MySQL", "Bootstrap"],
    desc: "A Made-in-USA marketplace: many sellers, one Stripe checkout, per-vendor order fulfilment, commission ledger and payouts, plus a 13-module admin console. Built end to end.",
    icon: "anchor",
    image: "assets/img/projects/americaport/sf-home.webp",
    link: "",
    caseStudy: "projects/americaport.html",
  },
  {
    title: "Multi-Brand CMS",
    type: "Full-Stack Web App",
    category: "webapp",
    stack: ["Laravel 12", "Inertia.js", "React", "TypeScript", "Tailwind v4", "PHP brand kit"],
    desc: "brand.cms: one panel that runs the blogs, auto-generated location pages, SEO and settings of six brand websites through a drop-in PHP kit and a keyed API. Designed and built by me.",
    icon: "server",
    image: "assets/img/projects/brands-cms/bc-sites.webp",
    link: "",
    caseStudy: "projects/brands-cms.html",
  },
  {
    title: "Ink Pixel Studios",
    type: "Company Website",
    category: "webapp",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Contentful"],
    desc: "The studio's brand portfolio and lead-generation site: 62 server-rendered pages, a Contentful case-study engine, mega menus and GSAP motion. Sole developer, 60%+ of the UI designed by me.",
    icon: "wand-magic-sparkles",
    image: "assets/img/projects/inkpixel/ip-home.webp",
    link: "",
    caseStudy: "projects/inkpixel.html",
  },
  {
    title: "Hank's Heating & Cooling",
    type: "Business Website",
    category: "business",
    stack: ["WordPress", "Custom Theme", "CMS", "ACF", "Responsive Frontend"],
    desc: "Professional service-business website focused on clear service presentation, structured content, contact conversion, and responsive UX.",
    icon: "fire-flame-simple",
    image: "",
    link: "",
  },
  {
    title: "A1 Window Cleaning",
    type: "Business Website",
    category: "business",
    stack: ["WordPress", "Custom Theme", "ACF", "Responsive Frontend"],
    desc: "Service-business website focused on strong visual hierarchy, trust-building content, service information, and contact conversion.",
    icon: "spray-can-sparkles",
    image: "",
    link: "",
  },
  {
    title: "Twin Movers",
    type: "Moving / Service Business Website",
    category: "business",
    stack: ["WordPress", "Custom Theme", "CMS", "Responsive Frontend"],
    desc: "Service-focused website with clear service information, strong calls to action, and responsive layouts.",
    icon: "truck-moving",
    image: "",
    link: "",
  },
  {
    title: "Polygon PT",
    type: "Multi-Branch Clinic Website",
    category: "business",
    stack: ["WordPress", "Custom Theme", "ACF", "PHP", "GSAP", "UI/UX Design"],
    desc: "A physical therapy group with 8 branches: I designed the site structure and UI, and built 26 custom templates where every branch has its own page, modules and local SEO, linked to shared condition pages.",
    icon: "dumbbell",
    image: "assets/img/projects/polygon/pg-home.webp",
    link: "",
    caseStudy: "projects/polygon-pt.html",
  },
  {
    title: "Purplecan Apparel",
    type: "E-commerce",
    category: "ecommerce",
    stack: ["WooCommerce", "WordPress", "Custom Frontend", "Product Management", "Responsive UI"],
    desc: "E-commerce website focused on product presentation, shopping flow, responsive design, and WooCommerce functionality.",
    icon: "shirt",
    image: "",
    link: "",
  },
];

const hasGsap = typeof gsap !== "undefined";

// ================= RENDER PROJECTS =================
// All project text is escaped before it goes into HTML, and links must be https://,
// so a typo (or data from a CMS later) can never inject markup or a javascript: URL.
const esc = (v) =>
  String(v).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
const safeUrl = (u) => (/^https:\/\//i.test(u) ? u : "");
// case-study pages are local .html files only
const safeLocal = (u) => (/^[\w-]+(\/[\w-]+)*\.html$/.test(u || "") ? u : "");
const safeImg = (u) => (/^(https:\/\/|\/|\.\/|[\w-]+\/)[\w\-./%]+$/i.test(u) ? u : "");

const grid = document.getElementById("workGrid");
grid.innerHTML = projects
  .map((p, i) => {
    const num = String(i + 1).padStart(2, "0");
    const link = safeUrl(p.link);
    const img = safeImg(p.image);
    const visual = img
      ? `<img src="${esc(img)}" alt="${esc(p.title)} website screenshot" loading="lazy" decoding="async" width="1280" height="800" />`
      : `<div class="art" aria-hidden="true">
          <div class="art-bar"><i></i><i></i><i></i></div>
          <div class="art-body">
            <svg class="icon art-icon"><use href="#i-${esc(p.icon)}"></use></svg>
            <span class="art-title">${esc(p.title)}</span>
            <div class="art-lines"><span></span><span></span></div>
            <span class="art-btn"></span>
          </div>
        </div>`;
    const study = safeLocal(p.caseStudy);
    const overlay = study
      ? `<div class="overlay"><a href="${esc(study)}" class="btn btn-primary btn-sm">Read case study<span class="sr-only">: ${esc(p.title)}</span></a></div>`
      : link
      ? `<div class="overlay"><a href="${esc(link)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">View live site<span class="sr-only"> ${esc(p.title)} (opens in a new tab)</span></a></div>`
      : "";
    return `
    <article class="project glass" data-category="${esc(p.category)}" data-reveal>
      <div class="project-image">
        ${visual}
        ${overlay}
      </div>
      <div class="project-details">
        <div class="project-top"><span class="project-category">${esc(p.type)}</span><span class="num" aria-hidden="true">${num}</span></div>
        <h3 class="project-title">${esc(p.title)}</h3>
        <p class="project-desc">${esc(p.desc)}</p>
        <ul class="tags">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        ${study ? `<a href="${esc(study)}" class="text-link card-link">Read case study <span aria-hidden="true">→</span></a>` : ""}
      </div>
    </article>`;
  })
  .join("");


// ================= FILTERS =================
const filters = document.querySelectorAll(".filter");
filters.forEach((btn) => {
  const f = btn.dataset.filter;
  const count = f === "all" ? projects.length : projects.filter((p) => p.category === f).length;
  btn.querySelector(".count").textContent = count;
  if (!count) btn.hidden = true; // no projects in this category (yet)
  btn.setAttribute("aria-pressed", btn.classList.contains("active"));

  btn.addEventListener("click", () => {
    filters.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");

    const shown = [];
    document.querySelectorAll(".project").forEach((card) => {
      const match = f === "all" || card.dataset.category === f;
      card.classList.toggle("hide", !match);
      if (match) shown.push(card);
    });

    if (hasGsap) {
      gsap.fromTo(
        shown,
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out", stagger: 0.07, overwrite: true }
      );
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
  });
});

// ================= 3D TILT + SPOTLIGHT ON PROJECT CARDS (desktop mouse only) =================
// The card leans toward the cursor, the mockup inside drifts the other way (depth),
// and --mx / --my move the light + glowing border drawn in style.css.
const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (fineHover && hasGsap && !prefersReduced) {
  document.querySelectorAll(".project").forEach((card) => {
    const inner = card.querySelector(".art") || card.querySelector(".project-image img");
    const isImg = inner && inner.tagName === "IMG";
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const px = x / r.width - 0.5, py = y / r.height - 0.5;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      gsap.to(card, { rotateY: px * 12, rotateX: -py * 10, transformPerspective: 900, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      if (inner) gsap.to(inner, { x: -px * 16, y: -py * 10, scale: isImg ? 1.08 : 1, duration: 0.6, ease: "power3.out", overwrite: "auto" });
    });
    card.addEventListener("pointerleave", () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.9, ease: "power3.out", overwrite: "auto" });
      if (inner) gsap.to(inner, { x: 0, y: 0, scale: 1, duration: 0.9, ease: "power3.out", overwrite: "auto" });
    });
  });
}

// ================= HEADER / NAV =================
const header = document.getElementById("header");
const nav = document.getElementById("nav");
const burger = document.getElementById("burger");
const backTop = document.getElementById("backTop");
const navLinks = document.querySelectorAll(".nav-link");
const sections = [...navLinks].map((l) => document.querySelector(l.getAttribute("href")));
let lastY = window.scrollY;

// Section positions are measured once (and on resize/load), not on every scroll event
let sectionTops = [];
function measureSections() {
  sectionTops = sections.map((s) => (s ? s.getBoundingClientRect().top + window.scrollY : Infinity));
  if (typeof onScroll === "function") onScroll();
}
measureSections();
window.addEventListener("resize", measureSections);
window.addEventListener("load", measureSections);
// pinned sections (GSAP) change the page height, so re-measure whenever ScrollTrigger refreshes
if (window.ScrollTrigger) ScrollTrigger.addEventListener("refresh", measureSections);

function onScroll() {
  const y = window.scrollY;
  const menuOpen = nav.classList.contains("open");

  header.classList.toggle("scrolled", y > 40);
  // Hide header while scrolling down, show it again when scrolling up
  if (!menuOpen) header.classList.toggle("hidden", y > lastY && y > 300);
  // during the 3D ride the corner belongs to the chapter counter
  const inRide = document.querySelector(".ride.is-live") && !document.body.classList.contains("past-ride");
  backTop.classList.toggle("show", y > 700 && !inRide);
  lastY = y;

  // Highlight the nav link for the section in view
  const pos = y + window.innerHeight / 3;
  let current = -1;
  sectionTops.forEach((top, i) => { if (top <= pos) current = i; });
  navLinks.forEach((l, i) => l.classList.toggle("active", i === current));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
// ride.js makes the intro section tall after this file runs, so measure again once everything is set up
requestAnimationFrame(() => { measureSections(); onScroll(); });

function setMenu(open) {
  burger.classList.toggle("open", open);
  nav.classList.toggle("open", open);
  header.classList.toggle("menu-open", open);
  document.body.classList.toggle("menu-open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  if (open) header.classList.remove("hidden");
  if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
}
burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
navLinks.forEach((l) => l.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("open")) setMenu(false);
});

// ================= THEME TOGGLE =================
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("use");
function setTheme(theme) {
  if (theme !== "light") theme = "dark"; // only accept known values from storage
  document.documentElement.setAttribute("data-theme", theme);
  themeIcon.setAttribute("href", theme === "light" ? "#i-moon" : "#i-sun");
  themeToggle.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
  document.querySelector('meta[name="theme-color"]').setAttribute("content", theme === "light" ? "#f3f1fb" : "#05061a");
  try { localStorage.setItem("theme", theme); } catch (e) {}
}
let savedTheme = "dark";
try { savedTheme = localStorage.getItem("theme") || "dark"; } catch (e) {}
setTheme(savedTheme);
themeToggle.addEventListener("click", () => {
  setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
});

// ================= TYPING EFFECT =================
const typedEl = document.getElementById("typed");
const words = ["Laravel", "React", "Next.js", "TypeScript", "WordPress"];
let wordIndex = 0, charIndex = words[0].length, deleting = true;

function type() {
  const word = words[wordIndex];
  typedEl.textContent = word.slice(0, charIndex);

  if (deleting) {
    charIndex--;
    if (charIndex < 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      charIndex = 0;
    }
    setTimeout(type, 60);
  } else {
    charIndex++;
    if (charIndex > words[wordIndex].length) {
      deleting = true;
      charIndex = words[wordIndex].length;
      setTimeout(type, 1900);
      return;
    }
    setTimeout(type, 110);
  }
}
setTimeout(type, 2600);

// ================= MISC =================
document.getElementById("year").textContent = new Date().getFullYear();
