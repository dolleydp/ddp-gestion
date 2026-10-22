const CACHE = 'ddp-gestion-v1';
const FICHIERS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(clés =>
    Promise.all(clés.filter(c => c !== CACHE).map(c => caches.delete(c)))
  ));
  self.clients.claim();
});

// Hors connexion : on sert la copie enregistrée, sinon le réseau
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
