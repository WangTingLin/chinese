import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Workbox precache（vite-plugin-pwa 注入）
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Runtime cache
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new CacheFirst({ cacheName: 'google-fonts-cache', plugins: [new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 })] })
);
registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({ cacheName: 'gstatic-fonts-cache', plugins: [new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 24 * 60 * 60 })] })
);
registerRoute(
  ({ url }) => url.hostname.endsWith('.apicdn.sanity.io'),
  new NetworkFirst({ cacheName: 'sanity-api-cache', plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 })] })
);

// ── Web Push 處理 ──
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data = {};
  try { data = event.data.json(); } catch { data = { title: '中文研究室', body: event.data.text() }; }

  const title = data.title || '中文研究室';
  const options = {
    body: data.body || '',
    icon: '/logo.svg',
    badge: '/logo.svg',
    tag: 'activity-reminder',
    renotify: true,
    data: { url: data.url || '/' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
