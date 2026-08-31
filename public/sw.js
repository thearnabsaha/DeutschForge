const CACHE_VERSION = 'moinmoin-v6';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const PRECACHE_ASSETS = [
  '/',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512-maskable.png',
  '/apple-touch-icon.png',
  '/apple-touch-icon-precomposed.png',
  '/favicon.ico',
  '/favicon.svg',
  '/manifest.json',
  '/dashboard',
  '/vocabulary',
  '/practice',
  '/practice/words',
  '/practice/listening',
  '/practice/expressions',
  '/grammar',
  '/chat',
  '/exam',
  '/settings',
];

// Install: pre-cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-caching warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old versioned caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Helper: timeout promise
function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Network timeout')), ms)
  );
}

// Fetch: optimized caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // 1. API routes: Network-first (never cache mutated data in SW)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 2. Next.js static bundles, scripts, stylesheets, fonts, icons: Cache-First (Instant load)
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Stale-while-revalidate in background
          fetch(request)
            .then((res) => {
              if (res && res.status === 200) {
                const copy = res.clone();
                caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
              }
            })
            .catch(() => {});
          return cached;
        }

        return fetch(request).then((res) => {
          if (!res || res.status !== 200) return res;
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
          return res;
        });
      })
    );
    return;
  }

  // 3. Navigation HTML pages: Fast Stale-While-Revalidate with 1.5s network timeout
  if (request.mode === 'navigate') {
    event.respondWith(
      Promise.race([
        fetch(request)
          .then((res) => {
            if (res && res.status === 200) {
              const copy = res.clone();
              caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
            }
            return res;
          })
          .catch(() => caches.match(request)),
        timeout(1500),
      ]).catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          return caches.match('/');
        });
      })
    );
  }
});
