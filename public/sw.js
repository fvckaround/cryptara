const CACHE_NAME = "cryptara-static-v1";
const STATIC_ASSETS = [
  "/icon-192.png",
  "/icon-512.png",
  "/favicon-32.png",
  "/favicon-16.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never intercept API calls or non-GET requests — always go to the
  // network so account data, balances, and admin actions are never
  // served stale from a cache.
  if (
    request.method !== "GET" ||
    url.pathname.startsWith("/api/") ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // Only serve cached responses for the specific static assets we
  // cached on install. Everything else (pages, data) goes to the
  // network as normal.
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});