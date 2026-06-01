const CACHE_NAME = 'corazon-elite-v2.7';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Instalación del Service Worker y guardado en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Interceptar peticiones para funcionar offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el recurso desde la caché si existe, si no, lo busca en la red
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Limpieza de cachés antiguas al actualizar la app
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});