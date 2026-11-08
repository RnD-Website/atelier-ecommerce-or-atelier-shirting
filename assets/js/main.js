/* ========================================================================
   02. METALLIC CLAMP / CLIP SVG GENERATOR
   ======================================================================== */
function renderClipSVG() {
  return `
    <svg class="clip-svg" viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#1e2025" />
          <stop offset="25%" stop-color="#4e535e" />
          <stop offset="50%" stop-color="#8a92a1" />
          <stop offset="75%" stop-color="#3d424b" />
          <stop offset="100%" stop-color="#181a1f" />
        </linearGradient>
        <linearGradient id="jawGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#737987" />
          <stop offset="50%" stop-color="#434852" />
          <stop offset="100%" stop-color="#1f2127" />
        </linearGradient>
        <radialGradient id="screwGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="40%" stop-color="#808899" />
          <stop offset="100%" stop-color="#1d2027" />
        </radialGradient>
      </defs>

      <!-- Top Hook / Clamp over the horizontal rail -->
      <path d="M14 2 H30 V12 H26 V8 H18 V12 H14 Z" fill="url(#metalGrad)" stroke="#111" stroke-width="0.8"/>
      
      <!-- Main spring clip body -->
      <rect x="13" y="10" width="18" height="24" rx="2.5" fill="url(#metalGrad)" stroke="#111" stroke-width="0.8" />
      
      <!-- Metallic Spring Coils detail -->
      <line x1="15" y1="14" x2="29" y2="14" stroke="#22252c" stroke-width="1.2"/>
      <line x1="15" y1="18" x2="29" y2="18" stroke="#18191f" stroke-width="1.2"/>
      
      <!-- Center Rivet / Hinge Pin -->
      <circle cx="22" cy="22" r="3.2" fill="url(#screwGrad)" stroke="#111" stroke-width="0.6"/>
      
      <!-- Bottom Clamp Jaws clasping through card slot -->
      <path d="M16 32 L20 44 H24 L28 32 Z" fill="url(#jawGrad)" stroke="#111" stroke-width="0.7"/>
      
      <!-- Jaw teeth holding tag -->
      <rect x="18" y="42" width="8" height="4" rx="1" fill="#18191d" stroke="#686d79" stroke-width="0.6"/>
    </svg>
  `;
}

/* ========================================================================
   03. CARD HTML BUILDER
   ======================================================================== */
function buildCardHTML(product) {
  const isFlippedClass = product.initialFlipped ? "is-flipped" : "";
  
  const dotsHTML = product.dots.map(d => `<span class="c-dot ${d}"></span>`).join("");

  return `
    <div class="hanger-assembly ${isFlippedClass}" 
         data-id="${product.id}" 
         data-category="${product.category}" 
         data-tilt="${product.tilt}"
         title="Click to view shirt details, or click icon to flip">
      
      <!-- Metallic Clamp gripping the card -->
      <div class="clip-unit">
        ${renderClipSVG()}
      </div>

      <!-- 3D Card Body (Front + Back) -->
      <div class="card-flipper-container">
        
        <!-- FRONT FACE -->
        <div class="card-face card-front">
          <!-- Punched cutout hole for clip -->
          <div class="punched-slot"></div>

          <!-- Header Bar with Dots & Brand -->
          <div class="card-header-bar">
            <div class="brand-pill-group">
              <div class="color-dots">${dotsHTML}</div>
              <span class="brand-series-name">${product.brandSeries}</span>
            </div>
            <button class="flip-hint-btn card-flip-trigger" title="Flip to specifications & stamp" data-id="${product.id}">
              <i data-lucide="rotate-cw" style="width: 13px; height: 13px;"></i>
            </button>
          </div>

          <!-- Product 3D Floating Mockup Frame -->
          <div class="photo-frame open-modal-trigger" data-id="${product.id}">
            <div class="model-3d-badge">
              <i data-lucide="box" style="width: 10px; height: 10px;"></i> 3D Model
            </div>
            <img src="${product.image}" alt="${product.title}" class="shirt-photo ${product.fit === 'contain' ? 'is-contain-fit' : ''}" style="${product.position ? `object-position: ${product.position};` : ''}${product.filter ? ` filter: ${product.filter};` : ''}" loading="lazy">
            <div class="photo-hover-overlay">
              <div class="quick-pill">
                <i data-lucide="rotate-3d" style="width: 12px; height: 12px;"></i> View in 3D
              </div>
            </div>
          </div>

          <!-- Typography & Price Stamp Bottom -->
          <div class="card-footer-info open-modal-trigger" data-id="${product.id}">
            <div class="card-title-row">
              <h3 class="shirt-name">${product.title}</h3>
            </div>
            <div class="shirt-submeta-row">
              <span class="shirt-material">${product.material}</span>
              <div class="corner-badge-stamp ${product.stock === 'Sold Out' ? 'sold-out' : ''}">
                ${product.priceStamp}
              </div>
            </div>
          </div>
        </div>

        <!-- BACK FACE (Matching the reference's stamped night shift cards) -->
        <div class="card-face card-back">
          <!-- Punched cutout hole -->
          <div class="punched-slot"></div>

          <div>
            <p class="back-note-text">
              <strong>Atelier Production Archive</strong>
              ${product.backNote}
            </p>

            <!-- Fabric Spec Table -->
            <div class="specs-table">
              <div class="specs-row">
                <span>Weave:</span>
                <span>${product.specs.weave}</span>
              </div>
              <div class="specs-row">
                <span>Weight:</span>
                <span>${product.specs.weight}</span>
              </div>
              <div class="specs-row">
                <span>Collar:</span>
                <span>${product.specs.collar}</span>
              </div>
              <div class="specs-row">
                <span>Fabric Mill:</span>
                <span>${product.specs.origin}</span>
              </div>
            </div>
          </div>

          <!-- The Angled Rubber Stamp from reference -->
          <div class="rubber-stamp-container">
            <div class="rubber-stamp ${product.stampClass}">
              ${product.stampText}
            </div>
          </div>

          <!-- Footer Signature from reference (e.g. Juno, Emma, Otto) -->
          <div class="back-footer-signature">
            <span class="signature-name">${product.signature}</span>
            <button class="back-action-pill card-flip-trigger" data-id="${product.id}">
              <i data-lucide="image" style="width: 11px; height: 11px;"></i> Photo
            </button>
          </div>

        </div>

      </div>
    </div>
  `;
}

