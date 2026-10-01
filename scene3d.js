// ================= 3D BACKGROUND (Three.js + GSAP ScrollTrigger) =================
// A fixed WebGL layer behind the page. Scrolling moves the camera down through a
// column of floating shapes (parallax) and spins them; the mouse adds a slight tilt.
//
// Performance: three.js (~120 KB gzipped) is NOT loaded with the page. It is fetched on
// the visitor's first interaction (move / scroll / touch / key), so it never delays the
// first paint. Devices without a real GPU skip the effect. Add ?3d to the URL to force it.
(() => {
  const canvas = document.getElementById("bg3d");
  if (!canvas) return;

  const THREE_SRC = "assets/vendor/three-r128.min.js";
  const force = new URLSearchParams(location.search).has("3d");
  const triggers = ["pointermove", "pointerdown", "wheel", "touchstart", "keydown", "scroll"];
  let requested = false;

  function load() {
    if (requested) return;
    requested = true;
    triggers.forEach((t) => window.removeEventListener(t, load));
    const s = document.createElement("script");
    s.src = THREE_SRC;
    s.async = true;
    s.onload = () => init(canvas, force);
    s.onerror = () => canvas.remove();
    document.head.appendChild(s);
  }
  triggers.forEach((t) => window.addEventListener(t, load, { passive: true }));
  if (force) load();
})();

