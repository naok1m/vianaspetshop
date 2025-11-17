// Service Worker - Viana's Pet Shop
// Versão 1.0.0

const CACHE_NAME = 'viana-pet-shop-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/modal-notifications.css',
  '/js/script.js',
  '/assets/logo.png',
  '/assets/hero-pet.jpg',
  '/assets/about-us.jpg',
  // Adicione outras URLs importantes aqui
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Instalar Service Worker
self.addEventListener('install', function(event) {
  console.log('Service Worker: Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.log('Service Worker: Erro ao fazer cache', error);
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activate');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Removendo cache antigo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch - Estratégia Cache First para recursos estáticos
self.addEventListener('fetch', function(event) {
  // Apenas interceptar requests GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorar requests para extensões do Chrome
  if (event.request.url.includes('extension://')) {
    return;
  }

  // Ignorar requests para analytics e outros serviços externos
  if (event.request.url.includes('google-analytics.com') || 
      event.request.url.includes('googletagmanager.com') ||
      event.request.url.includes('facebook.com') ||
      event.request.url.includes('doubleclick.net')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - retornar resposta do cache
        if (response) {
          console.log('Service Worker: Servindo do cache', event.request.url);
          return response;
        }

        // Clonar request porque é um stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Verificar se recebemos uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar resposta porque é um stream
            const responseToCache = response.clone();

            // Adicionar recursos importantes ao cache dinamicamente
            if (event.request.url.includes('.jpg') || 
                event.request.url.includes('.png') || 
                event.request.url.includes('.css') || 
                event.request.url.includes('.js')) {
              
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          }
        ).catch(function() {
          // Fallback para quando estiver offline
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
          
          // Fallback para imagens
          if (event.request.destination === 'image') {
            return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Imagem não disponível</text></svg>', 
              { headers: { 'Content-Type': 'image/svg+xml' } });
          }
        });
      })
  );
});

// Sync em segundo plano
self.addEventListener('sync', function(event) {
  console.log('Service Worker: Background Sync', event.tag);
  
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

// Função para sincronizar formulário de contato offline
function syncContactForm() {
  return new Promise(function(resolve) {
    // Aqui você pode implementar lógica para enviar
    // formulários que foram salvos quando offline
    console.log('Service Worker: Sincronizando formulário de contato');
    resolve();
  });
}

// Push notifications (para futuras implementações)
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/assets/logo.png',
      badge: '/assets/logo.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Click em notificação
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Limpeza de cache quando necessário
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(function() {
        console.log('Service Worker: Cache limpo');
        return self.skipWaiting();
      })
    );
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Log de erros
self.addEventListener('error', function(event) {
  console.error('Service Worker: Erro', event.error);
});

// Log de rejeições de promise
self.addEventListener('unhandledrejection', function(event) {
  console.error('Service Worker: Promise rejeitada', event.reason);
});

console.log('Service Worker: Carregado com sucesso - ' + CACHE_NAME);