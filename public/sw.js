const CACHE_NAME = 'canto-alegre-v1';
const RUNTIME_CACHE = 'canto-alegre-runtime-v1';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/about.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon.svg',
  '/icons/favicon-64.png',
  '/icons/apple-touch-icon.png'
];

// Install: Pré-armazena em cache a casca do app (App Shell)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('[SW] Falha ao pré-carregar cache:', err))
  );
});

// Activate: Limpa caches antigos e assume o controle imediatamente
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
    }).then((cachesToDelete) => {
      return Promise.all(cachesToDelete.map((cacheToDelete) => caches.delete(cacheToDelete)));
    }).then(() => self.clients.claim())
  );
});

// Fetch: Estratégia de cache inteligente
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar extensões do navegador ou esquemas não-http
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 1. Chamadas à API Gemini (Google AI Studio)
  if (url.hostname.includes('generativelanguage.googleapis.com')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            error: {
              code: 503,
              message: 'Você está offline. O Canto Alegre está no modo sem internet; use a simulação botânica ou conecte-se para usar a IA Gemini em tempo real.',
              status: 'UNAVAILABLE'
            }
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
    return;
  }

  // 2. Requisição de Navegação HTML (SPA App Shell)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Salva uma cópia atualizada
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match('/index.html');
          return fallback || Response.error();
        })
    );
    return;
  }

  // 3. Recursos Estáticos e Imagens (Cache First, Network Fallback)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Revalida em background para recursos locais
        if (url.origin === self.location.origin) {
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          }).catch(() => {/* offline, mantém cache */});
        }
        return cachedResponse;
      }

      // Se não está no cache, busca na rede e salva no runtime cache
      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          const targetCache = (url.origin === self.location.origin) ? CACHE_NAME : RUNTIME_CACHE;
          caches.open(targetCache).then((cache) => {
            cache.put(request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Se for imagem e falhou, retorna ícone padrão se disponível
          if (request.destination === 'image') {
            return caches.match('/icons/icon-192.png');
          }
          return Response.error();
        });
    })
  );
});

// Listener para receber comandos como skipWaiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
