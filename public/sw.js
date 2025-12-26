const CACHE_NAME = 'todo-app-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// 安装并缓存资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 离线时尝试从缓存读取
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});