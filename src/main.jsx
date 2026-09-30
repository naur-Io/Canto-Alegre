import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Registro de Service Worker apenas em producao para evitar cache stale no dev server (localhost)
if ('serviceWorker' in navigator) {
  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );

  if (import.meta.env.PROD && !isLocalhost) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('[Canto Alegre PWA] Service Worker ativo:', registration.scope);
        })
        .catch((error) => {
          console.warn('[Canto Alegre PWA] Falha no registro do Service Worker:', error);
        });
    });
  } else if (isLocalhost) {
    // No ambiente de desenvolvimento local, desregistra Service Workers antigos para garantir reload limpo
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    }).catch(() => {});
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
