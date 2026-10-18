// Excelsior Financial Manager application shell. No personal financial records are cached here.
const CACHE_NAME = 'excelsior-pwa-v6-1';
const APP_SHELL = [
  './', './index.html', './manifest.webmanifest', './army-star-logo.png',
  './backup.js', './pin-lock.js', './firebase-config.js', './cloud-sync.js', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './favicon-32.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    // Network-first for new HTML revisions, fall back to previously cached app shell offline.
    if (req.mode === 'navigate') {
      event.respondWith(fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy)); }
        return res;
      }).catch(() => caches.match('./index.html')));
    } else {
      event.respondWith(caches.match(req).then(cached => cached || fetch(req)));
    }
  } else if (url.hostname === 'cdn.jsdelivr.net' && url.pathname.startsWith('/npm/chart.js')) {
    // Cache Chart.js after online loading so charts can continue to render offline.
    event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE_NAME).then(cache => cache.put(req, copy)); }
      return res;
    })));
  }
});
