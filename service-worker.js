const CACHE_NAME = 'preventive-maintenance-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/manifest.webmanifest',
    '/icon192.png',
    '/icon512.png',
    // Tambahkan file lain yang perlu di-cache seperti CSS, JS, dll
];

// Install event: caching files saat install service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
    self.skipWaiting();
});

// Activate event: cleanup versi versi cache lama jika ada
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Fetch event: intercept request dan serve dari cache jika ada, atau fallback ke network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) return cachedResponse;
            return fetch(event.request);
        })
    );
});
