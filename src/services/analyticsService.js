/**
 * Servico de Telemetria e Analytics do Canto Alegre
 * Rastreamento silencioso em segundo plano de visualizacoes de pagina e cliques
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
    if (typeof localStorage === 'undefined') return getInitialData();
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
    if (typeof localStorage === 'undefined') return;
    data.lastActive = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Falha silenciosa no localStorage
  }
};

export const analyticsService = {
  /**
   * Inicializa o rastreamento da sessao de forma segura
   */
  initAnalytics() {
    try {
      const data = loadTelemetry();
      saveTelemetry(data);
    } catch (e) {}
  },

  /**
   * Rastreia a visualizacao de uma tela/pagina de forma silenciosa
   * @param {string} pageName 
   */
  trackPageView(pageName = 'Jardim') {
    try {
      const data = loadTelemetry();
      data.totalPageViews = (data.totalPageViews || 0) + 1;
      data.pageViews[pageName] = (data.pageViews[pageName] || 0) + 1;
      saveTelemetry(data);

      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', { page_title: pageName });
      }
    } catch (e) {}
  },

  /**
   * Rastreia a interacao com um botao ou recurso de forma silenciosa
   * @param {string} category 
   * @param {string} action 
   * @param {string} label 
   */
  trackEvent(category, action, label = '') {
    try {
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
    } catch (e) {}
  },

  /**
   * Retorna um resumo estruturado
   */
  getAnalyticsSummary() {
    try {
      const data = loadTelemetry();
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
    } catch (e) {
      return {
        totalPageViews: 0,
        totalClicks: 0,
        firstSession: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        topEvents: [],
        pageViewsList: [],
      };
    }
  },

  /**
   * Reseta os dados de telemetria locais
   */
  resetAnalytics() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
  }
};
