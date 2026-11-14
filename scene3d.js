// ================= 3D WORLD (Three.js) =================
// A fixed WebGL layer behind the page: a glowing track through space with a numbered gate for
// every chapter of the ride. ride.js turns scrolling into progress; this file flies the camera:
//   hero        → overview of the track with the floating </> mark
//   the ride    → camera rides the track and passes through one gate per chapter
//   after ride  → camera rises to a calm overview behind the rest of the page (canvas dimmed by CSS)
//
// Performance: three.js is not part of the first paint. It loads when the page is idle or on the
// first interaction. Devices without a real GPU skip the effect (add ?3d to the URL to force it).
(() => {
  const canvas = document.getElementById("bg3d");
  if (!canvas || !window.RIDE) return;

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
    s.onload = () => initWorld(canvas, force);
    s.onerror = () => canvas.remove();
    document.head.appendChild(s);
  }
  triggers.forEach((t) => window.addEventListener(t, load, { passive: true }));
  const idle = () => (window.requestIdleCallback ? window.requestIdleCallback(load, { timeout: 1500 }) : setTimeout(load, 600));
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle);
})();

function initWorld(canvas, force) {
  if (typeof THREE === "undefined") return;
  const R = window.RIDE;
  const isSmall = () => window.innerWidth < 768;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isSmall(), powerPreference: "high-performance" });
  } catch (e) {
    canvas.remove(); // no WebGL: the CSS sky behind it still looks fine
    return;
  }
  const gl = renderer.getContext();
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
  if (!force && /swiftshader|llvmpipe|softpipe|software|microsoft basic render/i.test(gpu)) {
    renderer.dispose();
    canvas.remove();
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall() ? 1.25 : 1.6));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x05061a, 24, 150);
  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 500);

  const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
  const UP = new THREE.Vector3(0, 1, 0);
  const curve = new THREE.CatmullRomCurve3(R.points.map(V), false, "catmullrom", 0.5);
  curve.arcLengthDivisions = 2000;
  const RIDE_H = 0.95; // camera height above the track

  // ---- Small canvas textures: soft dot (stars / glow) and gate labels
  function dotTexture(inner, outer) {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, inner);
    grd.addColorStop(0.35, outer);
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const starTex = dotTexture("rgba(255,255,255,1)", "rgba(255,255,255,0.35)");
  const glowTex = dotTexture("rgba(216,180,254,0.9)", "rgba(168,85,247,0.35)");

  // ---- Palettes
  const PAL = {
    dark: { fog: 0x05061a, core: 0xf3e8ff, halo: 0xa855f7, road: 0x7c3aed, edge: 0xc084fc, tick: 0xe9d5ff, ring: 0xf5f3ff, ringGlow: 0xa855f7, deco: 0xc4b5fd, star: 0xeee9ff, grid: 0x5b21b6, mark: 0xf5f3ff, markEm: 0x3b0764, label: "#f4f2ff", labelSub: "#c084fc", additive: true },
    light: { fog: 0xf3f1fb, core: 0x6d28d9, halo: 0xa855f7, road: 0x8b5cf6, edge: 0x7c3aed, tick: 0x6d28d9, ring: 0x5b21b6, ringGlow: 0xc084fc, deco: 0x8b5cf6, star: 0x7c6bc4, grid: 0xc4b5fd, mark: 0x2e1065, markEm: 0x000000, label: "#17142f", labelSub: "#7e22ce", additive: false },
  };

  // ---- Track: bright core line + soft halo + translucent road + edge rails + speed ticks
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 700, 0.05, 6, false), coreMat));
  const haloMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, depthWrite: false });
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 350, 0.26, 8, false), haloMat));

  const N = 700, W = 1.6;
  const roadPos = new Float32Array((N + 1) * 6);
  const leftPts = [], rightPts = [];
  const tmpSide = new THREE.Vector3();
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const P = curve.getPointAt(u);
    const T = curve.getTangentAt(u);
    tmpSide.crossVectors(T, UP).normalize();
    const L = P.clone().addScaledVector(tmpSide, -W);
    const Rr = P.clone().addScaledVector(tmpSide, W);
    L.y -= 0.04; Rr.y -= 0.04;
    roadPos.set([L.x, L.y, L.z, Rr.x, Rr.y, Rr.z], i * 6);
    leftPts.push(L); rightPts.push(Rr);
  }
  const roadIdx = [];
  for (let i = 0; i < N; i++) {
    const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
    roadIdx.push(a, b, c, b, d, c);
  }
  const roadGeo = new THREE.BufferGeometry();
  roadGeo.setAttribute("position", new THREE.BufferAttribute(roadPos, 3));
  roadGeo.setIndex(roadIdx);
  const roadMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false });
  scene.add(new THREE.Mesh(roadGeo, roadMat));
  const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 });
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(leftPts), edgeMat));
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rightPts), edgeMat));

  const tickCount = Math.floor(curve.getLength() / 1.7);
  const tickMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16, depthWrite: false });
  const ticks = new THREE.InstancedMesh(new THREE.BoxGeometry(W * 1.7, 0.012, 0.06), tickMat, tickCount);
  const dummy = new THREE.Object3D();
  for (let k = 0; k < tickCount; k++) {
    const u = (k + 0.5) / tickCount;
    const P = curve.getPointAt(u);
    dummy.position.copy(P).setY(P.y - 0.03);
    dummy.lookAt(P.clone().add(curve.getTangentAt(u)));
    dummy.updateMatrix();
    ticks.setMatrixAt(k, dummy.matrix);
  }
  scene.add(ticks);

  // ---- Gates: one neon ring per chapter, with a floating label
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const ringRadius = 2.3;
  const ringGeo = new THREE.TorusGeometry(ringRadius, 0.045, 10, 140);
  const ringGlowGeo = new THREE.TorusGeometry(ringRadius, 0.17, 10, 140);
  const outerGeo = new THREE.TorusGeometry(ringRadius + 0.45, 0.012, 6, 140);

  function labelTexture(num, text, pal) {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 128;
    const g = c.getContext("2d");
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = pal.label;
    g.font = "700 64px 'Space Grotesk', system-ui, sans-serif";
    g.fillText(num, 256, 46);
    g.fillStyle = pal.labelSub;
    g.font = "600 26px 'Space Grotesk', system-ui, sans-serif";
    g.fillText(text.toUpperCase().split("").join(String.fromCharCode(8202)), 256, 104);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    return t;
  }

  const gates = R.gates.map((u, i) => {
    const group = new THREE.Group();
    const P = curve.getPointAt(u);
    group.position.copy(P).add(new THREE.Vector3(0, RIDE_H, 0));
    group.lookAt(group.position.clone().add(curve.getTangentAt(u)));
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, depthWrite: false });
    const outerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, depthWrite: false });
    group.add(new THREE.Mesh(ringGeo, ringMat), new THREE.Mesh(ringGlowGeo, glowMat), new THREE.Mesh(outerGeo, outerMat));
    const spriteMat = new THREE.SpriteMaterial({ transparent: true, depthWrite: false });
    const label = new THREE.Sprite(spriteMat);
    label.scale.set(3.6, 0.9, 1);
    label.position.set(0, ringRadius + 1.1, 0);
    group.add(label);
    scene.add(group);
    return { u, group, glowMat, outerMat, spriteMat, num: String(i + 1).padStart(2, "0"), text: R.labels[i + 1] || "" };
  });

  // ---- Decorative rings drifting beside the track
  const decoMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, depthWrite: false });
  const decos = [];
  for (let k = 0; k < 18; k++) {
    const u = (k + Math.random() * 0.8) / 18;
    const P = curve.getPointAt(u);
    tmpSide.crossVectors(curve.getTangentAt(u), UP).normalize();
    const off = (k % 2 ? 1 : -1) * (4.5 + Math.random() * 7);
    const m = new THREE.Mesh(new THREE.TorusGeometry(0.5 + Math.random() * 1.2, 0.022, 6, 64), decoMat);
    m.position.copy(P).addScaledVector(tmpSide, off).add(new THREE.Vector3(0, -0.5 + Math.random() * 5, 0));
    m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    m.userData.spin = (Math.random() - 0.5) * 0.6;
    scene.add(m);
    decos.push(m);
  }

  // ---- Stars
  const starCount = isSmall() ? 900 : 2200;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 280;
    starPos[i * 3 + 1] = Math.random() * 100 - 12;
    starPos[i * 3 + 2] = 50 - Math.random() * 280;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ size: 0.42, map: starTex, transparent: true, opacity: 0.9, depthWrite: false, color: 0xffffff });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // ---- Grid floor
  const gridPts = [];
  const GY = -7, GX = 210, GZ0 = 60, GZ1 = -380, STEP = 4;
  for (let x = -GX; x <= GX; x += STEP) gridPts.push(new THREE.Vector3(x, GY, GZ0), new THREE.Vector3(x, GY, GZ1));
  for (let z = GZ0; z >= GZ1; z -= STEP) gridPts.push(new THREE.Vector3(-GX, GY, z), new THREE.Vector3(GX, GY, z));
  const gridMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, depthWrite: false });
  scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(gridPts), gridMat));

  // ---- The </> mark (brand) floating above the start of the track
  const markMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.28, metalness: 0.15, emissiveIntensity: 0.55 });
  const mark = new THREE.Group();
  const r = 0.17;
  const capGeo = new THREE.SphereGeometry(r, 18, 14);
  function bar(a, b) {
    const A = new THREE.Vector3(a[0], a[1], 0), B = new THREE.Vector3(b[0], b[1], 0);
    const dir = B.clone().sub(A);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, dir.length(), 18), markMat);
    m.position.copy(A).add(B).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(UP, dir.normalize());
    const c1 = new THREE.Mesh(capGeo, markMat); c1.position.copy(A);
    const c2 = new THREE.Mesh(capGeo, markMat); c2.position.copy(B);
    mark.add(m, c1, c2);
  }
  bar([-1.0, 1.0], [-2.1, 0]); bar([-2.1, 0], [-1.0, -1.0]);
  bar([0.45, 1.35], [-0.45, -1.35]);
  bar([1.0, 1.0], [2.1, 0]); bar([2.1, 0], [1.0, -1.0]);
  const markGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  markGlow.scale.set(9, 9, 1);
  markGlow.position.z = -0.8;
  mark.add(markGlow);
  const MARK_POS = new THREE.Vector3(6.5, 4.4, -9);
  mark.position.copy(MARK_POS);
  mark.scale.setScalar(1.25);
  scene.add(mark);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const sun = new THREE.DirectionalLight(0xffffff, 0.8);
  sun.position.set(5, 10, 8);
  scene.add(sun);
  const violet = new THREE.PointLight(0xa855f7, 2.2, 26);
  violet.position.copy(MARK_POS).add(new THREE.Vector3(0, 0, 3));
  scene.add(violet);

  // ---- Theme
  function applyTheme() {
    const light = document.documentElement.getAttribute("data-theme") === "light";
    const p = light ? PAL.light : PAL.dark;
    const blend = p.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    scene.fog.color.set(p.fog);
    coreMat.color.set(p.core);
    haloMat.color.set(p.halo); haloMat.blending = blend; haloMat.opacity = light ? 0.12 : 0.22; haloMat.needsUpdate = true;
    roadMat.color.set(p.road); roadMat.opacity = light ? 0.07 : 0.08;
    edgeMat.color.set(p.edge); edgeMat.opacity = light ? 0.45 : 0.55;
    tickMat.color.set(p.tick); tickMat.opacity = light ? 0.2 : 0.16;
    ringMat.color.set(p.ring);
    gates.forEach((g) => {
      g.glowMat.color.set(p.ringGlow); g.glowMat.blending = blend; g.glowMat.needsUpdate = true;
      g.outerMat.color.set(p.ringGlow);
      if (g.spriteMat.map) g.spriteMat.map.dispose();
      g.spriteMat.map = labelTexture(g.num, g.text, p);
      g.spriteMat.needsUpdate = true;
    });
    decoMat.color.set(p.deco); decoMat.opacity = light ? 0.35 : 0.45;
    starMat.color.set(p.star); starMat.opacity = light ? 0.45 : 0.9; starMat.blending = blend; starMat.needsUpdate = true;
    gridMat.color.set(p.grid); gridMat.opacity = light ? 0.35 : 0.2;
    markMat.color.set(p.mark); markMat.emissive.set(p.markEm);
    markGlow.material.opacity = light ? 0.35 : 1;
    markGlow.material.blending = blend; markGlow.material.needsUpdate = true;
    violet.intensity = light ? 0.8 : 2.2;
    renderOnce();
  }

  // ---- Camera poses
  const pose = () => (isSmall()
    ? { pos: new THREE.Vector3(2, 6.5, 24), look: new THREE.Vector3(5, -10, -14) }
    : { pos: new THREE.Vector3(-9, 6.5, 15), look: new THREE.Vector3(-5.5, 2.5, -14) });
  const OUTRO = { pos: new THREE.Vector3(26, 42, -18), look: new THREE.Vector3(0, -4, -78) };
  const smooth = (x) => x * x * (3 - 2 * x);

  const camPos = pose().pos.clone();
  const camLook = pose().look.clone();
  const tPos = new THREE.Vector3(), tLook = new THREE.Vector3();
  const rideP = new THREE.Vector3(), rideL = new THREE.Vector3();
  const cross = new THREE.Vector3();
  let roll = 0;

  function ridePose(u) {
    const P = curve.getPointAt(u);
    rideP.copy(P);
    rideP.y += RIDE_H;
    const ahead = u + 0.025;
    if (ahead <= 1) rideL.copy(curve.getPointAt(ahead));
    else rideL.copy(P).addScaledVector(curve.getTangentAt(1), 5);
    rideL.y += RIDE_H - 0.12;
    // bank into the curves
    cross.crossVectors(curve.getTangentAt(u), curve.getTangentAt(Math.min(1, u + 0.03)));
    return Math.max(-0.28, Math.min(0.28, -cross.y * 9));
  }

  const mouse = { x: 0, y: 0 }, mSm = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX / window.innerWidth - 0.5;
    mouse.y = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = camera.aspect < 0.8 ? 70 : 58;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderOnce();
  }
  window.addEventListener("resize", resize);

  // ---- Frame
  const clock = new THREE.Clock();
  let time = 0;
  function frame(dt) {
    const s = R.state;
    const motion = reduceMotion ? 0 : 1;
    time += dt * motion;

    // where should the camera be?
    const hero = pose();
    let targetRoll = 0;
    if (!s.live) {
      tPos.copy(hero.pos);
      tLook.copy(hero.look);
    } else {
      targetRoll = ridePose(s.u);
      const k = smooth(s.intro);
      tPos.copy(hero.pos).lerp(rideP, k);
      tLook.copy(hero.look).lerp(rideL, k);
      targetRoll *= k;
      if (s.after > 0) {
        const a = smooth(s.after);
        tPos.lerp(OUTRO.pos, a);
        tLook.lerp(OUTRO.look, a);
        targetRoll *= 1 - a;
      }
    }
    mSm.x += (mouse.x * motion - mSm.x) * 0.05;
    mSm.y += (mouse.y * motion - mSm.y) * 0.05;
    tPos.x += mSm.x * 0.9;
    tPos.y -= mSm.y * 0.5;

    const damp = dt === 0 || reduceMotion ? 1 : 1 - Math.exp(-dt * 5);
    camPos.lerp(tPos, damp);
    camLook.lerp(tLook, damp);
    roll += (targetRoll - roll) * damp;
    camera.position.copy(camPos);
    camera.up.set(Math.sin(roll), Math.cos(roll), 0);
    camera.lookAt(camLook);

    // life
    mark.rotation.y = Math.sin(time * 0.5) * 0.35;
    mark.position.y = MARK_POS.y + Math.sin(time * 0.9) * 0.18;
    decos.forEach((m) => {
      m.rotation.x += dt * m.userData.spin * motion;
      m.rotation.y += dt * m.userData.spin * 0.7 * motion;
    });
    stars.rotation.y = time * 0.004;
    gates.forEach((g) => {
      const near = s.live ? Math.max(0, 1 - Math.abs(s.u - g.u) * 9) : 0;
      g.glowMat.opacity = 0.16 + near * 0.4;
    });

    renderer.render(scene, camera);
  }

  function renderOnce() { frame(0); }
  function loop() {
    frame(Math.min(clock.getDelta(), 0.05));
    requestAnimationFrame(loop);
  }

  applyTheme();
  new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(applyTheme); // gate labels use Space Grotesk
  resize();
  if (reduceMotion) renderOnce();
  else loop();
  canvas.classList.add("ready");
}
