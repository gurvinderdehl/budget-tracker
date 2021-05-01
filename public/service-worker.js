console.log("Hello Service Worker");

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/index.js",
    "/styles.css",
    "/db.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/manifest.json"
];
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

//Installing my app
self.addEventListener('install', function (event) {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(FILES_TO_CACHE);
            })
    );
    self.skipWaiting();
});
//Activating the app with function below:
self.addEventListener('activate', function (event) {

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (CACHE_NAME.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});


//This is fetching the app
self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
  
          return fetch(event.request).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              var responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });