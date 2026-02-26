// Service Worker - ترانيم PWA
const CACHE_NAME = 'traneem-v1.0.0';
const STATIC_CACHE = 'traneem-static-v1';
const DYNAMIC_CACHE = 'traneem-dynamic-v1';

// الملفات الأساسية التي تُكاش عند التثبيت
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// مصادر خارجية مهمة نكاشها
const EXTERNAL_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap',
];

// ===== التثبيت =====
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    Promise.all([
      // كاش الملفات الداخلية
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.warn('[SW] Some static assets failed to cache:', err);
        });
      }),
      // كاش المصادر الخارجية
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return Promise.allSettled(
          EXTERNAL_ASSETS.map((url) =>
            fetch(url).then((res) => {
              if (res.ok) cache.put(url, res);
            }).catch(() => {})
          )
        );
      }),
    ]).then(() => {
      console.log('[SW] Installation complete');
      return self.skipWaiting();
    })
  );
});

// ===== التفعيل =====
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      return self.clients.claim();
    })
  );
});

// ===== الاعتراض على الطلبات =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تجاهل طلبات غير HTTP
  if (!request.url.startsWith('http')) return;

  // تجاهل طلبات esm.sh (React) - نستخدم الشبكة أولاً ثم الكاش
  if (url.hostname === 'esm.sh') {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // الخطوط والمصادر الخارجية - الكاش أولاً
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com' ||
    url.hostname === 'cdn.tailwindcss.com' ||
    url.hostname === 'images.unsplash.com'
  ) {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
    return;
  }

  // الملفات الداخلية - الكاش أولاً
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // أي طلب آخر - الشبكة أولاً
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// ===== استراتيجية: الكاش أولاً =====
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok && response.status < 400) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // إذا فشلت الشبكة، حاول الكاش مرة أخرى
    const fallback = await cache.match('/index.html');
    return fallback || new Response('Offline - يرجى الاتصال بالإنترنت أولاً', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

// ===== استراتيجية: الشبكة أولاً =====
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    return cached || new Response('', { status: 503 });
  }
}
