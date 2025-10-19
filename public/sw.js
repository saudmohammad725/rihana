// Service Worker for PWA
const CACHE_NAME = 'rihana-v3'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/iconapp/android_mdpi.png',
  '/iconapp/android_hdpi.png',
  '/iconapp/android_xhdpi.png',
  '/iconapp/android_xxhdpi.png',
  '/iconapp/android_xxxhdpi.png',
  '/iconapp/ios_1024.png'
]

// Install event - skip waiting to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Service Worker installed - cache opened')
        return cache.addAll(urlsToCache).catch(err => {
          console.log('❌ Failed to cache some files:', err)
        })
      })
  )
})

// Fetch event - improved strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip caching for API requests
  if (url.pathname.includes('/api/')) {
    return
  }

  // Skip caching for chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return
  }

  // For navigation requests (HTML pages), use Network First strategy
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response before caching
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache)
          })
          return response
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request)
        })
    )
    return
  }

  // For JS/CSS files, use Network First strategy
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone and cache the response
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache)
          })
          return response
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request)
        })
    )
    return
  }

  // For other requests (images, fonts), use Cache First strategy
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(request).then(response => {
          // Clone and cache the response
          if (response.status === 200) {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache)
            })
          }
          return response
        })
      })
      .catch((error) => {
        console.log('Fetch failed:', error)
      })
  )
})

// Activate event - take control immediately
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all([
        // Delete old caches
        ...cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('🗑️ Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        }),
        // Take control of all clients immediately
        self.clients.claim()
      ])
    }).then(() => {
      console.log('✅ Service Worker activated and took control')
    })
  )
})

