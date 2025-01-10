const CACHE_NAME = 'gpa-calculator-cache-v1.2';
const urlsToCache = [
  '/cactus/',
  '/cactus/index.html',
  '/cactus/offline.html',
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
        // Return cached response if found
        if (response) {
          return response;
        }

        // Otherwise try to fetch from network
        return fetch(event.request)
          .then(networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response
            const responseToCache = networkResponse.clone();

            // Add it to cache for later
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            // If both cache and network fail, try to return a fallback page
            return caches.match('/cactus/offline.html');
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
