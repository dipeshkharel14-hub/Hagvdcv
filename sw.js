/* ===================================================================
 SailVlog & Dare System - PWA Service Worker (sw.js)
 Dedicated to Dipesh Kharel
 This file provides offline caching of the core app files.
===================================================================
*/

// Define the current cache name. 
// Change 'v1' whenever you make major changes to html/css/js 
// to force clients to update their cache.
const CACHE_NAME = 'sailvlog-cache-v1';

// These are the specific files that will work offline.
// NOTE: Make sure these filenames match your actual files exactly.
const FILES_TO_CACHE = [
  '/',                     // index.html root
  '/index.html',           // duplicates help some browsers
  '/login.html',
  '/dashboard.html',
  '/style.css',            // if you have one, or inline Tailwind is fine
  '/script.js',            // main logic
  '/firebase.js',          // your Firebase config
  '/manifest.json'         // PWA config
];

// --- INSTALL EVENT ---
// Pre-caches the core application shell upon first visit.
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation Started.');
  // Wait until the caching operation is complete.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell...');
      // addAll will fail if *any* single file path doesn't exist.
      return cache.addAll(FILES_TO_CACHE);
    }).then(() => {
      // Skips the 'waiting' room and forces activation immediately.
      return self.skipWaiting();
    })
  );
});


// --- ACTIVATE EVENT ---
// Cleans up old caches from previous versions.
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation complete.');
  event.waitUntil(
    // Get all cache keys currently stored.
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          // If the key doesn't match the *current* CACHE_NAME, delete it.
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Reclaim clients immediately to start intercepting requests.
  return self.clients.claim();
});


// --- FETCH EVENT ---
// Serves cached content if offline, otherwise fetches from network.
self.addEventListener('fetch', (event) => {
  // Ignore external API calls (like Firebase auth/firestore), as they
  // manage their own internal JS SDK caching and require real-time data.
  if (event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('firebaseio.com') ||
      event.request.url.includes('googleapis.com')) {
    return; // Don't intercept these requests
  }

  // Intercept other requests (HTML, local JS, local CSS).
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 1. Return the cached version if found (OFFLINE MODE).
      if (response) {
        console.log(`[Service Worker] Serving from cache: ${event.request.url}`);
        return response;
      }
      // 2. Otherwise, fetch from the network (ONLINE MODE).
      console.log(`[Service Worker] Fetching from network: ${event.request.url}`);
      return fetch(event.request);
    }).catch(() => {
      // If BOTH fail (e.g., trying to load a page offline that wasn't cached), 
      // you can provide a custom offline.html fallback here if you wish.
      console.log('[Service Worker] Fetch failed, resource unavailable.');
  (h1)login info >login info< (/h1)
                (h2)intro >intro<(/h2)  })
  );
});
