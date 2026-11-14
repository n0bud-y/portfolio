// ================= THE RIDE (scroll → progress → chapters + HUD) =================
// The #ride section is tall (one screen per chapter). Its stage is sticky, so while you scroll
// through it the page "stands still" and this file turns the scroll position into progress:
//   p      0 → 1 over the whole ride
//   intro  0 → 1 during the hero (camera swoops from the overview down onto the track)
//   u      0 → 1 along the 3D track (scene3d.js flies the camera there)
//   after  0 → 1 during the first screen after the ride (scene settles back to the overview)
// It also owns the track shape (shared with scene3d.js) and draws the route minimap from it.
// No JS / reduced motion → the ride never goes "live" and the chapters stack as normal sections.
(() => {
  // Track control points [x, y, z]: a winding road heading into the distance (-z).
  const POINTS = [
    [0, 0, 0], [5, 0.6, -16], [-3, 1.6, -32], [-11, 0.4, -46], [-4, -0.6, -62],
    [8, 0.8, -76], [12, 2, -92], [3, 1, -108], [-6, 0, -122], [-2, 0, -136],
  ];

  // ---- Catmull-Rom (tension 0.5, same as THREE.CatmullRomCurve3 "catmullrom") + arc-length table
  const cr = (p0, p1, p2, p3, t) => {
    const t2 = t * t, t3 = t2 * t;
    return p1.map((_, k) =>
      0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)
    );
  };
  const SAMPLES = 480;
  const samples = [];
  const n = POINTS.length - 1;
  for (let i = 0; i <= SAMPLES; i++) {
    const f = (i / SAMPLES) * n;
    const s = Math.min(Math.floor(f), n - 1);
    const t = f - s;
    const P = (j) => POINTS[Math.max(0, Math.min(n, j))];
    samples.push(cr(P(s - 1), P(s), P(s + 1), P(s + 2), t));
  }
  const cum = [0];
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1], b = samples[i];
    cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]));
  }
  const total = cum[cum.length - 1];
  // index into samples for an arc-length fraction u (0–1)
  const indexAt = (u) => {
    const target = u * total;
    let lo = 0, hi = cum.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < target) lo = mid + 1; else hi = mid;
    }
    return lo;
  };

  const ride = document.getElementById("ride");
  const stops = ride ? [...ride.querySelectorAll(".stop")] : [];
  const S = stops.length || 7; // chapters incl. the hero
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // Gate i (1…S-1) sits just before the end of chapter i, so you fly through it as the next one opens
  const gates = [];
  for (let i = 1; i < S; i++) gates.push(clamp((i - 0.12) / (S - 1), 0, 1));

  const state = { p: 0, intro: 0, u: 0, after: 0, chapter: 0, live: false };
  window.RIDE = { points: POINTS, gates, labels: stops.map((s) => s.dataset.label || ""), state };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!ride || reduceMotion) return;

  state.live = true;
  ride.style.setProperty("--segs", S);
  ride.classList.add("is-live");

  // ---- Minimap: the track seen from above, drawn left → right
  const svgNS = "http://www.w3.org/2000/svg";
  const trackPath = document.getElementById("mapTrack");
  const trailPath = document.getElementById("mapTrail");
  const dot = document.getElementById("mapDot");
  const stopsG = document.getElementById("mapStops");
  const hud = ride.querySelector(".ride-hud");
  const hudNum = document.getElementById("hudNum");
  const hudLabel = document.getElementById("hudLabel");

  const xs = samples.map((p) => -p[2]);
  const ys = samples.map((p) => p[0]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const map = samples.map((_, i) => [
    8 + ((xs[i] - minX) / (maxX - minX)) * 184,
    10 + ((ys[i] - minY) / (maxY - minY)) * 90,
  ]);
  const map2d = [0];
  for (let i = 1; i < map.length; i++) map2d.push(map2d[i - 1] + Math.hypot(map[i][0] - map[i - 1][0], map[i][1] - map[i - 1][1]));
  const mapLen = map2d[map2d.length - 1];
  const d = map.map((pt, i) => `${i ? "L" : "M"}${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`).join("");
  if (trackPath) {
    trackPath.setAttribute("d", d);
    trailPath.setAttribute("d", d);
    trailPath.setAttribute("stroke-dasharray", `${mapLen} ${mapLen}`);
    gates.forEach((g) => {
      const c = document.createElementNS(svgNS, "circle");
      const pt = map[indexAt(g)];
      c.setAttribute("cx", pt[0].toFixed(1));
      c.setAttribute("cy", pt[1].toFixed(1));
      c.setAttribute("r", "3.2");
      c.setAttribute("class", "map-stop");
      stopsG.appendChild(c);
    });
  }
  const mapStops = stopsG ? [...stopsG.children] : [];

  // ---- Scroll → state
  let top = 0, dist = 1;
  function measure() {
    top = ride.getBoundingClientRect().top + window.scrollY;
    dist = Math.max(1, ride.offsetHeight - window.innerHeight);
  }

  let lastChapter = -1;
  function update() {
    const y = window.scrollY;
    const p = clamp((y - top) / dist, 0, 1);
    const x = p * S;
    state.p = p;
    state.intro = clamp(x, 0, 1);
    state.u = clamp((x - 1) / (S - 1), 0, 1);
    state.after = clamp((y - (top + dist)) / window.innerHeight, 0, 1);

    const chapter = Math.min(S - 1, Math.floor(x));
    state.chapter = chapter;
    if (chapter !== lastChapter) {
      stops.forEach((s, i) => {
        s.classList.toggle("is-active", i === chapter);
        s.classList.toggle("is-past", i < chapter);
        s.setAttribute("aria-hidden", i === chapter ? "false" : "true");
        if ("inert" in s) s.inert = i !== chapter;
      });
      if (hudNum) hudNum.textContent = String(chapter).padStart(2, "0");
      if (hudLabel) hudLabel.textContent = stops[chapter].dataset.label || "";
      lastChapter = chapter;
    }

    if (trackPath) {
      const i = indexAt(state.u);
      trailPath.setAttribute("stroke-dashoffset", (mapLen - map2d[i]).toFixed(1));
      dot.setAttribute("cx", map[i][0].toFixed(1));
      dot.setAttribute("cy", map[i][1].toFixed(1));
      mapStops.forEach((c, k) => c.classList.toggle("done", state.u >= gates[k] - 0.002));
    }
    hud && hud.classList.toggle("is-moving", p > 0.015);
    document.body.classList.toggle("past-ride", y > top + dist + window.innerHeight * 0.25);
  }

  // Chapters outside the visible one must not be reachable by keyboard
  stops.forEach((s, i) => { if (i) { s.setAttribute("aria-hidden", "true"); if ("inert" in s) s.inert = true; } });

  measure();
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", () => { measure(); update(); });
  window.addEventListener("load", () => { measure(); update(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); update(); });
  window.RIDE.refresh = () => { measure(); update(); };
})();
