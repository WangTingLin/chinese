/* 中文研究室 Service Worker v1 */
const CACHE = 'csl-v1';
const PRECACHE = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/logo.svg',
];

/* 安裝：預快取靜態資源 */
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
  );
});

/* 啟動：清除舊快取 */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* 攔截請求：network-first（API/CDN），stale-while-revalidate（靜態） */
self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  /* Sanity API / CDN — 永遠 network first，不快取 */
  if (url.hostname.includes('sanity.io') || url.hostname.includes('cdn.sanity.io')) {
    e.respondWith(fetch(request));
    return;
  }

  /* Google Fonts — stale-while-revalidate */
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    e.respondWith(
      caches.open(CACHE).then(async cache => {
        const cached = await cache.match(request);
        const fresh = fetch(request).then(res => { cache.put(request, res.clone()); return res; });
        return cached || fresh;
      })
    );
    return;
  }

  /* 自有靜態資源 — cache first */
  if (request.method === 'GET') {
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          if (res.ok && url.origin === self.location.origin) {
            caches.open(CACHE).then(c => c.put(request, res.clone()));
          }
          return res;
        }).catch(() => cached);
      })
    );
  }
});
