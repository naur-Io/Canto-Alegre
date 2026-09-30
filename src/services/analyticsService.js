/**
 * Servico de Telemetria e Analytics do Canto Alegre
 * Offline-first: registra acessos e interacoes locais no localStorage
 * e encaminha eventos ao Google Analytics (GA4) se disponível.
 */

const STORAGE_KEY = 'cantoalegre_telemetry_v1';

const getInitialData = () => ({
  totalPageViews: 0,
  pageViews: {},
  events: {},
  firstSession: new Date().toISOString(),
  lastActive: new Date().toISOString(),
});

const loadTelemetry = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialData();
    const data = JSON.parse(raw);
    return {
      totalPageViews: data.totalPageViews || 0,
      pageViews: data.pageViews || {},
      events: data.events || {},
      firstSession: data.firstSession || new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
  } catch (e) {
    return getInitialData();
  }
};

const saveTelemetry = (data) => {
  try {
    data.lastActive = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Falha silenciosa no localStorage
  }
};

export const analyticsService = {
  /**
   * Inicializa o rastreamento da sessao
   */
  initAnalytics() {
    const data = loadTelemetry();
    saveTelemetry(data);
  },

  /**
   * Rastreia a visualizacao de uma tela/pagina
   * @param {string} pageName 
   */
  trackPageView(pageName = 'Jardim') {
    const data = loadTelemetry();
    data.totalPageViews = (data.totalPageViews || 0) + 1;
    data.pageViews[pageName] = (data.pageViews[pageName] || 0) + 1;
    saveTelemetry(data);

    // Integracao com GA4 se window.gtag existir
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', { page_title: pageName });
    }
  },

  /**
   * Rastreia a interacao com um botao ou recurso
   * @param {string} category 
   * @param {string} action 
   * @param {string} label 
   */
  trackEvent(category, action, label = '') {
    const data = loadTelemetry();
    const eventKey = label ? `${category}: ${action} (${label})` : `${category}: ${action}`;
    data.events[eventKey] = (data.events[eventKey] || 0) + 1;
    saveTelemetry(data);

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
      });
    }
  },

  /**
   * Retorna um resumo estruturado para o painel de estatisticas da UI
   */
  getAnalyticsSummary() {
    const data = loadTelemetry();
    
    // Converter eventos em lista ordenada por cliques
    const sortedEvents = Object.entries(data.events || {})
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const sortedPageViews = Object.entries(data.pageViews || {})
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const totalClicks = sortedEvents.reduce((acc, curr) => acc + curr.count, 0);

    return {
      totalPageViews: data.totalPageViews || 0,
      totalClicks,
      firstSession: data.firstSession,
      lastActive: data.lastActive,
      topEvents: sortedEvents.slice(0, 5),
      pageViewsList: sortedPageViews,
    };
  },

  /**
   * Reseta os dados de telemetria locais
   */
  resetAnalytics() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }
};
