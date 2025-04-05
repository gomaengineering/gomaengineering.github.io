// Service Worker for Goma Engineering Consultation website
// This service worker handles caching and offline functionality
// It also responds to cache clearing requests from the main page
const CACHE_NAME = 'goma-engineering-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/Pages/aboutus.html',
  '/Pages/services.html',
  '/Pages/contactus.html',
  '/Pages/calculator.html',
  '/Pages/privacypolicy.html',
  '/Pages/tos.html',
  '/Stylesheets/variables.css',
  '/Stylesheets/main.css',
  '/Stylesheets/custom-classes.css',
  '/Stylesheets/subpage.css',
  '/Stylesheets/contactus.css',
  '/Scripts/navbar.js',
  '/Scripts/back-to-top.js',
  '/Scripts/theme-switcher.js',
  '/Scripts/cache-manager.js',
  '/Scripts/preloader.js',
  '/Assets/goma-engineering-logo.png',
  '/Assets/goma-ec.png',
  '/Assets/about-us.jpg',
  '/Assets/building1.jpg',
  '/Assets/building2.jpg',
  '/Assets/building3.jpg'
];

// Install the service worker and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Activate immediately
  self.skipWaiting();
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Check for no-cache parameter
  const url = new URL(event.request.url);
  if (url.searchParams.has('no-cache')) {
    // Skip cache for requests with no-cache parameter
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response as it's a stream and can only be consumed once
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
      .catch(() => {
        // If both the cache and network fail, show a generic fallback
        if (event.request.url.indexOf('.html') > -1) {
          return caches.match('/offline.html');
        }
      })
  );
});

// Update the cache when new service worker is activated
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
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Listen for messages from the main page
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'clearCache') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            return caches.delete(cacheName);
          })
        ).then(() => {
          // Respond that the cache is cleared
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({ status: 'Cache cleared' });
          }
        });
      })
    );
  }
}); 