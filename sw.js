/* Service Worker · Yōkai Tarot
   Guarda una copia de la app para que funcione sin conexión.
   Si actualizas index.html, sube también este archivo cambiando
   el número de versión de CACHE (ej. v1 -> v2) para refrescar el caché. */

const CACHE = "yokai-tarot-v1";
const ASSETS = [
  "./",
  "./index.html"
];

// Instalación: guarda los archivos en caché.
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activación: borra cachés viejos de versiones anteriores.
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Estrategia: red primero, y si no hay internet, usa la copia guardada.
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(
          cached => cached || caches.match("./index.html")
        )
      )
  );
});
