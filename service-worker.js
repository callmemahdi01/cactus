const CACHE_NAME = 'gpa-calculator-cache-v1';
const urlsToCache = [
  '/cactus/',
  '/cactus/index.html',
  '/cactus/style.css',
  '/cactus/script.js',
  '/cactus/reset.css',
  '/cactus/Vazirmatn-font-face.css',
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
    fetch(event.request)
      .then(response => {
        // اگر پاسخ معتبر باشد، آن را در کش ذخیره می‌کنیم
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // اگر اتصال به اینترنت وجود نداشته باشد، از کش استفاده می‌کنیم
        return caches.match(event.request);
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
