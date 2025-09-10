// Basic Service Worker for Yoga Flow University PWA
const CACHE_NAME = 'yoga-flow-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/dashboard',
  '/poses',
  '/flows/create',
  '/meditation',
  '/manual',
  '/offline',
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching essential resources');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline, update cache in background
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          // Update cache in background for next time
          fetch(event.request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseClone);
                  });
              }
            })
            .catch(() => {
              // Network error - cached version is still good
            });
          
          return cachedResponse;
        }
        
        // Try network first for new requests
        return fetch(event.request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            // Network failed - show offline page for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/offline');
            }
            // For other resources, just fail
            throw new Error('Network failed and no cache available');
          });
      })
  );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'meditation-session') {
    event.waitUntil(
      // TODO: Sync completed meditation sessions with server
      syncMeditationSessions()
    );
  }
  
  if (event.tag === 'practice-data') {
    event.waitUntil(
      // TODO: Sync practice data with server
      syncPracticeData()
    );
  }
});

// Push notifications for meditation reminders
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Time for your daily practice 🧘‍♀️',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: 'meditation-reminder',
      renotify: true,
      requireInteraction: false,
      actions: [
        {
          action: 'start-meditation',
          title: 'Start Meditation',
          icon: '/icons/action-meditation.png'
        },
        {
          action: 'dismiss',
          title: 'Later',
          icon: '/icons/action-dismiss.png'
        }
      ],
      data: {
        url: '/meditation',
        timestamp: Date.now()
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Yoga Flow Reminder',
        options
      )
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();
  
  if (event.action === 'start-meditation') {
    event.waitUntil(
      clients.openWindow('/meditation')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});

// Helper functions for background sync
async function syncMeditationSessions() {
  // TODO: Implement meditation session sync
  console.log('Syncing meditation sessions...');
  try {
    // Get stored sessions from IndexedDB
    // Send to server API
    // Clear local storage on success
    return Promise.resolve();
  } catch (error) {
    console.error('Failed to sync meditation sessions:', error);
    throw error;
  }
}

async function syncPracticeData() {
  // TODO: Implement practice data sync
  console.log('Syncing practice data...');
  try {
    // Get stored practice data from IndexedDB
    // Send to server API
    // Clear local storage on success
    return Promise.resolve();
  } catch (error) {
    console.error('Failed to sync practice data:', error);
    throw error;
  }
}