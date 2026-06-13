const CACHE_NAME = 'milano-bellaka-v1';
const STATIC_ASSETS = [
  '/images/logo.png',
  '/images/calligraphy_light.png',
  '/images/calligraphy_red.png',
  '/offline',
];

// Install Service Worker and cache core static shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA Service Worker: Pre-caching static app shell...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker and prune old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('PWA Service Worker: Removing deprecated cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch events interceptor
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // CRITICAL RULE: Do not cache or intercept owner dashboard requests
  if (requestUrl.pathname.startsWith('/dashboard')) {
    return;
  }

  // Network-First (with cache fallback) strategy for customer pages
  if (event.request.mode === 'navigate' || requestUrl.pathname.startsWith('/menu')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Put copy of response in cache if it's successful
          if (response.status === 200) {
            const responseCopy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseCopy);
            });
          }
          return response;
        })
        .catch(() => {
          // If offline, check cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If the specific menu page is not cached, return the offline fallback shell page
            return caches.match('/offline');
          });
        })
    );
    return;
  }

  // Cache-First (with network fallback) strategy for static resources (CSS, JS, Fonts, Images)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Cache next assets, css, js, fonts dynamically
        if (
          response.status === 200 &&
          (requestUrl.pathname.startsWith('/_next') ||
            requestUrl.pathname.includes('/images/') ||
            event.request.destination === 'font')
        ) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseCopy);
          });
        }
        return response;
      });
    })
  );
});
