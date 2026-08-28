/**
 * NATO Alphabet — offline service worker.
 * App-shell strategy so the reference works with no signal (planes, elevators,
 * bad reception during a call). Bump CACHE when shipping new assets.
 */
const CACHE = "nato-v3";
const CORE = [
  "/spell",
  "/spell/practice",
  "/spell/install",
  "/spell/help",
  "/spell/manifest.webmanifest",
  "/spell/icons/icon-192.png",
  "/spell/icons/icon-512.png",
  "/spell/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE)).catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first, fall back to cached shell when offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() =>
          caches.match(request).then((c) => c || caches.match("/spell")),
        ),
    );
    return;
  }

  // Static assets: cache-first, then network, and populate the cache.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request)
          .then((res) => {
            if (res.ok && res.type === "basic") {
              const copy = res.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return res;
          })
          .catch(() => cached),
    ),
  );
});
