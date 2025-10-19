// Service Worker for PWA
const CACHE_NAME = 'rihana-v2'
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

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip caching for API requests
  if (event.request.url.includes('/api/')) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response
        }
        return fetch(event.request)
      })
      .catch((error) => {
        console.log('Fetch failed; returning offline page instead.', error)
      })
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