/* ========================================================================
   04. RENDER GALLERY INTO ROWS (INFINITE 3-SET LOOP)
   ======================================================================== */
function renderGallery(filterCategory = 'all') {
  const track1 = document.getElementById('trackRow1');
  const track2 = document.getElementById('trackRow2');

  let row1Products = PRODUCTS.filter(p => p.row === 1);
  let row2Products = PRODUCTS.filter(p => p.row === 2);

  if (filterCategory === 'rack1') {
    row2Products = [];
  } else if (filterCategory === 'rack2') {
    row1Products = [];
  } else if (filterCategory === 'archived') {
    row1Products = row1Products.filter(p => p.initialFlipped || p.category === 'archived');
    row2Products = row2Products.filter(p => p.initialFlipped || p.category === 'archived');
  }

  // Display/hide sections cleanly
  document.getElementById('rackSection1').style.display = row1Products.length ? 'block' : 'none';
  document.getElementById('rackSection2').style.display = row2Products.length ? 'block' : 'none';

  // Duplicate cards 3 times [Set 1, Set 2, Set 3] to create an infinite loop track
  const row1Cards = row1Products.map(p => buildCardHTML(p)).join('');
  const row2Cards = row2Products.map(p => buildCardHTML(p)).join('');

  track1.innerHTML = row1Cards + row1Cards + row1Cards;
  track2.innerHTML = row2Cards + row2Cards + row2Cards;

  const totalCount = row1Products.length + row2Products.length;
  const dockCountEl = document.getElementById('dockSpecimenCount');
  if (dockCountEl) dockCountEl.textContent = `${totalCount} Garments`;

  if (window.lucide) {
    lucide.createIcons();
  }

  // Center initial scroll at the middle set (1/3 of track) so user can drag left or right indefinitely
  setTimeout(() => {
    const slider1 = document.getElementById('scrollRow1');
    const slider2 = document.getElementById('scrollRow2');
    if (slider1 && track1.scrollWidth > 0) {
      slider1.scrollLeft = track1.scrollWidth / 3;
    }
    if (slider2 && track2.scrollWidth > 0) {
      slider2.scrollLeft = track2.scrollWidth / 3;
    }
  }, 50);

  bindCardEvents();
}

/* ========================================================================
   05. AUDIO SYNTHESIS FOR TACTILE HANGER/FLIP SOUNDS
   ======================================================================== */
let soundEnabled = true;
let audioCtx = null;

function playTactileSound(type = 'click') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'flip') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'rail') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.04);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch (e) {
    // audio might be disabled by browser policy
  }
}

/* ========================================================================
   06. INTERACTION LOGIC: FLIP, INSPECT MODAL, CART
   ======================================================================== */
let cart = [];

function bindCardEvents() {
  // 1. Flip Trigger Button (works for any cloned card in the infinite track)
  document.querySelectorAll('.card-flip-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const assembly = btn.closest('.hanger-assembly');
      if (assembly) {
        assembly.classList.toggle('is-flipped');
        playTactileSound('flip');
      }
    });
  });

  // 2. Open Inspection Modal when clicking photo or info area (works for any cloned card)
  document.querySelectorAll('.open-modal-trigger').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const assembly = el.closest('.hanger-assembly');
      const cardId = assembly ? assembly.getAttribute('data-id') : el.getAttribute('data-id');
      const product = PRODUCTS.find(p => p.id === cardId);
      if (product) {
        openProductModal(product);
        playTactileSound('click');
      }
    });
  });

  // 3. Dynamic interactive pendulum swing on mouse move over assembly
  document.querySelectorAll('.hanger-assembly').forEach(assembly => {
    let isHovered = false;
    
    assembly.addEventListener('mouseenter', () => {
      isHovered = true;
      assembly.style.animation = 'none'; // pause css animation to give mouse direct tactile control
      playTactileSound('rail');
    });

    assembly.addEventListener('mousemove', (e) => {
      if (!isHovered) return;
      const rect = assembly.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const deltaX = (e.clientX - centerX) / (rect.width / 2); // -1 to +1
      const swingDeg = (deltaX * 5.5).toFixed(2);
      assembly.style.transform = `rotate(${swingDeg}deg) translateY(2px)`;
    });

    assembly.addEventListener('mouseleave', () => {
      isHovered = false;
      const naturalTilt = assembly.getAttribute('data-tilt');
      let restDeg = '0deg';
      if (naturalTilt === 'left-sm') restDeg = '-1.4deg';
      else if (naturalTilt === 'left-md') restDeg = '-2.3deg';
      else if (naturalTilt === 'right-sm') restDeg = '1.2deg';
      else if (naturalTilt === 'right-md') restDeg = '2.1deg';

      assembly.style.transform = `rotate(${restDeg})`;
      // gently resume subtle ambient swing after 400ms
      setTimeout(() => {
        if (!isHovered) assembly.style.animation = '';
      }, 400);
    });
  });
}

/* Modal handler & Size Visual System */
let currentModalProduct = null;
let currentSelectedSize = 'M';

