// ================= GSAP + SCROLLTRIGGER ANIMATIONS =================
// Performance: the hero intro runs immediately; every scroll-based animation is set up
// afterwards in small chunks (one per task) so the main thread is never blocked for long.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const markUnderlines = () => document.querySelectorAll(".underline").forEach((u) => u.classList.add("is-in"));

  // No GSAP (e.g. a file failed to load) → leave everything visible
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    markUnderlines();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Run each setup step in its own task, yielding to the browser in between
  const idle = window.requestIdleCallback
    ? (fn) => window.requestIdleCallback(fn, { timeout: 400 })
    : (fn) => setTimeout(fn, 1);
  function runChunked(steps) {
    const next = () => {
      const step = steps.shift();
      if (!step) return;
      step();
      idle(next);
    };
    idle(next);
  }

  // ---------- Smooth scroll (Lenis) ----------
  let lenis = null;
  if (!reduceMotion && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  window.__lenis = lenis;

  // In-page links (#about, #work…) scroll smoothly
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = id.length > 1 && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.start();
        lenis.scrollTo(id === "#home" ? 0 : target, { duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      }
      history.replaceState(null, "", id);
    });
  });

  if (reduceMotion) {
    markUnderlines();
    gsap.set("#timelineProgress", { scaleY: 1 });
    document.querySelectorAll(".timeline-item").forEach((i) => i.classList.add("active"));
    gsap.to("#progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
    return;
  }

  // ---------- Hero intro (runs right away) ----------
  // The hero paragraph is the "largest contentful paint", so it is never hidden — it is
  // visible from the very first paint while the elements around it animate in.
  gsap.timeline({ defaults: { ease: "power4.out" } })
    .from(".header", { yPercent: -100, opacity: 0, duration: 0.9, clearProps: "transform,opacity" }, 0)
    .from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.7 }, 0.1)
    .from(".hero-name", { yPercent: 110, duration: 1.1 }, 0.15)
    .fromTo(".hero-name", { backgroundPosition: "0% 0" }, { backgroundPosition: "50% 0", duration: 2.4, ease: "power2.inOut" }, 0.4)
    .from(".hero-role", { yPercent: 110, duration: 1 }, 0.3)
    .from(".hero-actions .btn", { y: 24, opacity: 0, stagger: 0.1, duration: 0.8 }, 0.5)
    .from(".hero-cols p", { y: 20, opacity: 0, stagger: 0.12, duration: 0.8 }, 0.65)
    .from(".scroll-down", { opacity: 0, y: -10, duration: 0.8 }, 1);

  // ---------- Helpers ----------
  // Wrap every word in <span class="w"><span class="wi">word</span></span>, keeping inner elements
  function splitWords(el) {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(" "));
              return;
            }
            const w = document.createElement("span");
            w.className = "w";
            const wi = document.createElement("span");
            wi.className = "wi";
            wi.textContent = part;
            w.appendChild(wi);
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === Node.ELEMENT_NODE && n.tagName !== "BR") {
          walk(n);
        }
      });
    };
    walk(el);
    return el.querySelectorAll(".wi");
  }

  // ---------- Scroll-based animations, set up in chunks ----------
  runChunked([
    // Scroll progress bar + hero parallax
    () => {
      gsap.to("#progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
      gsap.to(".hero-content", {
        yPercent: -14,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".aurora", {
        yPercent: 35,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    },

    // Marquee: infinite, reacts to scroll speed + direction
    () => {
      const track = document.getElementById("marqueeTrack");
      if (!track) return;
      const clone = track.querySelector(".marquee-group").cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);

      const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
      loop.totalTime(loop.duration() * 500); // start far in so it can also run backwards

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 6);
          gsap.to(loop, {
            timeScale: self.direction * boost,
            duration: 0.25,
            overwrite: true,
            onComplete: () => gsap.to(loop, { timeScale: self.direction, duration: 1.2, overwrite: true }),
          });
        },
      });
    },

    // One-time reveals use a single IntersectionObserver instead of ~70 ScrollTriggers:
    // same look, but no layout recalculation for each of them on load/resize.
    () => {
      const reveals = gsap.utils.toArray("[data-reveal]");
      gsap.set(reveals, { opacity: 0, y: 40 });

      document.querySelectorAll("[data-split]").forEach((el) => {
        // Screen readers get the whole sentence instead of one span per word
        el.setAttribute("aria-label", el.textContent.trim().replace(/\s+/g, " "));
        gsap.set(splitWords(el), { yPercent: 115, rotate: 4 });
        el.querySelectorAll(".w").forEach((w) => w.setAttribute("aria-hidden", "true"));
      });
      gsap.set("#contactTitle", { yPercent: 30, opacity: 0, scale: 0.94 });

      const io = new IntersectionObserver(
        (entries) => {
          const batch = [];
          entries.forEach(({ isIntersecting, target: el }) => {
            if (!isIntersecting) return;
            io.unobserve(el);
            if (el.hasAttribute("data-reveal")) batch.push(el);
            else if (el.hasAttribute("data-split"))
              gsap.to(el.querySelectorAll(".wi"), { yPercent: 0, rotate: 0, duration: 1.1, ease: "power4.out", stagger: 0.06 });
            else if (el.classList.contains("underline")) el.classList.add("is-in");
            else if (el.id === "contactTitle")
              gsap.to(el, { yPercent: 0, opacity: 1, scale: 1, duration: 1.3, ease: "power4.out" });
          });
          if (batch.length)
            gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.08, overwrite: true });
        },
        { rootMargin: "0px 0px -10% 0px" } // ≈ "top 90%"
      );
      document.querySelectorAll("[data-reveal], [data-split], .underline, #contactTitle").forEach((el) => io.observe(el));
    },

    // Quote: words light up as you scroll
    () => {
      const quote = document.getElementById("quoteText");
      if (!quote) return;
      const text = quote.textContent.trim();
      quote.textContent = "";
      text.split(/\s+/).forEach((word, i) => {
        const s = document.createElement("span");
        s.className = "qw";
        s.textContent = word;
        if (i) quote.appendChild(document.createTextNode(" "));
        quote.appendChild(s);
      });
      gsap.fromTo(
        quote.querySelectorAll(".qw"),
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: quote, start: "top 80%", end: "bottom 45%", scrub: true },
        }
      );
    },

    // Experience timeline: line draws with scroll (scrubbed), dots light up as it reaches them
    () => {
      gsap.to("#timelineProgress", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: "#timeline", start: "top 65%", end: "bottom 65%", scrub: true },
      });
      const dots = new IntersectionObserver(
        (entries) =>
          entries.forEach(({ target, isIntersecting, boundingClientRect }) =>
            // active once the item's top has passed 65% of the viewport (and stays active below it)
            target.classList.toggle("active", isIntersecting || boundingClientRect.top < 0)
          ),
        { rootMargin: "0px 0px -35% 0px" }
      );
      document.querySelectorAll(".timeline-item").forEach((item) => dots.observe(item));
    },
  ]);
  // (ScrollTrigger recalculates positions on its own after the page "load" event.)
})();