function init(canvas, force) {
  if (typeof THREE === "undefined") return;

  const isSmall = () => window.innerWidth < 768;
  const small0 = isSmall();

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !small0, powerPreference: "high-performance" });
  } catch (e) {
    canvas.remove(); // no WebGL — the site works fine without it
    return;
  }

  // Software-rendered WebGL (no GPU) would make scrolling janky — skip the effect there
  const gl = renderer.getContext();
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
  if (!force && /swiftshader|llvmpipe|softpipe|software|microsoft basic render/i.test(gpu)) {
    renderer.dispose();
    canvas.remove();
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TRAVEL = 42; // how far (world units) the camera moves over the full page scroll

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small0 ? 1.25 : 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 14);
  scene.add(camera);

  // ---- Lights: mint + purple give the dark metal its gradient sheen. Attached to the camera so every shape is lit.
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const mintLight = new THREE.PointLight(0x7cf7d4, 2.2, 0);
  mintLight.position.set(-12, 7, 2);
  const purpleLight = new THREE.PointLight(0x6c63ff, 3.2, 0);
  purpleLight.position.set(12, -6, 0);
  const topLight = new THREE.DirectionalLight(0xffffff, 0.45);
  topLight.position.set(0, 10, 4);
  camera.add(mintLight, purpleLight, topLight);

  // ---- Materials
  const solidMats = [];
  const makeSolid = (smooth) => {
    const m = new THREE.MeshStandardMaterial({ color: 0x15171d, metalness: 0.7, roughness: 0.26, flatShading: !smooth });
    solidMats.push(m);
    return m;
  };
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x7cf7d4, transparent: true, opacity: 0.3 });
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x6c63ff, wireframe: true, transparent: true, opacity: 0.32 });

  // ---- Shapes. pos = desktop position; y goes down the page. small = hidden on phones.
  const knotDetail = small0 ? [110, 16] : [160, 24];
  const specs = [
    { hero: true, geo: new THREE.TorusKnotGeometry(1.5, 0.46, knotDetail[0], knotDetail[1]), pos: [5.6, 0.3, 0], spin: [0.5, 0.8], smooth: true },
    { geo: new THREE.IcosahedronGeometry(1.25, 0), pos: [-7.8, -8, -3], spin: [1.2, 0.8], edges: true },
    { geo: new THREE.OctahedronGeometry(1.05, 0), pos: [7.6, -15, -2], spin: [0.7, 1.6], edges: true },
    { geo: new THREE.TorusGeometry(1.1, 0.36, 16, 48), pos: [-7.2, -23, -1], spin: [1.4, 0.6], smooth: true },
    { geo: new THREE.DodecahedronGeometry(1.2, 0), pos: [7.2, -31, -3], spin: [0.9, 1.1], edges: true },
    { geo: new THREE.IcosahedronGeometry(1.9, 1), pos: [-6.6, -39.5, -4], spin: [0.5, 0.9], wire: true },
    { geo: new THREE.OctahedronGeometry(0.45, 0), pos: [-3.8, -4.5, 2], spin: [2, 1.5], edges: true, small: true },
    { geo: new THREE.TetrahedronGeometry(0.6, 0), pos: [3.6, -19.5, 2], spin: [1.8, 2.2], edges: true, small: true },
    { geo: new THREE.IcosahedronGeometry(0.5, 0), pos: [-3.4, -34, 2.5], spin: [1.6, 1.2], edges: true, small: true },
  ];

  const shapes = specs.map((s, i) => {
    const group = new THREE.Group();
    const mesh = s.wire ? new THREE.Mesh(s.geo, wireMat) : new THREE.Mesh(s.geo, makeSolid(s.smooth));
    if (s.edges) mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(s.geo), edgeMat));
    if (s.hero) {
      // faint wire shell around the hero knot
      const shell = new THREE.Mesh(new THREE.TorusKnotGeometry(1.5, 0.46, 80, 8), wireMat.clone());
      shell.material.opacity = 0.08;
      shell.scale.setScalar(1.04);
      mesh.add(shell);
    }
    group.add(mesh);
    scene.add(group);
    return {
      ...s,
      group,
      mesh,
      phase: i * 1.7,
      baseRot: { x: Math.random() * Math.PI, y: Math.random() * Math.PI },
      boost: 0,
    };
  });

  // ---- Floating particles along the whole scroll path
  const count = small0 ? 220 : 560;
  const pts = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pts[i * 3] = (Math.random() - 0.5) * 34;
    pts[i * 3 + 1] = 8 - Math.random() * (TRAVEL + 18);
    pts[i * 3 + 2] = (Math.random() - 0.5) * 16 - 3;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x7cf7d4, size: 0.05, transparent: true, opacity: 0.55, depthWrite: false });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ---- Theme: lighter metal in light mode
  function applyTheme() {
    const light = document.documentElement.getAttribute("data-theme") === "light";
    solidMats.forEach((m) => {
      m.color.set(light ? 0xe4e6ee : 0x15171d);
      m.metalness = light ? 0.35 : 0.7;
    });
    edgeMat.color.set(light ? 0x6c63ff : 0x7cf7d4);
    edgeMat.opacity = light ? 0.5 : 0.3;
    pMat.color.set(light ? 0x6c63ff : 0x7cf7d4);
  }
  applyTheme();
  new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // ---- Scroll state driven by GSAP ScrollTrigger (scrub = smooth catch-up)
  const state = { p: 0, hero: 0, vel: 0 };
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(state, {
      p: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 1.2, onUpdate: (self) => (state.vel = self.getVelocity()) },
    });
    gsap.to(state, {
      hero: 1,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.2 },
    });
  } else {
    const read = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      state.p = max > 0 ? window.scrollY / max : 0;
      state.hero = Math.min(window.scrollY / window.innerHeight, 1);
    };
    window.addEventListener("scroll", read, { passive: true });
    read();
  }

  // ---- Mouse parallax
  const mouse = { x: 0, y: 0 };
  const cam = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX / window.innerWidth - 0.5;
    mouse.y = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  // ---- Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  });

  // ---- Render loop (requestAnimationFrame pauses automatically in background tabs)
  const clock = new THREE.Clock();
  let t = 0;
  let spinBoost = 0;
  const lerp = (a, b, k) => a + (b - a) * k;

  function tick() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const motion = reduceMotion ? 0 : 1;
    t += dt * motion;

    const small = isSmall();
    const xScale = small ? 0.42 : 1;

    // Faster scrolling spins the shapes harder, then eases back
    spinBoost = lerp(spinBoost, Math.min(Math.abs(state.vel) / 1400, 3), 0.06) * motion;

    cam.x = lerp(cam.x, mouse.x * 1.4 * motion, 0.04);
    cam.y = lerp(cam.y, -mouse.y * 0.9 * motion, 0.04);
    const camY = -state.p * TRAVEL;
    camera.position.set(cam.x, camY + cam.y, 14);
    camera.lookAt(0, camY, 0);

    shapes.forEach((s) => {
      s.group.visible = !(small && s.small);
      if (!s.group.visible) return;

      let [x, y, z] = s.pos;
      let scale = 1;
      if (s.hero) {
        // Hero knot drifts back and up out of view as you leave the hero section
        const h = state.hero;
        x = small ? lerp(1.3, 3, h) : lerp(5.6, 8.5, h);
        y = small ? lerp(-2.8, 1, h) : lerp(0.3, 3, h);
        z = small ? lerp(-3, -9, h) : lerp(0, -7, h);
        scale = small ? 0.75 : 1;
      } else {
        // gentle sideways drift tied to scroll + idle bobbing
        x = x * xScale + Math.sin(state.p * Math.PI * 2 + s.phase) * 0.7 * xScale;
        y = y + Math.sin(t * 0.6 + s.phase) * 0.25;
        if (small) z -= 2;
      }
      s.group.position.set(x, y, z);
      s.group.scale.setScalar(scale);

      s.boost += dt * spinBoost;
      const turn = state.p * 7 + t * 0.18 + s.boost;
      s.mesh.rotation.x = s.baseRot.x + turn * s.spin[0];
      s.mesh.rotation.y = s.baseRot.y + turn * s.spin[1];
    });

    particles.rotation.y = state.p * 0.6 + t * 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
  canvas.classList.add("ready"); // fades the scene in (see style.css)
}
