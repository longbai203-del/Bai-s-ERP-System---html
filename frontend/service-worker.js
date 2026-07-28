const CACHE_NAME = 'enterprise-erp-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/login.html',
    '/404.html',
    '/assets/css/app.css',
    '/assets/css/theme.css',
    '/assets/css/light.css',
    '/assets/css/dark.css',
    '/assets/css/rtl.css',
    '/assets/css/print.css',
    '/assets/js/app.js',
    '/assets/js/loader.js',
    '/assets/js/router.js',
    '/assets/js/storage.js',
    '/assets/js/database.js',
    '/assets/js/auth.js',
    '/assets/js/language.js',
    '/assets/js/theme.js',
    '/assets/js/constants.js',
    '/assets/js/utils.js',
    '/assets/vendor/chart.min.js',
    '/assets/vendor/dayjs.min.js',
    '/manifest.json',
    '/favicon.ico'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Cache opened');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(function(response) {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    var responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                });
            })
    );
});
