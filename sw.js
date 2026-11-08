// Guarda la página en la tablet para que abra sin internet.
const CACHE = 'qsl8000-v3';
const ARCHIVOS = ['./', './index.html', './indicativos.js', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // Apps Script va directo a la red
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => {
      const red = fetch(e.request).then(r => {
        if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); }
        return r;
      }).catch(() => hit);
      return hit || red;
    })
  );
});