const SIZE_SPECS = {
  'S': {
    fit: 'Tailored Slim Cut',
    tag: 'Size S · Tailored Slim Fit',
    dims: 'Chest: 38" · Length: 27.5" · Shoulder: 17.5"',
    chest: 'Chest 38"',
    len: 'Length 27.5"',
    imgScale: '0.93',
    meshScale: [0.92, 0.95, 0.90]
  },
  'M': {
    fit: 'Classic Regular Cut',
    tag: 'Size M · Classic Regular Fit',
    dims: 'Chest: 41" · Length: 28.5" · Shoulder: 18.5"',
    chest: 'Chest 41"',
    len: 'Length 28.5"',
    imgScale: '1.00',
    meshScale: [1.00, 1.00, 1.00]
  },
  'L': {
    fit: 'Relaxed Drop Cut',
    tag: 'Size L · Relaxed Drop-Shoulder',
    dims: 'Chest: 44" · Length: 29.5" · Shoulder: 19.5"',
    chest: 'Chest 44"',
    len: 'Length 29.5"',
    imgScale: '1.07',
    meshScale: [1.08, 1.04, 1.06]
  },
  'XL': {
    fit: 'Heavy Boxy Cut',
    tag: 'Size XL · Heavy Boxy Streetwear',
    dims: 'Chest: 47" · Length: 30.5" · Shoulder: 21.0"',
    chest: 'Chest 47"',
    len: 'Length 30.5"',
    imgScale: '1.14',
    meshScale: [1.18, 1.08, 1.14]
  }
};

window.setProductSize = function(size) {
  currentSelectedSize = size;
  const spec = SIZE_SPECS[size] || SIZE_SPECS['M'];

  // 1. Update size buttons UI
  document.querySelectorAll('#modalSizeGrid .size-btn').forEach(btn => {
    const btnSize = btn.getAttribute('data-size') || btn.textContent.trim();
    btn.classList.toggle('active', btnSize === size);
  });

  // 2. Update labels & badges
  const specTag = document.getElementById('modalSizeSpecTag');
  if (specTag) specTag.textContent = spec.tag;

  const dimHint = document.getElementById('sizeDimensionHint');
  if (dimHint) dimHint.textContent = spec.dims;

  const fitBadgeText = document.getElementById('fitBadgeText');
  if (fitBadgeText) fitBadgeText.textContent = `${spec.tag}`;

  const chestEl = document.getElementById('measureChest');
  if (chestEl) chestEl.textContent = spec.chest;

  const lenEl = document.getElementById('measureLen');
  if (lenEl) lenEl.textContent = spec.len;

  // 3. Dynamic visual fit change on 2D Mockup image
  const modalImg = document.getElementById('modalImage');
  if (modalImg) {
    modalImg.style.transform = `scale(${spec.imgScale})`;
    modalImg.classList.remove('is-sizing-change');
    void modalImg.offsetWidth; // force DOM reflow
    modalImg.classList.add('is-sizing-change');
  }

  // 4. Update 3D model scale in Three.js orbit viewer
  if (garmentMeshGroup) {
    garmentMeshGroup.scale.set(spec.meshScale[0], spec.meshScale[1], spec.meshScale[2]);
  }

  playTactileSound('click');
  showToast(`Selected ${spec.tag}`);
};

/* Universal 3D Garment Color Transformation Filter Map */
const COLOR_FILTERS = {
  "#3b49df": "sepia(0.85) saturate(4.2) hue-rotate(185deg) brightness(0.92) contrast(1.1)", // Cobalt Blue
  "#f4f6fa": "grayscale(1) brightness(1.38) contrast(1.12)", // Optical White
  "#7ca4dc": "sepia(0.75) saturate(2.6) hue-rotate(170deg) brightness(1.15) contrast(1.05)", // Sky Oxford
  "#2c4161": "sepia(0.8) saturate(2.8) hue-rotate(180deg) brightness(0.62) contrast(1.2)", // Raw Indigo
  "#2a2c31": "grayscale(1) brightness(0.38) contrast(1.35)", // Washed Charcoal
  "#6e8071": "sepia(0.7) saturate(1.8) hue-rotate(65deg) brightness(0.92) contrast(1.05)", // Faded Sage
  "#b88235": "sepia(0.9) saturate(2.8) hue-rotate(5deg) brightness(1.05) contrast(1.1)", // Ochre Mustard
  "#bfa382": "sepia(0.8) saturate(1.6) hue-rotate(15deg) brightness(1.18) contrast(1.02)", // Sandstone Camel
  "#5a6750": "sepia(0.85) saturate(1.7) hue-rotate(75deg) brightness(0.78) contrast(1.12)", // Safari Olive
  "#ded7c5": "grayscale(0.6) sepia(0.4) brightness(1.22) contrast(1.02)" // Natural Ecru
};

function openProductModal(product) {
  currentModalProduct = product;
  const modalImg = document.getElementById('modalImage');
  modalImg.src = product.image;
  modalImg.style.objectFit = product.fit || 'contain';
  modalImg.style.objectPosition = product.position || 'center 50%';
  modalImg.style.filter = product.filter || 'none';

  const renderBox = document.getElementById('renderViewerContainer');
  if (renderBox) {
    renderBox.style.background = `radial-gradient(circle at 50% 45%, #ffffff 0%, ${(product.hexColor || '#3b49df')}18 60%, #ded8cb 100%)`;
  }

  document.getElementById('modalTitle').textContent = product.title;
  document.getElementById('modalCategory').textContent = product.brandSeries.replace('•▪', '').trim();
  document.getElementById('modalPrice').textContent = `$${product.price}.00`;
  document.getElementById('modalDesc').textContent = 
    `${product.backNote} Woven from ${product.material}. Features precision tailored construction from ${product.specs.origin}.`;

  // Build 3D Color Swatches inside modal
  const swatchesContainer = document.getElementById('modalColorSwatches');
  const palette = [
    { name: "Cobalt Blue", hex: "#3b49df" },
    { name: "Optical White", hex: "#f4f6fa" },
    { name: "Sky Oxford", hex: "#7ca4dc" },
    { name: "Raw Indigo", hex: "#2c4161" },
    { name: "Washed Charcoal", hex: "#2a2c31" },
    { name: "Faded Sage", hex: "#6e8071" },
    { name: "Ochre Mustard", hex: "#b88235" },
    { name: "Sandstone Camel", hex: "#bfa382" },
    { name: "Safari Olive", hex: "#5a6750" },
    { name: "Natural Ecru", hex: "#ded7c5" }
  ];

  const activeColorObj = palette.find(p => p.hex === product.hexColor) || palette[0];
  const colorLabel = document.getElementById('modalActiveColorName');
  if (colorLabel) colorLabel.textContent = activeColorObj.name;

  swatchesContainer.innerHTML = palette.map(c => `
    <div class="color-swatch-circle ${product.hexColor === c.hex ? 'active' : ''}" 
         style="background: ${c.hex};" 
         title="${c.name}" 
         onclick="selectModalColor('${c.hex}', '${c.name}', this)">
    </div>
  `).join('');

  // Reset to Medium size baseline
  setProductSize('M');

  // Open Modal Dialog
  document.getElementById('productModal').classList.add('open');
  if (window.lucide) lucide.createIcons();

  // CRITICAL: 3D Mockup is primary default view!
  switchModalView('render');

  // Pre-initialize / update Three.js 3D viewer in background
  setTimeout(() => {
    init3DViewer();
    if (product.hexColor) update3DModelColor(product.hexColor);
    if (typeof buildProcedural3DGarment === 'function') buildProcedural3DGarment();
  }, 60);
}

