/* Service Worker · Tarot Companion
   Mantiene la app funcional sin conexión (propuesta de valor central).
   Estrategias por tipo de asset:
     HTML / JS / CSS / JSON  → network-first (datos frescos; cae a caché offline)
     Imágenes / Fuentes      → cache-first  (estáticos; se cachean on-demand)
   La shell se precachea en install. Las imágenes de cartas se cachean la primera
   vez que se ven (cache-first). `skipWaiting` + `clients.claim` = actualización limpia.

   IMPORTANTE: subir CACHE_VERSION en cada deploy para invalidar el caché viejo. */

const CACHE_VERSION = "tarot-companion-v6";

// Shell mínima a precachear. El precaché es TOLERANTE (ver install): un asset que
// falte —p. ej. los íconos PNG hasta que se suban— no aborta la instalación.
const SHELL = [
  "./",
  "index.html",
  "manifest.json",
  // CSS (orden de carga real)
  "css/fonts.css",
  "css/tokens.css",
  "css/themes/cereza.css",
  "css/layout.css",
  "css/components.css",
  "css/themes/base.css",
  "css/themes/rws.css",
  // JS (ES modules)
  "js/app.js",
  "js/router.js",
  "js/store.js",
  "js/deck.js",
  "js/sheet.js",
  "js/scroll-lock.js",
  "js/decks-ui.js",
  "js/settings.js",
  "js/spreads.js",
  "js/numerology.js",
  "js/uso.js",
  "js/simbolos.js",
  "js/moon.js",
  "js/i18n.js",
  "js/strings.js",
  // Datos
  "data/arcana-pure.json",
  "data/decks/index.json",
  "data/decks/rws.json",
  "data/decks/yokai.json",
  // Íconos (pueden no existir aún; el precaché tolera el fallo)
  "icons/icon-192.png",
  "icons/icon-512.png",
  // Fuentes auto-hospedadas (16 woff2, subsets latin + latin-ext)
  "assets/fonts/mulish-400-latin.woff2",
  "assets/fonts/mulish-400-latin-ext.woff2",
  "assets/fonts/mulish-500-latin.woff2",
  "assets/fonts/mulish-500-latin-ext.woff2",
  "assets/fonts/mulish-600-latin.woff2",
  "assets/fonts/mulish-600-latin-ext.woff2",
  "assets/fonts/mulish-700-latin.woff2",
  "assets/fonts/mulish-700-latin-ext.woff2",
  "assets/fonts/spectral-400-latin.woff2",
  "assets/fonts/spectral-400-latin-ext.woff2",
  "assets/fonts/spectral-400i-latin.woff2",
  "assets/fonts/spectral-400i-latin-ext.woff2",
  "assets/fonts/spectral-500-latin.woff2",
  "assets/fonts/spectral-500-latin-ext.woff2",
  "assets/fonts/spectral-600-latin.woff2",
  "assets/fonts/spectral-600-latin-ext.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_VERSION);
      // cache.addAll falla en bloque si UN asset 404; añadimos uno por uno y
      // toleramos fallos para no romper el install (íconos aún ausentes, etc.).
      await Promise.all(SHELL.map((url) => cache.add(url).catch(() => {})));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

const isImage = (url) => /\.(?:jpe?g|png|webp|gif|svg)$/i.test(url.pathname);
const isFont = (url) => /\.(?:woff2?|ttf|otf)$/i.test(url.pathname);

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // sin CDN externos; dejar pasar

  if (isImage(url) || isFont(url)) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

// Cache-first: ideal para assets estáticos que no cambian (arte de cartas, fuentes).
async function cacheFirst(req) {
  const cache = await caches.open(CACHE_VERSION);
  const hit = await cache.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return hit || Response.error();
  }
}

// Network-first: código y datos frescos cuando hay red; caché como respaldo offline.
async function networkFirst(req) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    const hit = await cache.match(req);
    if (hit) return hit;
    // Para navegaciones offline (start_url, deep links), servir la shell.
    if (req.mode === "navigate") {
      return (await cache.match("index.html")) || (await cache.match("./")) || Response.error();
    }
    return Response.error();
  }
}
