const CACHE_NAME = 'enterprise-erp-v2';
const urlsToCache = [
    '/frontend/',
    '/frontend/index.html',
    '/frontend/login.html',
    '/frontend/404.html',
    '/frontend/assets/css/app.css',
    '/frontend/assets/css/theme.css',
    '/frontend/assets/css/light.css',
    '/frontend/assets/css/dark.css',
    '/frontend/assets/js/loader.js',
    '/frontend/assets/js/router.js',
    '/frontend/assets/js/storage.js',
    '/frontend/assets/js/database.js',
    '/frontend/assets/js/auth.js',
    '/frontend/assets/js/language.js',
    '/frontend/assets/js/theme.js',
    '/frontend/assets/js/constants.js',
    '/frontend/assets/js/utils.js',
    '/frontend/assets/vendor/chart.min.js',
    '/frontend/assets/vendor/dayjs.min.js',
    '/frontend/manifest.json',
    '/frontend/favicon.ico'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Enterprise ERP Cache opened');
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
                        console.log('Deleting old cache:', cacheName);
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