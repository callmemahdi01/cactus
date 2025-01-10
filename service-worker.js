const CACHE_NAME = 'gpa-calculator-cache-v1.2';
const urlsToCache = [
  '/cactus/',
  '/cactus/index.html',
  '/cactus/style/styles.css',
  '/cactus/style/light.css',
  '/cactus/style/dark.css',
  '/cactus/style/reset.css',
  '/cactus/script.js',
  '/cactus/fonts/Vazirmatn-font-face.css',
  '/cactus/img/cactus-512x512.png',
  '/cactus/img/cactus-192x192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if we have it
        if (response) {
          return response;
        }

        // Otherwise try network
        return fetch(event.request)
          .then(networkResponse => {
            // Check if valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Cache new responses for later
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            // If network fails, return from cache if available
            return caches.match(event.request);
          });
      })
  );
});

// حذف کش‌ها در زمان آنلاین شدن
self.addEventListener('online', () => {
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      caches.delete(cacheName); // حذف تمام کش‌ها
    });
  });
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