window.selectModalColor = function(hex, name, el) {
  document.querySelectorAll('.color-swatch-circle').forEach(s => s.classList.remove('active'));
  if (el) el.classList.add('active');
  const colorLabel = document.getElementById('modalActiveColorName');
  if (colorLabel && name) colorLabel.textContent = name;

  // 1. Visually transform the 3D Dress / T-Shirt Mockup image instantly
  const modalImg = document.getElementById('modalImage');
  if (modalImg) {
    if (currentModalProduct && currentModalProduct.hexColor && currentModalProduct.hexColor.toLowerCase() === hex.toLowerCase()) {
      modalImg.style.filter = currentModalProduct.filter || 'none';
    } else {
      modalImg.style.filter = COLOR_FILTERS[hex] || 'none';
    }
    modalImg.classList.remove('is-sizing-change');
    void modalImg.offsetWidth; // force DOM reflow for animated transition
    modalImg.classList.add('is-sizing-change');
  }

  // 2. Dynamic studio ambient lighting reflection in renderViewerContainer
  const renderBox = document.getElementById('renderViewerContainer');
  if (renderBox) {
    renderBox.style.background = `radial-gradient(circle at 50% 45%, #ffffff 0%, ${hex}18 60%, #ded8cb 100%)`;
  }

  // 3. Update Three.js 3D WebGL Orbit Viewer Material
  update3DModelColor(hex);

  playTactileSound('click');
  showToast(`Applied ${name || hex} 3D Garment Colorway`);
};

function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
  currentModalProduct = null;
}

document.getElementById('closeModalBtn').addEventListener('click', closeProductModal);
document.getElementById('productModal').addEventListener('click', (e) => {
  if (e.target.id === 'productModal') closeProductModal();
});

// Flip modal card back to gallery inspection
document.getElementById('modalFlipCardBtn').addEventListener('click', () => {
  if (!currentModalProduct) return;
  const assembly = document.querySelector(`.hanger-assembly[data-id="${currentModalProduct.id}"]`);
  if (assembly) {
    assembly.classList.add('is-flipped');
  }
  closeProductModal();
  playTactileSound('flip');
  showToast(`Flipped to ${currentModalProduct.title} specifications tag`);
});

// Add to bag from modal
document.getElementById('modalAddBagBtn').addEventListener('click', () => {
  if (!currentModalProduct) return;
  addToBag(currentModalProduct, currentSelectedSize);
  closeProductModal();
});

/* Cart Operations */
function addToBag(product, size = 'M') {
  cart.push({
    id: product.id + '-' + size,
    title: product.title,
    price: product.price,
    size: size,
    image: product.image
  });

  updateCartUI();
  showToast(`Added ${product.title} (Size ${size}) to bag`);
  playTactileSound('click');
}

