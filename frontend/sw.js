// Service Worker - PWA 离线缓存
const CACHE_NAME = 'bais-erp-v1.0.0';
const ASSETS = [
    '/',
    '/index.html',
    '/login.html',
    '/register.html',
    '/404.html',
    '/config.js',
    '/manifest.json',
    '/css/common.css',
    '/js/supabase.js',
    '/js/auth.js',
    '/js/db.js',
    '/js/common.js',
    '/js/permissions.js',
    '/js/storage.js',
    '/js/bootstrap.js',
    '/js/router.js',
    '/js/i18n.js',
    '/js/notifications.js',
    '/js/modal.js',
    '/js/table.js'
];

// 安装
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// 激活
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// 拦截请求 - 优先使用缓存，回退到网络
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) return response;
                return fetch(event.request).then(response => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        if (event.request.method === 'GET') {
                            cache.put(event.request, responseClone);
                        }
                    });
                    return response;
                });
            })
            .catch(() => {
                // 离线时返回 404 页面
                return caches.match('/404.html');
            })
    );
});