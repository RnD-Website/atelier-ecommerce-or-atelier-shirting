/* ==========================================================================
   ATELIER LOOKBOOK HERO
   - Full-screen layer shown after the preloader (the racks stay hidden)
   - One slide per model: oversized word + model + the product he wears
   - Live mouse / touch drag slider with depth (model, word and card move at
     different speeds), plus autoplay, dots and arrow keys
   - "Explore Collection" plays a curtain transition into the product racks
   - Clicking the Atelier logo in the racks header returns to the lookbook
   Depends on: products.js (PRODUCTS), main.js (openProductModal) — optional.
   ========================================================================== */
(function () {
  "use strict";

  const SLIDES = [
    { model: 3, word: "Shirts", product: "shirt-07" },
    { model: 6, word: "Oxford", product: "shirt-01" },
    { model: 4, word: "Linen",  product: "shirt-03" },
    { model: 1, word: "Layers", product: "tee-03" },
    { model: 5, word: "Poplin", product: "shirt-02" },
    { model: 2, word: "Tees",   product: "tee-02" },
  ];

  const AUTOPLAY_MS = 5500;
  const EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";
  const INOUT = "cubic-bezier(0.65, 0, 0.35, 1)";
  const CURTAIN = "cubic-bezier(0.76, 0, 0.24, 1)";

  const root = document.documentElement;
  const section = document.getElementById("lookbook");
  const stage = document.getElementById("lbStage");
  const dotsWrap = document.getElementById("lbDots");
  const indexEl = document.getElementById("lbIndex");
  const cursor = document.getElementById("lbCursor");
  if (!section || !stage) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  section.style.setProperty("--lb-autoplay", AUTOPLAY_MS + "ms");

  const catalog = typeof PRODUCTS !== "undefined" ? PRODUCTS : [];
  const findProduct = (id) => catalog.find((p) => p.id === id);
  const pad = (n) => String(n).padStart(2, "0");
  const isOpen = () => root.classList.contains("is-lookbook");

  const ARROW_NE =
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M4 12L12 4M5.5 4H12v6.5"/></svg>';

  /* ======================================================================
     BUILD
     ====================================================================== */
  const slides = SLIDES.map((s, i) => {
    const product = findProduct(s.product);
    const el = document.createElement("div");
    el.className = "lb-slide";
    el.setAttribute("role", "group");
    el.setAttribute("aria-roledescription", "slide");
    el.setAttribute("aria-label", `${i + 1} of ${SLIDES.length}: ${s.word}`);

    const chars = s.word
      .split("")
      .map((c) => `<span class="lb-char-mask"><span class="lb-char">${c}</span></span>`)
      .join("");

    // data-depth = mouse parallax strength, data-drag = how far it follows a drag
    el.innerHTML = `
      <div class="lb-title"><div class="lb-par" data-depth="-0.35" data-drag="0.55">
        <span class="lb-shop">Shop</span>
        <div class="lb-word" aria-label="${s.word}">${chars}</div>
        <span class="lb-arrow">${ARROW_NE}</span>
      </div></div>
      <div class="lb-model"><div class="lb-par" data-depth="0.9" data-drag="1"><div class="lb-float">
        <img src="assets/images/men_model_0${s.model}.png" alt="Atelier model wearing the ${s.word.toLowerCase()} edit" draggable="false">
      </div></div></div>
      ${product ? `
      <div class="lb-product"><div class="lb-par" data-depth="1.4" data-drag="1.3">
        <button class="lb-product__card" type="button" data-product="${product.id}" aria-label="View ${product.title}">
          <span class="lb-product__thumb"><img src="${product.image}" alt="" loading="lazy" draggable="false"></span>
          <span>
            <span class="lb-product__label">Worn with</span>
            <span class="lb-product__name">${product.title}</span>
            <span class="lb-product__row"><span>$${product.price.toFixed(2)}</span>${ARROW_NE}</span>
          </span>
        </button>
      </div></div>` : ""}
    `;
    stage.appendChild(el);

    return {
      el,
      shop: el.querySelector(".lb-shop"),
      chars: [...el.querySelectorAll(".lb-char")],
      arrow: el.querySelector(".lb-arrow"),
      model: el.querySelector(".lb-model img"),
      float: el.querySelector(".lb-float"),
      product: el.querySelector(".lb-product__card"),
      pars: [...el.querySelectorAll(".lb-par")].map((p) => ({
        el: p,
        depth: parseFloat(p.dataset.depth),
        drag: parseFloat(p.dataset.drag),
      })),
      dragX: 0,        // current drag offset (px)
      dragTarget: 0,   // where dragX is easing to
    };
  });

  const dots = SLIDES.map((s, i) => {
    const b = document.createElement("button");
    b.className = "lb-dot";
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", `Show ${s.word}`);
    b.innerHTML = '<span class="lb-dot__fill"></span>';
    b.addEventListener("click", () => go(i));
    dotsWrap.appendChild(b);
    return b;
  });

  /* ======================================================================
     SLIDE ANIMATIONS
     ====================================================================== */
  const run = (el, frames, opts) => (el ? el.animate(frames, { fill: "both", ...opts }) : null);
  const k = reduceMotion ? 0.01 : 1;

  function animateIn(s, first) {
    const base = first ? 120 : 220;
    s.chars.forEach((c, i) =>
      run(c, [{ transform: "translateY(105%)" }, { transform: "translateY(0)" }],
        { duration: 1000 * k, delay: (base + i * 55) * k, easing: EXPO })
    );
    run(s.shop, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }],
      { duration: 800 * k, delay: (base + 200) * k, easing: EXPO });
    run(s.arrow, [{ opacity: 0, transform: "translate(-6px, 6px)" }, { opacity: 1, transform: "none" }],
      { duration: 800 * k, delay: (base + 420) * k, easing: EXPO });
    run(s.model, [
      { opacity: 0, filter: "blur(16px)", transform: "translateY(28px) scale(1.04)" },
      { opacity: 1, filter: "blur(0px)", transform: "translateY(0) scale(1)" },
    ], { duration: 1200 * k, delay: (base - 60) * k, easing: EXPO });
    run(s.product, [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }],
      { duration: 900 * k, delay: (base + 520) * k, easing: EXPO });
  }

  function animateOut(s) {
    s.chars.forEach((c, i) =>
      run(c, [{ transform: "translateY(0)" }, { transform: "translateY(-105%)" }],
        { duration: 650 * k, delay: i * 30 * k, easing: INOUT })
    );
    run(s.shop, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 * k, easing: "ease-out" });
    run(s.arrow, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 * k, easing: "ease-out" });
    run(s.product, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 * k, easing: "ease-out" });
    return run(s.model, [
      { opacity: 1, filter: "blur(0px)" },
      { opacity: 0, filter: "blur(10px)" },
    ], { duration: 700 * k, easing: INOUT });
  }

  // Everything starts hidden until the preloader hands over
  slides.forEach((s) => {
    s.chars.forEach((c) => (c.style.transform = "translateY(105%)"));
    [s.shop, s.arrow, s.model, s.product].forEach((e) => e && (e.style.opacity = 0));
  });

  /* ======================================================================
     STATE + NAVIGATION
     ====================================================================== */
  let current = -1;
  let busy = false;
  let timer = 0;
  let hoverPause = false;
  let visible = true;

  function setDots(i) {
    dots.forEach((d, n) => {
      d.classList.toggle("is-active", n === i);
      d.setAttribute("aria-selected", n === i ? "true" : "false");
      const f = d.firstChild; // restart the progress fill
      f.style.animation = "none";
      void f.offsetWidth;
      f.style.animation = "";
    });
    if (indexEl) indexEl.textContent = pad(i + 1);
  }

  /**
   * Go to a slide. `fromDrag` = the visitor dragged: the old slide keeps
   * travelling in the drag direction and the new one glides in from the
   * opposite side.
   */
  function go(next, dir, fromDrag) {
    next = (next + slides.length) % slides.length;
    if (busy || next === current) return;
    busy = true;
    dir = dir || (next > current ? 1 : -1);
    const prev = current;
    current = next;
    setDots(next);

    const W = window.innerWidth;
    const incoming = slides[next];
    incoming.el.classList.add("is-active");
    incoming.el.style.opacity = "";
    incoming.float.style.filter = "";
    [incoming.shop, incoming.arrow, incoming.model, incoming.product].forEach(
      (e) => e && (e.style.opacity = "")
    );
    // incoming glides in from the side it is coming from
    incoming.dragX = dir * W * (fromDrag ? 0.22 : 0.12);
    incoming.dragTarget = 0;

    if (prev >= 0) {
      const outgoing = slides[prev];
      outgoing.el.classList.remove("is-active");
      outgoing.el.classList.add("is-leaving");
      outgoing.dragTarget = -dir * W * 0.28;
      animateOut(outgoing).finished.then(() => {
        outgoing.el.classList.remove("is-leaving");
        outgoing.el.style.opacity = "";
        outgoing.float.style.filter = "";
        outgoing.dragX = outgoing.dragTarget = 0;
      });
    }

    animateIn(incoming, prev < 0);
    setTimeout(() => { busy = false; }, reduceMotion ? 50 : 850);
    schedule();
  }

  const nextSlide = (fromDrag) => go(current + 1, 1, fromDrag);
  const prevSlide = (fromDrag) => go(current - 1, -1, fromDrag);

  function schedule() {
    clearTimeout(timer);
    const playing = visible && !hoverPause && !dragging && isOpen();
    section.classList.toggle("is-paused", !playing);
    if (playing) timer = setTimeout(() => nextSlide(false), AUTOPLAY_MS);
  }

  /* ======================================================================
     MOUSE / TOUCH DRAG SLIDER
     ====================================================================== */
  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragLastX = 0;
  let dragLastT = 0;
  let velocity = 0;
  let axis = null; // "x" once we know it's a horizontal drag
  let dragLastY = 0;
  let dragType = "mouse";

  stage.addEventListener("pointerdown", (e) => {
    if (busy || e.button > 0 || e.target.closest(".lb-product__card")) return;
    dragging = true;
    axis = null;
    dragStartX = dragLastX = e.clientX;
    dragStartY = dragLastY = e.clientY;
    dragType = e.pointerType;
    dragLastT = performance.now();
    velocity = 0;
    section.classList.add("is-dragging");
    schedule();
  });

  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    dragLastY = e.clientY;
    if (!axis && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      if (axis === "x") stage.setPointerCapture?.(e.pointerId);
    }
    if (axis !== "x") return;

    const now = performance.now();
    const dt = Math.max(1, now - dragLastT);
    velocity = 0.8 * velocity + 0.2 * ((e.clientX - dragLastX) / dt);
    dragLastX = e.clientX;
    dragLastT = now;

    // soft resistance the further you pull
    const W = window.innerWidth;
    const resisted = dx / (1 + Math.abs(dx) / (W * 0.9));
    const s = slides[current];
    s.dragX = s.dragTarget = resisted;
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    section.classList.remove("is-dragging");
    const s = slides[current];
    const W = window.innerWidth;
    const pulled = s.dragX;
    const flick = Math.abs(velocity) > 0.45;
    const far = Math.abs(pulled) > W * 0.12;

    if (axis === "x" && (far || (flick && Math.abs(pulled) > 20))) {
      (pulled < 0 ? nextSlide : prevSlide)(true);
    } else {
      s.dragTarget = 0; // spring back
      schedule();
    }
    axis = null;
  }
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);

  /* ======================================================================
     PARALLAX + DRAG RENDER LOOP + CURSOR
     ====================================================================== */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, cx: -100, cy: -100, ccx: -100, ccy: -100 };

  section.addEventListener("pointermove", (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    mouse.cx = e.clientX;
    mouse.cy = e.clientY;
    if (e.pointerType === "mouse") section.classList.add("has-cursor");
    if (cursor) {
      const onButton = !!e.target.closest("button, a");
      cursor.classList.toggle("is-hover", onButton);
      cursor.classList.toggle("is-drag", !onButton && !!e.target.closest(".lookbook__stage"));
    }
  });
  section.addEventListener("pointerleave", () => section.classList.remove("has-cursor"));

  function loop() {
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    mouse.ccx += (mouse.cx - mouse.ccx) * 0.25;
    mouse.ccy += (mouse.cy - mouse.ccy) * 0.25;

    if (isOpen()) {
      const W = window.innerWidth;
      for (let i = 0; i < slides.length; i++) {
        const s = slides[i];
        const live = i === current || s.el.classList.contains("is-leaving");
        if (!live) continue;

        if (!(dragging && i === current)) s.dragX += (s.dragTarget - s.dragX) * 0.09;
        const p = Math.min(Math.abs(s.dragX) / (W * 0.35), 1);

        for (const par of s.pars) {
          const mx = reduceMotion ? 0 : mouse.x * 14 * par.depth;
          const my = reduceMotion ? 0 : mouse.y * 7 * par.depth;
          par.el.style.transform = `translate3d(${mx + s.dragX * par.drag}px, ${my}px, 0)`;
        }
        if (i === current) {
          s.el.style.opacity = p > 0.002 ? String(1 - p * 0.55) : "";
          s.float.style.filter = p > 0.01 ? `blur(${(p * 6).toFixed(2)}px)` : "";
        }
      }
    }
    if (cursor) cursor.style.transform = `translate3d(${mouse.ccx}px, ${mouse.ccy}px, 0)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ======================================================================
     OTHER INPUT
     ====================================================================== */
  stage.addEventListener("pointerover", (e) => {
    if (e.target.closest(".lb-product__card")) { hoverPause = true; schedule(); }
  });
  stage.addEventListener("pointerout", (e) => {
    if (e.target.closest(".lb-product__card")) { hoverPause = false; schedule(); }
  });

  window.addEventListener("keydown", (e) => {
    if (!isOpen() || root.classList.contains("is-preloading")) return;
    if (document.querySelector(".modal-backdrop.open")) return;
    if (e.key === "ArrowRight") nextSlide(false);
    if (e.key === "ArrowLeft") prevSlide(false);
    if (e.key === "Enter" && e.target === document.body) explore();
  });

  // Product card → product popup
  stage.addEventListener("click", (e) => {
    const card = e.target.closest(".lb-product__card");
    if (!card) return;
    const product = findProduct(card.dataset.product);
    if (product && typeof openProductModal === "function") openProductModal(product);
    else explore();
  });

  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    schedule();
  });

  /* ======================================================================
     EXPLORE COLLECTION → curtain transition into the racks
     ====================================================================== */
  let transitioning = false;

  function makeCurtain(color) {
    const c = document.createElement("div");
    c.className = "lb-curtain";
    c.style.background = color;
    document.body.appendChild(c);
    return c;
  }

  function collectionPieces() {
    return [
      document.querySelector(".top-header"),
      document.querySelector(".hero-strip"),
      ...document.querySelectorAll(".rack-track-section"),
    ].filter(Boolean);
  }

  function explore() {
    if (transitioning || !isOpen()) return;
    transitioning = true;
    clearTimeout(timer);
    section.classList.add("is-exiting");

    // 1. The look lifts away
    const s = slides[current];
    if (s) {
      s.chars.forEach((c, i) =>
        run(c, [{ transform: "translateY(0)" }, { transform: "translateY(-105%)" }],
          { duration: 700 * k, delay: i * 35 * k, easing: INOUT })
      );
      run(s.shop, [{ opacity: 1 }, { opacity: 0 }], { duration: 350 * k, easing: "ease-out" });
      run(s.arrow, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 * k, easing: "ease-out" });
      run(s.product, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(16px)" }],
        { duration: 450 * k, easing: "ease-out" });
      run(s.model, [
        { opacity: 1, filter: "blur(0px)", transform: "translateY(0) scale(1)" },
        { opacity: 0, filter: "blur(8px)", transform: "translateY(-50px) scale(1.06)" },
      ], { duration: 900 * k, delay: 80 * k, easing: INOUT });
    }

    // 2. An ink curtain with a curved edge sweeps up
    const curtain = makeCurtain("#2b2926");
    curtain.animate(
      [{ transform: "translateY(100%)" }, { transform: "translateY(-14vh)" }],
      { duration: 1000 * k, delay: 260 * k, easing: CURTAIN, fill: "forwards" }
    ).finished.then(() => {
      // 3. Swap layers behind the curtain
      root.classList.remove("is-lookbook");
      window.scrollTo(0, 0);
      schedule();

      // 4. Curtain keeps travelling up and off while the racks slide in
      const pieces = collectionPieces();
      pieces.forEach((el, i) => {
        el.animate(
          i === 0
            ? [{ opacity: 0, transform: "translateY(-24px)" }, { opacity: 1, transform: "none" }]
            : [{ opacity: 0, transform: "translateX(90px)" }, { opacity: 1, transform: "none" }],
          { duration: 1100 * k, delay: (120 + i * 110) * k, easing: EXPO, fill: "backwards" }
        );
      });
      return curtain.animate(
        [{ transform: "translateY(-14vh)" }, { transform: "translateY(-135%)" }],
        { duration: 950 * k, easing: CURTAIN, fill: "forwards" }
      ).finished;
    }).then(() => {
      curtain.remove();
      section.classList.remove("is-exiting");
      transitioning = false;
      window.dispatchEvent(new CustomEvent("atelier:collection"));
    });
  }

  /* Back from the racks → lookbook (click the Atelier logo in the header) */
  function backToLookbook() {
    if (transitioning || isOpen()) return;
    transitioning = true;
    const curtain = makeCurtain("#2b2926");
    curtain.animate(
      [{ transform: "translateY(100%)" }, { transform: "translateY(-14vh)" }],
      { duration: 950 * k, easing: CURTAIN, fill: "forwards" }
    ).finished.then(() => {
      root.classList.add("is-lookbook");
      // replay the current look
      const s = slides[current];
      if (s) {
        s.dragX = s.dragTarget = 0;
        s.el.style.opacity = "";
        animateIn(s, false);
      }
      schedule();
      return curtain.animate(
        [{ transform: "translateY(-14vh)" }, { transform: "translateY(-135%)" }],
        { duration: 950 * k, easing: CURTAIN, fill: "forwards" }
      ).finished;
    }).then(() => {
      curtain.remove();
      transitioning = false;
    });
  }

  // Live piece count on the button
  const ctaSub = document.getElementById("lbCtaSub");
  const inStock = catalog.filter((p) => p.category !== "archived").length;
  if (ctaSub && inStock) ctaSub.textContent = `${inStock} pieces · Shirts & Tees`;

  const hintText = document.getElementById("lbHintText");
  if (hintText && window.matchMedia("(pointer: coarse)").matches) {
    hintText.textContent = "Tap to view all products";
  }

  document.querySelectorAll("[data-explore]").forEach((el) =>
    el.addEventListener("click", (e) => { e.preventDefault(); explore(); })
  );
  const headerBrand = document.querySelector(".top-header .brand-group");
  if (headerBrand) {
    headerBrand.style.cursor = "pointer";
    headerBrand.setAttribute("title", "Back to the lookbook");
    headerBrand.addEventListener("click", backToLookbook);
  }

  /* Footer: back to top + current year */
  const footerTop = document.getElementById("footerTop");
  if (footerTop) {
    footerTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
    );
  }
  const footerYear = document.getElementById("footerYear");
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  /* ======================================================================
     START (after the preloader hands over)
     ====================================================================== */
  let started = false;
  function start() {
    if (started) return;
    started = true;
    section.classList.add("is-ready");
    go(0, 1);
  }

  if (document.getElementById("preloader")) {
    window.addEventListener("atelier:reveal", start, { once: true });
    window.addEventListener("atelier:preloader-done", start, { once: true });
  } else {
    start();
  }
})();
