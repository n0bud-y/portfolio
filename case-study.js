// ================= CASE STUDY PAGES =================
// Shared by /projects/*.html. Works without GSAP (everything simply stays visible).
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---------- Theme (same storage key as the home page) ----------
  const themeToggle = $("#themeToggle");
  const themeIcon = themeToggle && themeToggle.querySelector("use");
  function setTheme(theme) {
    if (theme !== "light") theme = "dark";
    document.documentElement.setAttribute("data-theme", theme);
    if (themeIcon) themeIcon.setAttribute("href", theme === "light" ? "#i-moon" : "#i-sun");
    if (themeToggle) themeToggle.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f3f1fb" : "#05061a");
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }
  let saved = "dark";
  try { saved = localStorage.getItem("theme") || "dark"; } catch (e) {}
  setTheme(saved);
  themeToggle && themeToggle.addEventListener("click", () =>
    setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light"));

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Header, menu, back-to-top, active nav ----------
  const header = $("#header"), nav = $("#nav"), burger = $("#burger"), backTop = $("#backTop");
  const navLinks = $$(".nav-link");
  const targets = navLinks.map((l) => $(l.getAttribute("href")));
  let lastY = window.scrollY;
  function onScroll() {
    const y = window.scrollY;
    const open = nav && nav.classList.contains("open");
    header.classList.toggle("scrolled", y > 40);
    if (!open) header.classList.toggle("hidden", y > lastY && y > 300);
    backTop && backTop.classList.toggle("show", y > 700);
    lastY = y;
    const pos = y + window.innerHeight / 3;
    let current = -1;
    targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top + y <= pos) current = i; });
    navLinks.forEach((l, i) => l.classList.toggle("active", i === current));
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  let lenis = null;
  function setMenu(open) {
    burger.classList.toggle("open", open);
    nav.classList.toggle("open", open);
    header.classList.toggle("menu-open", open);
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) header.classList.remove("hidden");
    if (lenis) open ? lenis.stop() : lenis.start();
  }
  burger && burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  navLinks.forEach((l) => l.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) setMenu(false); });

  // ---------- Admin console tabs (click + arrow keys) ----------
  const tabs = $$(".ctab");
  function selectTab(tab, focus) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) { panel.hidden = !on; panel.classList.toggle("active", on); }
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t));
    t.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      selectTab(tabs[(i + d + tabs.length) % tabs.length], true);
    });
  });

  // ---------- Lightbox ----------
  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
  function openLightbox(src, alt) {
    if (!lb || typeof lb.showModal !== "function") { window.open(src, "_blank", "noopener"); return; }
    lbImg.src = src;
    lbImg.alt = alt || "";
    lbCap.textContent = alt || "";
    lb.showModal();
    if (lenis) lenis.stop();
  }
  if (lb) {
    lb.addEventListener("close", () => { if (lenis) lenis.start(); lbImg.src = "data:,"; });
    lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); }); // backdrop
    $("#lbClose").addEventListener("click", () => lb.close());
  }
  $$("img.zoomable").forEach((img) => {
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", "Enlarge: " + img.alt);
    const go = () => openLightbox(img.currentSrc || img.src, img.alt);
    img.addEventListener("click", go);
    img.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });
  $$(".zoom-trigger").forEach((b) => b.addEventListener("click", () => openLightbox(b.dataset.src, b.dataset.alt)));

  // ---------- Home page preview: plays once when it comes into view ----------
  const scroller = $("#scroller");
  if (scroller && !reduceMotion) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        sio.disconnect();
        setTimeout(() => scroller.classList.add("is-playing"), 600);
        setTimeout(() => scroller.classList.remove("is-playing"), 13500);
      });
    }, { threshold: 0.6 });
    sio.observe(scroller);
  }

  // ---------- 3D tilt on the hero devices ----------
  const devices = $("#devices");
  if (devices && fineHover && !reduceMotion) {
    const hero = devices.closest(".cs-hero") || document.body;
    hero.addEventListener("pointermove", (e) => {
      const r = devices.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const py = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      devices.style.setProperty("--ry", `${(px * 14).toFixed(2)}deg`);
      devices.style.setProperty("--rx", `${(-py * 10).toFixed(2)}deg`);
    });
    hero.addEventListener("pointerleave", () => {
      devices.style.setProperty("--ry", "0deg");
      devices.style.setProperty("--rx", "0deg");
    });
  }

  // Count-up numbers (text is already correct without JS)
  function countUp(el) {
    const end = Number(el.dataset.count);
    if (!end || reduceMotion) return;
    const t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Flow steps light up as you reach them (works with or without GSAP)
  const steps = $$(".flow-step");
  const stepIO = new IntersectionObserver(
    (entries) => entries.forEach(({ target, isIntersecting, boundingClientRect }) =>
      target.classList.toggle("is-on", isIntersecting || boundingClientRect.top < 0)),
    { rootMargin: "0px 0px -45% 0px" }
  );
  steps.forEach((s) => stepIO.observe(s));

  if (!hasGsap) {
    $$("[data-count]").forEach(countUp);
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // ---------- Smooth scroll ----------
  if (!reduceMotion && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = id.length > 1 && $(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -20, duration: 1.4 });
      else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    });
  });

  gsap.to("#progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: reduceMotion ? true : 0.3 } });

  if (reduceMotion) {
    gsap.set("#flowFill", { scaleY: 1 });
    return;
  }

  // ---------- Hero intro ----------
  gsap.timeline({ defaults: { ease: "power4.out" } })
    .from(".header", { yPercent: -100, opacity: 0, duration: 0.9, clearProps: "transform,opacity" }, 0)
    .from("[data-hero]", { y: 30, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.1)
    // animate the whole group (its children keep their CSS depth); clearProps hands transform back to the tilt
    .from("#devices", { y: 70, opacity: 0, duration: 1.3, clearProps: "transform,opacity" }, 0.25);

  // ---------- Reveals ----------
  const reveals = $$("[data-reveal]");
  gsap.set(reveals, { opacity: 0, y: 40 });
  const io = new IntersectionObserver((entries) => {
    const batch = [];
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      io.unobserve(target);
      batch.push(target);
      $$("[data-count]", target).forEach(countUp);
    });
    if (batch.length) gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.08, overwrite: true });
  }, { rootMargin: "0px 0px -10% 0px" });
  reveals.forEach((el) => io.observe(el));

  // ---------- Flow line fills with scroll ----------
  if ($("#flowList")) gsap.to("#flowFill", {
    scaleY: 1,
    ease: "none",
    scrollTrigger: { trigger: "#flowList", start: "top 55%", end: "bottom 55%", scrub: true },
  });

  // Gentle parallax on the phone trio
  if ($(".phones")) gsap.to(".phones .phone:not(.up)", { y: -24, ease: "none", scrollTrigger: { trigger: ".phones", start: "top bottom", end: "bottom top", scrub: true } });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
