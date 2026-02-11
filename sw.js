
const CACHE_NAME = 'equistudy-v1';
const ASSETS = [
  '/Equine/',
  '/Equine/index.html',
  '/Equine/data/questions.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
