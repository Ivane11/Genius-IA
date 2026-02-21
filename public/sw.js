// Genius AI - Service Worker PWA
// Conçu par Ivane Beranger Kouassi - EBuni Studio Medical Digital Solution

const CACHE_NAME = 'genius-ai-v1.0.0';
const STATIC_CACHE = 'genius-ai-static-v1.0.0';
const DYNAMIC_CACHE = 'genius-ai-dynamic-v1.0.0';

// Fichiers statiques à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icon-72x72.png',
  '/icon-96x96.png',
  '/icon-128x128.png',
  '/icon-144x144.png',
  '/icon-152x152.png',
  '/icon-192x192.png',
  '/icon-384x384.png',
  '/icon-512x512.png',
  '/LOGO.png'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🚀 Genius AI PWA - Installation en cours...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Mise en cache des fichiers statiques...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Installation terminée');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Erreur d\'installation:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('🔄 Genius AI PWA - Activation...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Suppression de l\'ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Activation terminée');
        return self.clients.claim();
      })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Stratégie de cache selon le type de requête
  if (request.method === 'GET') {
    // Requêtes statiques - Cache First
    if (isStaticAsset(request.url)) {
      event.respondWith(cacheFirst(request));
      return;
    }
    
    // Requêtes API - Network First avec fallback
    if (isAPIRequest(request.url)) {
      event.respondWith(networkFirst(request));
      return;
    }
    
    // Requêtes de navigation - Cache First avec fallback réseau
    if (request.mode === 'navigate') {
      event.respondWith(navigationFallback(request));
      return;
    }
    
    // Autres requêtes - Network First
    event.respondWith(networkFirst(request));
  }
});

// Vérifier si c'est un asset statique
function isStaticAsset(url) {
  return STATIC_ASSETS.includes(url) || 
         url.includes('/assets/') ||
         url.includes('/icon-') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.jpeg') ||
         url.includes('.svg') ||
         url.includes('.css') ||
         url.includes('.js') ||
         url.includes('.woff') ||
         url.includes('.woff2');
}

// Vérifier si c'est une requête API
function isAPIRequest(url) {
  return url.includes('/functions/') || 
         url.includes('supabase') ||
         url.includes('api.openai.com') ||
         url.includes('generativelanguage.googleapis.com');
}

// Stratégie Cache First
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📦 Servi depuis le cache:', request.url);
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('❌ Erreur Cache First:', error);
    return new Response('Hors ligne', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Stratégie Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('🔄 Fallback vers le cache pour:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Page hors ligne personnalisée
    if (request.mode === 'navigate') {
      return caches.match('/index.html');
    }
    
    return new Response('Hors ligne', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Stratégie de navigation avec fallback
async function navigationFallback(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('🔄 Navigation fallback vers cache');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback vers la page principale
    return caches.match('/index.html');
  }
}

// Gestion des messages (pour la mise à jour du cache)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    updateCache();
  }
});

// Mise à jour manuelle du cache
async function updateCache() {
  try {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(STATIC_ASSETS);
    console.log('🔄 Cache mis à jour manuellement');
  } catch (error) {
    console.error('❌ Erreur mise à jour cache:', error);
  }
}

// Background Sync pour les requêtes échouées
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('🔄 Background sync en cours...');
  // Implémenter la logique de synchronisation ici
}

// Push Notifications (optionnel)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-96x96.png',
      vibrate: [200, 100, 200],
      data: data.url,
      actions: [
        {
          action: 'open',
          title: 'Ouvrir Genius AI'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Gestion du clic sur notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    );
  }
});

console.log('🚀 Genius AI PWA - Service Worker chargé');
