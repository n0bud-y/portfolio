// ================= GSAP + SCROLLTRIGGER + LENIS =================
// Smooth scrolling, the hero intro, scroll reveals, the outline marquee and the experience
// timeline. The 3D ride itself is driven by ride.js + scene3d.js.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return; // everything stays visible
  gsap.registerPlugin(ScrollTrigger);

  // ---------- Smooth scroll (Lenis) ----------
  let lenis = null;
  if (!reduceMotion && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  window.__lenis = lenis;

  // In-page links (#about, #projects…) scroll smoothly, flying through the ride if needed
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = id.length > 1 && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.start();
        lenis.scrollTo(id === "#home" ? 0 : target, { duration: 1.8 });
      } else {
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      }
      history.replaceState(null, "", id);
    });
  });

  gsap.to("#progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: reduceMotion ? true : 0.3 } });

  if (reduceMotion) {
    gsap.set("#timelineProgress", { scaleY: 1 });
    document.querySelectorAll(".timeline-item").forEach((i) => i.classList.add("active"));
    return;
  }

  // ---------- Hero intro ----------
  // (.hero-sub is the largest text block, so it is never hidden: it paints immediately)
  gsap.timeline({ defaults: { ease: "power4.out" } })
    .from(".header", { yPercent: -100, opacity: 0, duration: 0.9, clearProps: "transform,opacity" }, 0)
    .from(".stop-hero .kicker", { y: 20, opacity: 0, duration: 0.8 }, 0.15)
    .from(".hero-line", { yPercent: 60, opacity: 0, duration: 1.1, stagger: 0.12 }, 0.2)
    .from(".hero-role, .hero-actions .btn", { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.5)
    .from(".ride-hud", { opacity: 0, duration: 1.2 }, 0.9);

  // ---------- One-time reveals (single IntersectionObserver) ----------
  const reveals = gsap.utils.toArray("[data-reveal]");
  gsap.set(reveals, { opacity: 0, y: 40 });
  gsap.set("#contactTitle", { opacity: 0, y: 70 });
  const io = new IntersectionObserver(
    (entries) => {
      const batch = [];
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        io.unobserve(target);
        if (target.id === "contactTitle") gsap.to(target, { opacity: 1, y: 0, duration: 1.3, ease: "power4.out" });
        else batch.push(target);
      });
      if (batch.length) gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.08, overwrite: true });
    },
    { rootMargin: "0px 0px -10% 0px" }
  );
  reveals.forEach((el) => io.observe(el));
  const ct = document.getElementById("contactTitle");
  if (ct) io.observe(ct);

  // ---------- Outline marquee: infinite, speeds up with scroll velocity ----------
  const mTrack = document.getElementById("marqueeTrack");
  if (mTrack) {
    const clone = mTrack.querySelector(".marquee-group").cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    mTrack.appendChild(clone);
    const loop = gsap.to(mTrack, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
    loop.totalTime(loop.duration() * 500);
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 450, 5);
        gsap.to(loop, {
          timeScale: self.direction * boost,
          duration: 0.25,
          overwrite: true,
          onComplete: () => gsap.to(loop, { timeScale: self.direction, duration: 1.2, overwrite: true }),
        });
      },
    });
  }

  // ---------- Experience timeline: line draws with scroll, dots light up as it reaches them ----------
  gsap.to("#timelineProgress", {
    scaleY: 1,
    ease: "none",
    scrollTrigger: { trigger: "#timeline", start: "top 65%", end: "bottom 65%", scrub: true },
  });
  const dots = new IntersectionObserver(
    (entries) =>
      entries.forEach(({ target, isIntersecting, boundingClientRect }) =>
        // active once the item has passed 65% of the viewport (and it stays active below that)
        target.classList.toggle("active", isIntersecting || boundingClientRect.top < 0)
      ),
    { rootMargin: "0px 0px -35% 0px" }
  );
  document.querySelectorAll(".timeline-item").forEach((item) => dots.observe(item));

  // Layout changes (fonts, images) → keep the ride measurements in sync
  ScrollTrigger.addEventListener("refresh", () => window.RIDE && window.RIDE.refresh && window.RIDE.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
