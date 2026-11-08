/* ==========================================================================
   ATELIER PRELOADER
   1. Ivory fog lifts
   2. "Atelier" resolves letter by letter (right → left) from blur
   3. Models step out of the mist at four depths (far / mid / hero / front)
      with a walking rhythm, slow camera push-in and mouse parallax
   4. Wordmark flies into the header logo while the stage melts into the site
   Click or press any key to skip.
   ========================================================================== */
(function () {
  "use strict";

  const root = document.documentElement;
  const stage = document.getElementById("preloader");
  if (!stage) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const IMG = (n) => `assets/images/men_model_0${n}.png`;

  /* ---------- Timing (ms) ---------- */
  const MIN_DURATION = 2300;   // shortest time the intro stays on screen
  const MAX_WAIT = 6000;       // never block the site longer than this
  const EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";
  const INOUT = "cubic-bezier(0.7, 0, 0.2, 1)";

  /* ---------- Depth layers ---------- */
  // z = stacking (wordmark sits at z 3), depth = parallax / push strength
  const LAYERS = {
    far:   { z: 1, depth: 0.15 },
    mid:   { z: 2, depth: 0.35 },
    hero:  { z: 4, depth: 0.6 },
    front: { z: 5, depth: 1.2 },
  };

  /* ---------- Cast ----------
     x / y : feet position in % of the screen
     h     : model height in vh
     blur  : depth-of-field blur (px)
     op    : resting opacity (atmospheric haze)                         */
  const CAST = [
    // Far row — small, hazy, behind the wordmark
    { n: 2, layer: "far", x: 8,  y: 30, h: 17, blur: 3,   op: 0.45 },
    { n: 5, layer: "far", x: 21, y: 31, h: 18, blur: 2.5, op: 0.5, driftX: 34 },
    { n: 6, layer: "far", x: 45, y: 28, h: 16, blur: 3,   op: 0.4 },
    { n: 1, layer: "far", x: 70, y: 29, h: 17, blur: 3,   op: 0.45 },
    { n: 3, layer: "far", x: 84, y: 31, h: 18, blur: 2.5, op: 0.5 },
    { n: 4, layer: "far", x: 95, y: 30, h: 17, blur: 3,   op: 0.4, hideMobile: true },
    // Mid row
    { n: 6, layer: "mid", x: 6,  y: 54, h: 27, blur: 3,   op: 0.7, hideMobile: true },
    { n: 5, layer: "mid", x: 40, y: 43, h: 22, blur: 1.8, op: 0.7, driftX: 22 },
    { n: 1, layer: "mid", x: 92, y: 50, h: 26, blur: 2.4, op: 0.7 },
    // Hero row — sharp, standing over the wordmark
    { n: 2, layer: "hero", x: 31, y: 74, h: 40, blur: 0, op: 1 },
    { n: 3, layer: "hero", x: 50, y: 81, h: 50, blur: 0, op: 1 },
    { n: 4, layer: "hero", x: 79, y: 72, h: 37, blur: 0, op: 1 },
    // Foreground — huge, out of focus, cropped by the frame
    { n: 1, layer: "front", x: 11, y: 134, h: 105, blur: 10, op: 0.95 },
  ];

  // Order models appear in: near first, then the mist reveals the depth
  const REVEAL_ORDER = ["hero", "front", "mid", "far"];

  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------- Build DOM ---------- */
  const fog = document.createElement("div");
  fog.className = "preloader__fog";

  const bgDark = document.createElement("div");
  bgDark.className = "preloader__bg-dark";

  const layerEls = {};
  Object.entries(LAYERS).forEach(([name, cfg]) => {
    const el = document.createElement("div");
    el.className = `preloader__layer preloader__layer--${name}`;
    el.style.zIndex = cfg.z;
    layerEls[name] = el;
  });

  const models = CAST.map((m) => {
    const wrap = document.createElement("div");
    wrap.className = "pl-model" + (m.hideMobile ? " is-hide-mobile" : "");
    wrap.style.left = m.x + "%";
    wrap.style.top = m.y + "%";

    const near = LAYERS[m.layer].depth;
    const walk = document.createElement("div");
    walk.className = "pl-model__walk";
    walk.style.setProperty("--walk-dur", rand(8, 11).toFixed(2) + "s");
    walk.style.setProperty("--approach", (1.03 + near * 0.05).toFixed(3));
    walk.style.setProperty("--drift-y", (4 + near * 12).toFixed(1) + "px");
    walk.style.setProperty("--drift-x", (m.driftX || rand(-6, 6)).toFixed(1) + "px");

    const step = document.createElement("div");
    step.className = "pl-model__step";
    step.style.setProperty("--step-dur", rand(0.95, 1.2).toFixed(2) + "s");
    step.style.setProperty("--step-delay", (-rand(0, 1.2)).toFixed(2) + "s");
    step.style.setProperty("--bob", (-rand(0.5, 1.1)).toFixed(2) + "%");
    step.style.setProperty("--sway", rand(0.25, 0.65).toFixed(2) + "deg");

    const img = document.createElement("img");
    img.className = "pl-model__img";
    img.src = IMG(m.n);
    img.alt = "";
    img.decoding = "async";
    img.draggable = false;
    img.style.setProperty("--h", m.h + "vh");
    img.style.setProperty("--blur", m.blur + "px");

    step.appendChild(img);
    walk.appendChild(step);
    wrap.appendChild(walk);
    layerEls[m.layer].appendChild(wrap);
    return { ...m, img };
  });

  const word = document.createElement("h2");
  word.className = "preloader__wordmark";
  word.setAttribute("aria-label", "Atelier");
  const wordInner = document.createElement("span");
  wordInner.className = "preloader__wordmark-inner";
  const letters = "Atelier".split("").map((ch) => {
    const s = document.createElement("span");
    s.className = "pl-letter";
    s.setAttribute("aria-hidden", "true");
    s.textContent = ch;
    wordInner.appendChild(s);
    return s;
  });
  word.appendChild(wordInner);

  const meta = document.createElement("div");
  meta.className = "preloader__meta";
  meta.innerHTML =
    '<div class="preloader__meta-left"><em>Atelier</em><span>Menswear — Autumn / Winter Edit</span></div>' +
    '<div class="preloader__count"><span id="plCount">000</span> / 100</div>';

  const bar = document.createElement("div");
  bar.className = "preloader__bar";
  bar.innerHTML = "<span></span>";
  const barFill = bar.firstChild;

  const skip = document.createElement("div");
  skip.className = "preloader__skip";
  skip.textContent = window.matchMedia("(pointer: coarse)").matches ? "Tap to skip" : "Click to skip";

  stage.append(
    layerEls.far, layerEls.mid, word, layerEls.hero, layerEls.front,
    fog, meta, bar, skip, bgDark
  );
  const countEl = stage.querySelector("#plCount");

  /* ---------- Loading progress ---------- */
  let assetsDone = 0;
  const assetsTotal = models.length + 1; // + display font
  const tick = () => { assetsDone = Math.min(assetsTotal, assetsDone + 1); };

  const withTimeout = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(r, ms))]);

  const fontReady = document.fonts
    ? withTimeout(document.fonts.load('italic 400 120px "Atelier Display"'), 900).then(tick, tick)
    : Promise.resolve(tick());

  const imagesReady = Promise.all(
    models.map((m) =>
      withTimeout(m.img.decode ? m.img.decode() : Promise.resolve(), 1200).then(tick, tick)
    )
  );

  /* ---------- Camera: push-in + mouse parallax ---------- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (e) => {
    pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  let startTime = 0;
  let rafId = 0;
  let shown = 0;
  let leaving = false;
  let introAnims = [];

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function frame(now) {
    if (!startTime) startTime = now;
    const t = now - startTime;

    // camera push-in over ~5s
    const push = easeOutCubic(Math.min(t / 5000, 1));
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;

    if (!reduceMotion) {
      Object.entries(LAYERS).forEach(([name, cfg]) => {
        const px = -pointer.x * 26 * cfg.depth;
        const py = -pointer.y * 12 * cfg.depth;
        const s = 1 + push * 0.05 * (0.4 + cfg.depth);
        layerEls[name].style.transform = `translate3d(${px}px, ${py}px, 0) scale(${s})`;
      });
      const wx = -pointer.x * 8;
      const wy = -pointer.y * 4;
      if (!leaving) wordInner.style.transform = `translate3d(${wx}px, ${wy}px, 0)`;
    }

    // progress = slower of "time" and "assets"
    const timeFrac = Math.min(t / MIN_DURATION, 1);
    const assetFrac = assetsDone / assetsTotal;
    const target = t > MAX_WAIT ? 1 : Math.min(timeFrac, assetFrac);
    // ease toward target, but never crawl: keep a minimum step
    const diff = target - shown;
    if (diff > 0) shown = Math.min(target, shown + Math.max(diff * 0.14, 0.006));
    countEl.textContent = String(Math.round(shown * 100)).padStart(3, "0");
    barFill.style.transform = `scaleX(${shown})`;

    if (shown === 1 && !leaving) leave();
    rafId = requestAnimationFrame(frame);
  }

  /* ---------- Entrance ---------- */
  function enter() {
    // Fog lifts
    introAnims.push(
      fog.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 1500, delay: 120, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards",
      })
    );

    // Letters resolve right → left (like the reference)
    letters.slice().reverse().forEach((el, i) => {
      introAnims.push(
        el.animate(
          [
            { opacity: 0, filter: "blur(22px)", transform: "translateX(0.16em) scaleX(1.25)" },
            { opacity: 0.6, filter: "blur(6px)", offset: 0.55 },
            { opacity: 1, filter: "blur(0px)", transform: "translateX(0) scaleX(1)" },
          ],
          { duration: 1100, delay: 160 + i * 85, easing: EXPO, fill: "forwards" }
        )
      );
    });

    // Models step out of the mist
    const ordered = REVEAL_ORDER.flatMap((l) => models.filter((m) => m.layer === l));
    ordered.forEach((m, i) => {
      introAnims.push(
        m.img.animate(
          [
            { opacity: 0, filter: `blur(${m.blur + 14}px)`, transform: "translateY(16px) scale(0.985)" },
            { opacity: m.op, filter: `blur(${m.blur}px)`, transform: "translateY(0) scale(1)" },
          ],
          { duration: 1200, delay: 260 + i * 75, easing: EXPO, fill: "forwards" }
        )
      );
    });
  }

  /* ---------- Exit: wordmark flies to the hero logo ---------- */
  function leave() {
    if (leaving) return;
    leaving = true;
    stage.classList.add("is-leaving");
    introAnims.forEach((a) => { try { a.finish(); } catch (e) {} });

    const target =
      document.querySelector(".lookbook__brand") ||
      document.querySelector(".top-header .brand-title");
    const srcSize = parseFloat(getComputedStyle(word).fontSize);

    // Lift the wordmark out of the stage (fixed, on top) so the stage can fade
    // away underneath it while it flies.
    wordInner.style.transform = "none";
    const pinned = wordInner.getBoundingClientRect();
    document.body.appendChild(word);
    word.classList.add("is-flying");
    Object.assign(word.style, {
      position: "fixed",
      left: pinned.left + "px",
      top: pinned.top + "px",
      transform: "none",
      zIndex: 10001,
      pointerEvents: "none",
    });

    const tRect = target && target.getBoundingClientRect();
    let wordAnim;
    if (tRect && tRect.width > 0) {
      const tStyle = getComputedStyle(target);
      const scale = parseFloat(tStyle.fontSize) / srcSize;
      const dx = tRect.left - pinned.left;
      const dy = tRect.top - pinned.top;
      wordAnim = word.animate(
        [
          { transform: "translate(0,0) scale(1)", color: "#121212" },
          { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, color: tStyle.color },
        ],
        { duration: 1100, delay: 100, easing: INOUT, fill: "forwards" }
      );
    } else {
      wordAnim = word.animate(
        [
          { opacity: 1, filter: "blur(0px)", transform: "translateY(0)" },
          { opacity: 0, filter: "blur(16px)", transform: "translateY(-40px)" },
        ],
        { duration: 800, easing: INOUT, fill: "forwards" }
      );
    }

    // Crowd dissolves back into the mist
    models.forEach((m, i) => {
      m.img.animate(
        [
          { opacity: m.op, filter: `blur(${m.blur}px)`, transform: "translateY(0) scale(1)" },
          { opacity: 0, filter: `blur(${m.blur + 12}px)`, transform: "translateY(-10px) scale(1.03)" },
        ],
        { duration: 650, delay: i * 18, easing: INOUT, fill: "forwards" }
      );
    });

    // The ivory stage clears into the (ivory) lookbook hero underneath
    setTimeout(() => window.dispatchEvent(new CustomEvent("atelier:reveal")), 420);
    const stageFade = stage.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 700, delay: 380, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards",
    });
    stageFade.finished.then(() => { stage.style.visibility = "hidden"; });

    wordAnim.finished.then(() => {
      // Hand over to the real logo
      root.classList.remove("is-preloading");
      return word.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 300, easing: "linear", fill: "forwards",
      }).finished;
    }).then(cleanup);
  }

  function cleanup() {
    cancelAnimationFrame(rafId);
    window.removeEventListener("pointermove", onMove);
    stage.remove();
    word.remove();
    root.classList.remove("is-preloading");
    window.dispatchEvent(new CustomEvent("atelier:preloader-done"));
  }

  /* ---------- Skip ---------- */
  const skipNow = () => {
    // jump straight to 100 and leave
    assetsDone = assetsTotal;
    startTime = performance.now() - MAX_WAIT - 1;
    shown = 0.999;
  };
  stage.addEventListener("click", skipNow);
  window.addEventListener("keydown", function onKey() {
    window.removeEventListener("keydown", onKey);
    skipNow();
  });

  /* ---------- Reduced motion: simple fade ---------- */
  if (reduceMotion) {
    letters.forEach((l) => { l.style.opacity = 1; l.style.filter = "none"; });
    models.forEach((m) => { m.img.style.opacity = m.op; m.img.style.filter = `blur(${m.blur}px)`; });
    fog.style.opacity = 0;
  }

  /* ---------- Go ---------- */
  // Start once the display font and model images are ready (or timed out),
  // so letters never flash in a fallback font.
  Promise.all([fontReady, withTimeout(imagesReady, 900)]).then(() => {
    if (!reduceMotion) enter();
    rafId = requestAnimationFrame(frame);
  });
})();