function updateCartUI() {
  document.getElementById('cartCountBadge').textContent = cart.length;

  const list = document.getElementById('cartItemsList');
  if (cart.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; color: #6b7280; font-size: 13px; padding-top: 40px;">
        Your bag is currently empty.
      </div>`;
    document.getElementById('cartTotalPrice').textContent = `$0.00`;
    return;
  }

  let total = 0;
  list.innerHTML = cart.map((item, index) => {
    total += item.price;
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-details">
          <div>
            <h4 class="cart-item-title">${item.title}</h4>
            <div class="cart-item-meta">Size: ${item.size} · Specimen Tag</div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span class="cart-item-price">$${item.price}.00</span>
            <button onclick="removeCartItem(${index})" style="background: none; border: none; color: #9ca3af; font-size: 11px; cursor: pointer;">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('cartTotalPrice').textContent = `$${total}.00`;
}

window.removeCartItem = function(index) {
  cart.splice(index, 1);
  updateCartUI();
  playTactileSound('click');
};

// Cart Drawer Open/Close
const cartDrawer = document.getElementById('cartDrawer');
document.getElementById('openCartBtn').addEventListener('click', () => {
  cartDrawer.classList.add('open');
  playTactileSound('click');
});

document.getElementById('closeCartBtn').addEventListener('click', () => {
  cartDrawer.classList.remove('open');
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) {
    showToast("Your bag is empty");
    return;
  }
  showToast("Proceeding to secure checkout...");
  setTimeout(() => {
    alert("Thank you for choosing Atelier specimens. Checkout prototype completed.");
  }, 350);
});

/* Category Filtering */
document.querySelectorAll('#categoryFilters .filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#categoryFilters .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.getAttribute('data-category');
    renderGallery(cat);
    playTactileSound('click');
  });
});

/* Flip All Tags toggle */
let allFlipped = false;
document.getElementById('flipAllBtn').addEventListener('click', () => {
  allFlipped = !allFlipped;
  document.querySelectorAll('.hanger-assembly').forEach(assembly => {
    if (allFlipped) {
      assembly.classList.add('is-flipped');
    } else {
      assembly.classList.remove('is-flipped');
    }
  });
  playTactileSound('flip');
  showToast(allFlipped ? "Flipped all tags to backside specifications" : "Flipped all tags to garment photography");
});

/* Sound Toggle (if element present) */
const soundToggleEl = document.getElementById('soundToggleBtn');
if (soundToggleEl) {
  soundToggleEl.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    const sLabel = document.getElementById('soundLabel');
    if (sLabel) sLabel.textContent = soundEnabled ? 'Sound: On' : 'Sound: Off';
    const sIcon = document.getElementById('soundIcon');
    if (sIcon) sIcon.setAttribute('data-lucide', soundEnabled ? 'volume-2' : 'volume-x');
    if (window.lucide) lucide.createIcons();
    showToast(soundEnabled ? "Audio feedback enabled" : "Audio muted");
  });
}

/* Center Rails (if element present) */
const resetSwingEl = document.getElementById('resetSwingBtn');
if (resetSwingEl) {
  resetSwingEl.addEventListener('click', () => {
    const slider1 = document.getElementById('scrollRow1');
    const slider2 = document.getElementById('scrollRow2');
    const track1 = document.getElementById('trackRow1');
    const track2 = document.getElementById('trackRow2');
    if (slider1 && track1) slider1.scrollTo({ left: track1.scrollWidth / 3, behavior: 'smooth' });
    if (slider2 && track2) slider2.scrollTo({ left: track2.scrollWidth / 3, behavior: 'smooth' });
    showToast("Hanger rails centered in infinite loop");
    playTactileSound('rail');
  });
}

/* Toast Helper */
function showToast(msg) {
  const toast = document.getElementById('toastNotice');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

/* Glide Navigation helper for rail arrow buttons with infinite wrap */
window.glideRail = function(rowId, delta) {
  const slider = document.getElementById(rowId);
  const track = slider ? slider.querySelector('.cards-flex-track') : null;
  if (slider && track) {
    slider.scrollBy({ left: delta, behavior: 'smooth' });
    playTactileSound('rail');
    setTimeout(() => {
      checkInfiniteWrap(slider, track);
    }, 360);
  }
};

function checkInfiniteWrap(slider, track) {
  const setWidth = track.scrollWidth / 3;
  if (setWidth <= 20) return;
  if (slider.scrollLeft >= setWidth * 2 - 10) {
    slider.scrollLeft -= setWidth;
  } else if (slider.scrollLeft <= 10) {
    slider.scrollLeft += setWidth;
  }
}

/* ========================================================================
   07. HIGH-PRECISION INFINITE KINETIC LOOP MOUSE DRAG SCROLL SYSTEM
   ======================================================================== */
function enableKineticDragScroll(slider) {
  const track = slider.querySelector('.cards-flex-track');
  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let hasDragged = false;
  let velX = 0;
  let lastX = 0;
  let lastTime = 0;
  let animId = null;

  function wrapInfinite() {
    if (!track) return;
    const setWidth = track.scrollWidth / 3;
    if (setWidth <= 20) return;
    if (slider.scrollLeft >= setWidth * 2 - 10) {
      slider.scrollLeft -= setWidth;
      if (isDown) startScrollLeft -= setWidth;
    } else if (slider.scrollLeft <= 10) {
      slider.scrollLeft += setWidth;
      if (isDown) startScrollLeft += setWidth;
    }
  }

  // Continuous wrap check on native scroll or mouse wheel
  slider.addEventListener('scroll', () => {
    if (!isDown) {
      wrapInfinite();
    }
  });

  // Mouse wheel horizontal translation with infinite wrap
  slider.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      slider.scrollLeft += e.deltaY * 0.95;
      wrapInfinite();
    }
  }, { passive: false });

  slider.addEventListener('mousedown', (e) => {
    cancelAnimationFrame(animId);
    isDown = true;
    hasDragged = false;
    startX = e.pageX;
    startScrollLeft = slider.scrollLeft;
    lastX = e.pageX;
    lastTime = performance.now();
    velX = 0;

    slider.classList.add('is-active-drag');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;

    const delta = (e.pageX - startX) * 1.35;
    const dist = Math.abs(e.pageX - startX);

    if (dist > 5) {
      hasDragged = true;
      slider.classList.add('dragging-now');
    }

    slider.scrollLeft = startScrollLeft - delta;
    wrapInfinite();

    const now = performance.now();
    const dt = now - lastTime;
    if (dt > 10) {
      velX = (e.pageX - lastX) / dt;
      lastX = e.pageX;
      lastTime = now;
    }
  });

  window.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    slider.classList.remove('is-active-drag');

    // Coasting momentum physics with seamless infinite wrap
    if (hasDragged && Math.abs(velX) > 0.1) {
      let momentum = velX * 18;
      function coast() {
        if (Math.abs(momentum) < 0.35) {
          slider.classList.remove('dragging-now');
          return;
        }
        slider.scrollLeft -= momentum;
        wrapInfinite();
        momentum *= 0.93; // kinetic decay friction
        animId = requestAnimationFrame(coast);
      }
      animId = requestAnimationFrame(coast);
    } else {
      setTimeout(() => {
        slider.classList.remove('dragging-now');
      }, 40);
    }
  });

  // Capture phase click blocker: prevents accidental clicks while dragging
  slider.addEventListener('click', (e) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }, true);
}

enableKineticDragScroll(document.getElementById('scrollRow1'));
enableKineticDragScroll(document.getElementById('scrollRow2'));

/* ========================================================================
   08. AMBIENT INFINITE CONVEYOR LOOP (Auto-Glide drift)
   ======================================================================== */
let autoGlideActive = true;
let autoGlideAnimId = null;

function runAutoGlideLoop() {
  const slider1 = document.getElementById('scrollRow1');
  const slider2 = document.getElementById('scrollRow2');
  const track1 = document.getElementById('trackRow1');
  const track2 = document.getElementById('trackRow2');

  function tick() {
    if (autoGlideActive) {
      // Slide Row 1 gently right-to-left
      if (slider1 && track1 && !slider1.classList.contains('is-active-drag') && !slider1.matches(':hover')) {
        slider1.scrollLeft += 0.45;
        const setWidth1 = track1.scrollWidth / 3;
        if (setWidth1 > 20 && slider1.scrollLeft >= setWidth1 * 2 - 10) {
          slider1.scrollLeft -= setWidth1;
        }
      }

      // Slide Row 2 gently right-to-left
      if (slider2 && track2 && !slider2.classList.contains('is-active-drag') && !slider2.matches(':hover')) {
        slider2.scrollLeft += 0.40;
        const setWidth2 = track2.scrollWidth / 3;
        if (setWidth2 > 20 && slider2.scrollLeft >= setWidth2 * 2 - 10) {
          slider2.scrollLeft -= setWidth2;
        }
      }
    }
    autoGlideAnimId = requestAnimationFrame(tick);
  }
  autoGlideAnimId = requestAnimationFrame(tick);
}

// Toggle button for Auto-Loop
const loopBtn = document.getElementById('loopAutoGlideBtn');
if (loopBtn) {
  loopBtn.addEventListener('click', () => {
    autoGlideActive = !autoGlideActive;
    document.getElementById('glideLabel').textContent = autoGlideActive ? 'Auto-Loop: On' : 'Auto-Loop: Off';
    document.getElementById('glideIcon').setAttribute('data-lucide', autoGlideActive ? 'pause' : 'play');
    if (window.lucide) lucide.createIcons();
    showToast(autoGlideActive ? "Infinite auto-glide active" : "Auto-glide paused (manual drag only)");
  });
}

// Start auto glide loop
runAutoGlideLoop();

// Keyboard escape closes modals
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal();
    cartDrawer.classList.remove('open');
  }
});

/* ========================================================================
   09. THREE.JS INTERACTIVE 3D GARMENT MODEL SIMULATOR
   ======================================================================== */
let threeScene, threeCamera, threeRenderer, threeControls;
let garmentMeshGroup = null;
let garmentMaterial = null;
let current3DColor = "#3b49df";
let isThreeInitialized = false;

function init3DViewer() {
  const container = document.getElementById('webglViewerContainer');
  const canvas = document.getElementById('garment3dCanvas');
  if (!container || !canvas || isThreeInitialized) return;

  const width = container.clientWidth || 380;
  const height = container.clientHeight || 380;

  threeScene = new THREE.Scene();
  threeCamera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  threeCamera.position.set(2.4, 1.1, 4.0); // 3/4 Perspective Angle matching the reference image

  threeRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  threeRenderer.setSize(width, height);
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  threeRenderer.toneMappingExposure = 1.15;
  threeRenderer.shadowMap.enabled = true;

  // Orbit controls for interactive 360 drag rotation
  if (THREE.OrbitControls) {
    threeControls = new THREE.OrbitControls(threeCamera, canvas);
    threeControls.enableDamping = true;
    threeControls.dampingFactor = 0.08;
    threeControls.maxPolarAngle = Math.PI / 2 + 0.2;
    threeControls.minDistance = 2.2;
    threeControls.maxDistance = 6.5;
  }

  // Studio Lighting matching upscale apparel mockups
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  threeScene.add(ambientLight);

  // Key light from top front
  const keyLight = new THREE.DirectionalLight(0xfff6ea, 1.3);
  keyLight.position.set(3, 5, 4);
  threeScene.add(keyLight);

  // Soft blue fill light
  const fillLight = new THREE.DirectionalLight(0xaaccff, 0.65);
  fillLight.position.set(-4, 2, -2);
  threeScene.add(fillLight);

  // Back rim light for 3D silhouette definition
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.85);
  rimLight.position.set(0, 4, -4);
  threeScene.add(rimLight);

  // Build 3D Garment Mesh Group
  buildProcedural3DGarment();

  // Animation loop
  function animate3D() {
    requestAnimationFrame(animate3D);
    if (threeControls) threeControls.update();
    if (threeRenderer && threeScene && threeCamera) {
      threeRenderer.render(threeScene, threeCamera);
    }
  }
  animate3D();

  isThreeInitialized = true;
}

function buildProcedural3DGarment() {
  if (!threeScene) return;
  if (garmentMeshGroup) threeScene.remove(garmentMeshGroup);
  garmentMeshGroup = new THREE.Group();

  const isShirt = currentModalProduct && currentModalProduct.row === 1;

  // 1. Physically Based Studio Garment Fabric Material
  garmentMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(current3DColor),
    roughness: 0.82,
    metalness: 0.04,
    side: THREE.DoubleSide
  });

  // Tonal accent material for trims, placket, and collar
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(current3DColor).multiplyScalar(0.92),
    roughness: 0.78,
    metalness: 0.05,
    side: THREE.DoubleSide
  });

  // Mother-of-pearl buttons material
  const pearlMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.22,
    metalness: 0.35
  });

  // Deep interior throat dark shadow material
  const throatMaterial = new THREE.MeshBasicMaterial({
    color: 0x0c0e12,
    side: THREE.DoubleSide
  });

  // -----------------------------------------------------------------
  // A. ANATOMICAL TORSO LOFTED MESH (Realistic shoulder slope & chest)
  // -----------------------------------------------------------------
  const rings = [
    // [baseY, widthX, depthZ, shoulderDipFactor, chestBulge]
    [0.96,  0.42, 0.32, 0.00, 0.00], // Neck opening
    [0.92,  0.58, 0.36, 0.04, 0.02], // Trapezius line
    [0.86,  0.82, 0.42, 0.10, 0.04], // Mid shoulder slope
    [0.78,  1.08, 0.46, 0.18, 0.07], // Shoulder point / deltoid
    [0.66,  1.18, 0.49, 0.22, 0.09], // Armscye top
    [0.50,  1.12, 0.52, 0.18, 0.10], // Armpit / chest high
    [0.32,  1.06, 0.53, 0.12, 0.10], // Pectoral line
    [0.10,  1.00, 0.51, 0.06, 0.08], // Lower chest
    [-0.15, 0.95, 0.47, 0.00, 0.04], // Upper waist
    [-0.40, 0.92, 0.45, 0.00, 0.02], // Natural waist taper
    [-0.65, 0.93, 0.46, 0.00, 0.02], // Lower waist
    [-0.90, 0.96, 0.48, 0.00, 0.02], // High hip
    [-1.12, 0.99, 0.50, 0.00, 0.02], // Low hip
    [-1.23, 1.00, 0.51, 0.00, 0.01], // Hem outer edge
    [-1.25, 0.97, 0.48, 0.00, 0.00]  // Hem fold-in edge
  ];

  const radialSegments = 36;
  const vertices = [];
  const indices = [];
  const uvs = [];

  for (let r = 0; r < rings.length; r++) {
    const [baseY, wx, wz, dipFactor, chestBulge] = rings[r];
    const v = r / (rings.length - 1);

    for (let s = 0; s <= radialSegments; s++) {
      const u = s / radialSegments;
      const angle = u * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const x = cosA * wx;
      let z = sinA * wz;

      // Natural anatomical forward chest projection
      if (sinA > 0) {
        z += Math.sin(angle) * chestBulge;
      }

      // Natural shoulder drape dip towards outer shoulders
      const dip = Math.pow(Math.abs(cosA), 1.8) * dipFactor;
      const y = baseY - dip;

      vertices.push(x, y, z);
      uvs.push(u, v);
    }
  }

  for (let r = 0; r < rings.length - 1; r++) {
    for (let s = 0; s < radialSegments; s++) {
      const p1 = r * (radialSegments + 1) + s;
      const p2 = (r + 1) * (radialSegments + 1) + s;
      const p3 = (r + 1) * (radialSegments + 1) + (s + 1);
      const p4 = r * (radialSegments + 1) + (s + 1);

      indices.push(p1, p2, p4);
      indices.push(p2, p3, p4);
    }
  }

  const torsoGeo = new THREE.BufferGeometry();
  torsoGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  torsoGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  torsoGeo.setIndex(indices);
  torsoGeo.computeVertexNormals();

  const torsoMesh = new THREE.Mesh(torsoGeo, garmentMaterial);
  torsoMesh.castShadow = true;
  torsoMesh.receiveShadow = true;
  garmentMeshGroup.add(torsoMesh);

  // -----------------------------------------------------------------
  // B. NATURAL DRAPED SLEEVES (Seamless Shoulder Integration)
  // -----------------------------------------------------------------
  function createAnatomicalSleeve(isRight) {
    const sleeveGroup = new THREE.Group();
    const sRings = isShirt ? 8 : 5;
    const sLen = isShirt ? 1.35 : 0.72;
    const sVerts = [];
    const sIndices = [];
    const sUvs = [];
    const sRad = 24;

    for (let r = 0; r < sRings; r++) {
      const t = r / (sRings - 1);
      const curY = -t * sLen;
      const rx = (0.37 - t * 0.08);
      const rz = (0.31 - t * 0.06);

      for (let s = 0; s <= sRad; s++) {
        const u = s / sRad;
        const angle = u * Math.PI * 2;
        const sx = Math.cos(angle) * rx;
        const sz = Math.sin(angle) * rz;

        sVerts.push(sx, curY, sz);
        sUvs.push(u, t);
      }
    }

    for (let r = 0; r < sRings - 1; r++) {
      for (let s = 0; s < sRad; s++) {
        const p1 = r * (sRad + 1) + s;
        const p2 = (r + 1) * (sRad + 1) + s;
        const p3 = (r + 1) * (sRad + 1) + (s + 1);
        const p4 = r * (sRad + 1) + (s + 1);

        sIndices.push(p1, p2, p4);
        sIndices.push(p2, p3, p4);
      }
    }

    const sleeveGeo = new THREE.BufferGeometry();
    sleeveGeo.setAttribute('position', new THREE.Float32BufferAttribute(sVerts, 3));
    sleeveGeo.setAttribute('uv', new THREE.Float32BufferAttribute(sUvs, 2));
    sleeveGeo.setIndex(sIndices);
    sleeveGeo.computeVertexNormals();

    const sleeveMesh = new THREE.Mesh(sleeveGeo, garmentMaterial);
    sleeveMesh.castShadow = true;
    sleeveGroup.add(sleeveMesh);

    // Folded turned cuff band
    const cuffRadius = 0.30 - (isShirt ? 0.05 : 0.03);
    const cuffGeo = new THREE.CylinderGeometry(cuffRadius, cuffRadius * 1.02, 0.08, 24, 1, true);
    const cuffMesh = new THREE.Mesh(cuffGeo, accentMaterial);
    cuffMesh.position.y = -sLen;
    sleeveGroup.add(cuffMesh);

    // Position and tilt sleeve naturally
    const sideSign = isRight ? 1 : -1;
    sleeveGroup.position.set(sideSign * 1.10, 0.62, 0.02);
    sleeveGroup.rotation.z = -sideSign * (Math.PI / 3.2); // 56 deg natural drop
    sleeveGroup.rotation.x = 0.12; // forward posture cant

    return sleeveGroup;
  }

  garmentMeshGroup.add(createAnatomicalSleeve(true));
  garmentMeshGroup.add(createAnatomicalSleeve(false));

  // -----------------------------------------------------------------
  // C. COLLAR, PLACKET & SPECIFIC DETAILS (Shirt vs T-Shirt)
  // -----------------------------------------------------------------
  if (isShirt) {
    // 1. Center button placket band
    const placketGeo = new THREE.BoxGeometry(0.12, 2.22, 0.04);
    const placketMesh = new THREE.Mesh(placketGeo, accentMaterial);
    placketMesh.position.set(0, -0.15, 0.52);
    garmentMeshGroup.add(placketMesh);

    // 2. Mother-of-pearl buttons
    for (let b = 0; b < 6; b++) {
      const btnGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.012, 16);
      btnGeo.rotateX(Math.PI / 2);
      const btnMesh = new THREE.Mesh(btnGeo, pearlMaterial);
      btnMesh.position.set(0, 0.70 - b * 0.32, 0.545);
      garmentMeshGroup.add(btnMesh);
    }

    // 3. Dress Shirt Collar Stand & Lapels
    const collarStandGeo = new THREE.CylinderGeometry(0.42, 0.45, 0.14, 32, 1, true);
    collarStandGeo.scale(1.0, 1.0, 0.82);
    const collarStand = new THREE.Mesh(collarStandGeo, accentMaterial);
    collarStand.position.set(0, 0.96, 0.02);
    collarStand.rotation.x = 0.14;
    garmentMeshGroup.add(collarStand);

    // Left & Right collar point lapels
    const flapShape = new THREE.Shape();
    flapShape.moveTo(0, 0);
    flapShape.lineTo(0.24, -0.26);
    flapShape.lineTo(0.12, -0.30);
    flapShape.lineTo(-0.04, -0.05);
    flapShape.closePath();

    const flapGeo = new THREE.ExtrudeGeometry(flapShape, { depth: 0.02, bevelEnabled: false });

    const leftFlap = new THREE.Mesh(flapGeo, accentMaterial);
    leftFlap.position.set(-0.24, 0.94, 0.34);
    leftFlap.rotation.set(0.32, 0.34, -0.2);
    garmentMeshGroup.add(leftFlap);

    const rightFlap = new THREE.Mesh(flapGeo, accentMaterial);
    rightFlap.position.set(0.24, 0.94, 0.34);
    rightFlap.rotation.set(0.32, -0.34, 0.2);
    rightFlap.scale.x = -1;
    garmentMeshGroup.add(rightFlap);

  } else {
    // T-SHIRT DETAILS
    // 1. Ribbed Crew Collar Torus
    const collarGeo = new THREE.TorusGeometry(0.42, 0.048, 16, 36);
    collarGeo.rotateX(Math.PI / 2);
    collarGeo.scale(1.0, 1.0, 0.84);
    const collarMesh = new THREE.Mesh(collarGeo, accentMaterial);
    collarMesh.position.set(0, 0.93, 0.02);
    collarMesh.rotation.x = 0.18; // angled forward with neck slope
    garmentMeshGroup.add(collarMesh);

    // 2. Dark inner throat interior
    const throatGeo = new THREE.CircleGeometry(0.38, 24);
    throatGeo.rotateX(-Math.PI / 2);
    throatGeo.scale(1.0, 0.82, 1.0);
    const throatMesh = new THREE.Mesh(throatGeo, throatMaterial);
    throatMesh.position.set(0, 0.89, 0.02);
    garmentMeshGroup.add(throatMesh);
  }

  // -----------------------------------------------------------------
  // D. STUDIO GROUND CONTACT SHADOW
  // -----------------------------------------------------------------
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const sCtx = shadowCanvas.getContext('2d');
  const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
  sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.60)');
  sGrad.addColorStop(0.35, 'rgba(0, 0, 0, 0.30)');
  sGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.08)');
  sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  sCtx.fillStyle = sGrad;
  sCtx.fillRect(0, 0, 256, 256);

  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeo = new THREE.PlaneGeometry(3.6, 2.2);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.85,
    depthWrite: false
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(0, -1.48, 0.1);
  garmentMeshGroup.add(shadowMesh);

  // Apply currently active size scale
  const spec = SIZE_SPECS[currentSelectedSize] || SIZE_SPECS['M'];
  garmentMeshGroup.scale.set(spec.meshScale[0], spec.meshScale[1], spec.meshScale[2]);

  threeScene.add(garmentMeshGroup);
}

// Camera preset switcher
window.set3dCamera = function(view) {
  if (!threeCamera || !threeControls) return;
  document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.getElementById('camBtn' + view.charAt(0).toUpperCase() + view.slice(1));
  if (activeBtn) activeBtn.classList.add('active');

  if (view === 'perspective') {
    threeCamera.position.set(2.4, 1.1, 4.0); // 3/4 perspective matching user reference
  } else if (view === 'front') {
    threeCamera.position.set(0, 0.1, 4.5);
  } else if (view === 'side') {
    threeCamera.position.set(4.5, 0.1, 0);
  } else if (view === 'back') {
    threeCamera.position.set(0, 0.1, -4.5);
  }
  threeControls.target.set(0, 0, 0);
  playTactileSound('click');
};

// Mode Switcher: 3D Orbit View vs Studio Render
window.switchModalView = function(mode) {
  const webglBox = document.getElementById('webglViewerContainer');
  const renderBox = document.getElementById('renderViewerContainer');
  const btn3D = document.getElementById('viewMode3D');
  const btnRender = document.getElementById('viewModeRender');

  if (mode === '3d') {
    webglBox.style.display = 'flex';
    renderBox.style.display = 'none';
    btn3D.classList.add('active');
    btnRender.classList.remove('active');
    if (threeControls) threeControls.update();
  } else {
    webglBox.style.display = 'none';
    renderBox.style.display = 'flex';
    btn3D.classList.remove('active');
    btnRender.classList.add('active');
  }
  playTactileSound('click');
};

// Update 3D Model Material Color in real time
function update3DModelColor(hex) {
  current3DColor = hex;
  if (garmentMaterial) {
    garmentMaterial.color.set(hex);
  }
}

/* Initial execution */
renderGallery('all');

console.log("Atelier - Hanging Product Card Gallery (Infinite Loop) Initialized.");
