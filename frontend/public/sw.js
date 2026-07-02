self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('kigezimade-v1').then((cache) => cache.addAll(['/', '/manifest.json', '/favicon.svg'])))
  self.skipWaiting()
})

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request)),
  )
})
