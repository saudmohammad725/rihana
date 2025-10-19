import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration.scope)
        
        // Check for updates every 60 seconds
        setInterval(() => {
          registration.update()
        }, 60000)
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          console.log('🔄 Service Worker update found!')
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated' && !navigator.serviceWorker.controller) {
              console.log('✅ Service Worker activated!')
            }
          })
        })
      })
      .catch((error) => {
        console.log('❌ Service Worker registration failed:', error)
      })
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

