// Enhanced Service Worker for Yoga Flow University PWA
const CACHE_NAME = 'yoga-flow-v3'; // Increment version for fresh caches
const STATIC_CACHE_URLS = [
  '/',
  '/dashboard',
  '/poses',
  '/flows/create',
  '/meditation',
  '/manual',
  '/offline',
  '/manifest.webmanifest',
];

// Simplified cache patterns - less aggressive caching for better crawler access
const CACHE_PATTERNS = {
  poses: /\/api\/poses/,
  flows: /\/api\/flows/,
  images: /\.(png|jpg|jpeg|svg|gif|webp)$/,
  fonts: /\.(woff|woff2|ttf|eot)$/,
  api: /\/api\//,
  static: /\/_next\/static\//
};

// Simplified cache strategies - prioritize network for fresh content
const CACHE_STRATEGIES = {
  poses: 'network-first', // Network first for fresh data
  flows: 'network-first',
  images: 'cache-first', // Cache first for static assets
  fonts: 'cache-first',
  api: 'network-first', // Always try network first for API calls
  static: 'cache-first' // Static assets can be cached
};
  images: 'cache-first', // Cache first, fallback to network
  fonts: 'cache-first',
  api: 'network-first', // Network first, fallback to cache
  static: 'cache-first'
};

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

// Helper function to determine cache strategy
function getCacheStrategy(url) {
  for (const [pattern, strategy] of Object.entries(CACHE_PATTERNS)) {
    if (strategy.test && strategy.test(url)) {
      return CACHE_STRATEGIES[pattern];
    }
  }
  return 'network-first'; // Default strategy
}

// Helper function for cache-first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  if (networkResponse.status === 200) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}

// Helper function for network-first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }
    throw error;
  }
}

// Helper function for stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  // Update cache in background
  const fetchPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      const cache = caches.open(CACHE_NAME);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  });
  
  // Return cached version immediately, or wait for network
  return cachedResponse || fetchPromise;
}

// Fetch event - crawler-friendly caching strategies
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  const url = event.request.url;
  const userAgent = event.request.headers.get('user-agent') || '';
  
  // Bypass service worker for crawlers to ensure they get fresh content
  const isCrawler = /googlebot|adsbot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quoraagent|outbrainampfetcher|co2vap1/i.test(userAgent);
  
  if (isCrawler) {
    // Let crawlers bypass service worker completely
    return;
  }
  
  // Skip critical SEO files - let them pass through to ensure crawler access
  if (url.includes('/robots.txt') || 
      url.includes('/ads.txt') || 
      url.includes('/sitemap.xml') ||
      url.includes('/manifest.webmanifest')) {
    return;
  }
  
  // Determine strategy based on URL patterns
  let strategy = 'network-first';
  
  if (CACHE_PATTERNS.poses.test(url)) strategy = CACHE_STRATEGIES.poses;
  else if (CACHE_PATTERNS.flows.test(url)) strategy = CACHE_STRATEGIES.flows;
  else if (CACHE_PATTERNS.images.test(url)) strategy = CACHE_STRATEGIES.images;
  else if (CACHE_PATTERNS.fonts.test(url)) strategy = CACHE_STRATEGIES.fonts;
  else if (CACHE_PATTERNS.static.test(url)) strategy = CACHE_STRATEGIES.static;
  else if (CACHE_PATTERNS.api.test(url)) strategy = CACHE_STRATEGIES.api;
  
  // Apply the appropriate strategy
  event.respondWith(
    (async () => {
      try {
        switch (strategy) {
          case 'cache-first':
            return await cacheFirst(event.request);
          case 'network-first':
            return await networkFirst(event.request);
          case 'stale-while-revalidate':
            return await staleWhileRevalidate(event.request);
          default:
            return await networkFirst(event.request);
        }
      } catch (error) {
        console.error('Service Worker: Fetch failed', error);
        
        // For navigation requests, return offline page
        if (event.request.mode === 'navigate') {
          return caches.match('/offline');
        }
        
        // For other requests, return a basic error response
        return new Response('Service Unavailable', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      }
    })()
  );
});

// Message event - handle commands from main thread
self.addEventListener('message', (event) => {
  if (event.data.type === 'CACHE_POSE_DATA') {
    // Cache pose data for offline access
    caches.open(CACHE_NAME).then(cache => {
      const poses = event.data.poses;
      poses.forEach(pose => {
        // Cache pose images
        if (pose.thumbnail_url) {
          cache.add(pose.thumbnail_url).catch(() => {});
        }
        if (pose.image_url) {
          cache.add(pose.image_url).catch(() => {});
        }
      });
    });
  }
  
  if (event.data.type === 'CACHE_FLOW_DATA') {
    // Cache flow data for offline access
    caches.open(CACHE_NAME).then(cache => {
      const flows = event.data.flows;
      flows.forEach(flow => {
        // Cache flow-related images
        if (flow.thumbnail) {
          cache.add(flow.thumbnail).catch(() => {});
        }
      });
    });
  }
  
  if (event.data.type === 'GET_CACHE_STATUS') {
    // Return cache status to main thread
    caches.open(CACHE_NAME).then(cache => {
      return cache.keys();
    }).then(keys => {
      event.ports[0].postMessage({
        type: 'CACHE_STATUS',
        cachedUrls: keys.map(request => request.url),
        count: keys.length
      });
    });
  }
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