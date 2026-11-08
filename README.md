# Atelier — Men's Shirting E-commerce

A static fashion e-commerce site for **Atelier**: considered shirting and heavyweight tees.

## Experience

1. **Preloader** — ivory fog lifts, the *Atelier* wordmark resolves letter by letter, and models emerge at different depths before the wordmark flies into the logo.
2. **Lookbook hero** — one look per slide: oversized category word, model, and the product he wears. Drag / swipe, arrow keys, dots and autoplay.
3. **Explore Collection** — a curtain transition into the product racks.
4. **Product racks** — draggable hanging cards (All / Shirts / T-Shirts), flip tags, product popup with 3D viewer, and a bag drawer.
5. **Footer** — links, back to top.

## Run locally

No build step. Open `e-comerce.html` with VS Code **Live Server** (recommended, so the local fonts load), or any static server:

```bash
npx serve .
```

## Structure

```
e-comerce.html          main page
index.html              redirects to e-comerce.html (for GitHub Pages)
assets/
  css/  style.css · preloader.css · lookbook.css · collection.css
  js/   products.js · main.js · preloader.js · lookbook.js
  fonts/  Bodoni Moda (OFL)
  images/ models and product cutouts
```

Built with plain HTML, CSS and JavaScript (Three.js and Lucide icons from CDN).
