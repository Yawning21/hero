const CACHE_NAME = 'scentify-shell-v1';
const OFFLINE_URL = '/offline.html';
const ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/src/css/base.css',
  '/src/css/layout.css',
  '/src/css/components.css',
  '/src/css/utilities.css',
  '/src/css/responsive.css',
  '/src/js/app.js',
  '/src/js/state.js',
  '/src/js/storage.js',
  '/src/js/products.js',
  '/src/js/auth.js',
  '/src/js/cart.js',
  '/src/js/search.js',
  '/src/js/router.js',
  '/src/js/ui.js',
  '/offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then(cacheResponse => cacheResponse || caches.match(OFFLINE_URL)))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cacheResponse => {
      if (cacheResponse) {
        return cacheResponse;
      }
      return fetch(event.request)
        .then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL));
    })
  );
});
