// ================= PROJECT DATA =================
// category: "business" | "corporate" | "ecommerce"
// image: path to a real screenshot, e.g. "images/hanks.jpg" (leave "" to show the gradient placeholder)
// link:  verified live URL (leave "" to hide the "Show project" button)
const projects = [
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
    title: "AmericaPort",
    type: "Corporate / Business Website",
    category: "corporate",
    stack: ["WordPress", "Custom Theme", "CMS", "Frontend Development"],
    desc: "Corporate-style website focused on structured content, brand presentation, responsive layout, and professional UX.",
    icon: "anchor",
    image: "",
    link: "",
  },
  {
    title: "Polygon PT",
    type: "Business / Professional Website",
    category: "business",
    stack: ["WordPress", "Custom Theme", "Frontend Development"],
    desc: "Professionally structured website focused on strong layout composition, responsive behavior, and polished frontend presentation.",
    icon: "dumbbell",
    image: "",
    link: "",
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

// Placeholder backgrounds (used until real screenshots are added)
const gradients = [
  "linear-gradient(135deg, #6c63ff, #1b1d3a, #7cf7d4)",
  "linear-gradient(135deg, #1b3a33, #7cf7d4, #6c63ff)",
  "linear-gradient(135deg, #14161a, #6c63ff, #b18cff)",
  "linear-gradient(135deg, #7cf7d4, #6c63ff, #14161a)",
  "linear-gradient(135deg, #2a2466, #14161a, #7cf7d4)",
  "linear-gradient(135deg, #6c63ff, #7cf7d4, #2a2466)",
];

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const hasGsap = typeof gsap !== "undefined";

// ================= RENDER PROJECTS =================
// All project text is escaped before it goes into HTML, and links must be https://,
// so a typo (or data from a CMS later) can never inject markup or a javascript: URL.
const esc = (v) =>
  String(v).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
const safeUrl = (u) => (/^https:\/\//i.test(u) ? u : "");
const safeImg = (u) => (/^(https:\/\/|\/|\.\/|[\w-]+\/)[\w\-./%]+$/i.test(u) ? u : "");

const grid = document.getElementById("workGrid");
grid.innerHTML = projects
  .map((p, i) => {
    const num = String(i + 1).padStart(2, "0");
    const link = safeUrl(p.link);
    const img = safeImg(p.image);
    const visual = img
      ? `<img src="${esc(img)}" alt="${esc(p.title)} website screenshot" loading="lazy" decoding="async" width="1280" height="800" />`
      : `<div class="art" data-gradient="${i % gradients.length}"><svg class="icon" aria-hidden="true"><use href="#i-${esc(p.icon)}"></use></svg></div>`;
    const overlay = link
      ? `<div class="overlay"><a href="${esc(link)}" target="_blank" rel="noopener noreferrer" class="show-project">Show project<span class="sr-only"> ${esc(p.title)} (opens in a new tab)</span></a></div>`
      : "";
    return `
    <article class="project spotlight tilt" data-category="${esc(p.category)}" data-reveal ${link ? 'data-cursor="View"' : ""}>
      <div class="project-image">
        <span class="num" aria-hidden="true">${num}</span>
        ${visual}
        ${overlay}
      </div>
      <div class="project-details">
        <span class="project-category">${esc(p.type)}</span>
        <h3 class="project-title">${esc(p.title)}</h3>
        <p class="project-desc">${esc(p.desc)}</p>
        <ul class="tags">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      </div>
    </article>`;
  })
  .join("");

// Set placeholder gradients from JS (the Content-Security-Policy blocks inline style="" attributes)
grid.querySelectorAll(".art[data-gradient]").forEach((el) => {
  el.style.background = gradients[Number(el.dataset.gradient)];
});

// ================= FILTERS =================
const filters = document.querySelectorAll(".filter");
filters.forEach((btn) => {
  const f = btn.dataset.filter;
  const count = f === "all" ? projects.length : projects.filter((p) => p.category === f).length;
  btn.querySelector(".count").textContent = count;
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
}
measureSections();
window.addEventListener("resize", measureSections);
window.addEventListener("load", measureSections);

function onScroll() {
  const y = window.scrollY;
  const menuOpen = nav.classList.contains("open");

  header.classList.toggle("scrolled", y > 40);
  // Hide header while scrolling down, show it again when scrolling up
  if (!menuOpen) header.classList.toggle("hidden", y > lastY && y > 300);
  backTop.classList.toggle("show", y > 700);
  lastY = y;

  // Highlight the nav link for the section in view
  const pos = y + window.innerHeight / 3;
  let current = 0;
  sectionTops.forEach((top, i) => { if (top <= pos) current = i; });
  navLinks.forEach((l, i) => l.classList.toggle("active", i === current));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

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
  document.querySelector('meta[name="theme-color"]').setAttribute("content", theme === "light" ? "#f7f8fa" : "#090a0c");
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
const words = ["WordPress", "WooCommerce", "React", "Next.js"];
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

// ================= HOVER EFFECTS (desktop only) =================
if (canHover) {
  // Spotlight glow + gradient border that follows the cursor
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest(".spotlight");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });

  if (hasGsap) {
    // 3D tilt on project cards
    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotateY: px * 10, rotateX: -py * 10, y: -8, transformPerspective: 1000, duration: 0.6, ease: "power3.out" });
      });
      card.addEventListener("pointerleave", () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.9, ease: "power3.out" });
      });
    });

    // Magnetic buttons
    document.querySelectorAll(".magnetic").forEach((el) => {
      const strength = el.classList.contains("btn") ? 0.25 : 0.4;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - (r.left + r.width / 2)) * strength,
          y: (e.clientY - (r.top + r.height / 2)) * strength,
          duration: 0.4,
          ease: "power3.out",
        });
      });
      el.addEventListener("pointerleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
      });
    });

    // Custom cursor: dot follows instantly, ring trails behind
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    const label = document.getElementById("cursorLabel");
    const dotX = gsap.quickTo(dot, "x", { duration: 0.1 });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1 });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    window.addEventListener("pointermove", (e) => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.3, overwrite: "auto" });
      dotX(e.clientX); dotY(e.clientY);
      ringX(e.clientX); ringY(e.clientY);
    });
    document.addEventListener("mouseleave", () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 }));
    document.addEventListener("mouseover", (e) => {
      const labelled = e.target.closest("[data-cursor]");
      ring.classList.toggle("is-label", !!labelled);
      label.textContent = labelled ? labelled.dataset.cursor : "";
      ring.classList.toggle("is-hover", !labelled && !!e.target.closest("a, button, .tags li, .spotlight"));
    });
  }
}

// ================= MISC =================
document.getElementById("year").textContent = new Date().getFullYear();
