import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, MousePointerClick, TrendingUp, X, Activity, RotateCcw, ShieldCheck } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

export function AnalyticsStatsModal({ isOpen, onClose, t }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setStats(analyticsService.getAnalyticsSummary());
    }
  }, [isOpen]);

  if (!isOpen || !stats) return null;

  const handleReset = () => {
    if (window.confirm(t ? t('analytics_reset_confirm') || 'Deseja realmente zerar as estatísticas locais?' : 'Deseja realmente zerar as estatísticas locais?')) {
      analyticsService.resetAnalytics();
      setStats(analyticsService.getAnalyticsSummary());
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--card-bg, #ffffff)',
          color: 'var(--text-color, #1a202c)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--border-color, #e2e8f0)',
          padding: '24px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              padding: '10px', 
              borderRadius: '12px', 
              backgroundColor: 'var(--accent-light, #e6f4ea)',
              color: 'var(--primary-color, #143e27)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <BarChart3 size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                {t ? t('analytics_title') || 'Telemetria & Estatísticas de Uso' : 'Telemetria & Estatísticas de Uso'}
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.75 }}>
                {t ? t('analytics_subtitle') || 'Acessos e interações registradas no dispositivo' : 'Acessos e interações registradas no dispositivo'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Big Numbers Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px', 
          marginBottom: '20px' 
        }}>
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-secondary, #f8fafc)',
            border: '1px solid var(--border-color, #e2e8f0)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.8, fontSize: '0.85rem' }}>
              <Eye size={16} />
              <span>{t ? t('analytics_total_views') || 'Visualizações' : 'Visualizações'}</span>
            </div>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-color, #143e27)' }}>
              {stats.totalPageViews}
            </span>
          </div>

          <div style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-secondary, #f8fafc)',
            border: '1px solid var(--border-color, #e2e8f0)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.8, fontSize: '0.85rem' }}>
              <MousePointerClick size={16} />
              <span>{t ? t('analytics_total_clicks') || 'Cliques em Botoes' : 'Cliques em Botoes'}</span>
            </div>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-color, #143e27)' }}>
              {stats.totalClicks}
            </span>
          </div>
        </div>

        {/* Hotspots / Top Event Clicks */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <TrendingUp size={18} style={{ color: 'var(--primary-color, #143e27)' }} />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
              {t ? t('analytics_top_actions') || 'Hotspots: Recursos Mais Clicados' : 'Hotspots: Recursos Mais Clicados'}
            </h3>
          </div>

          {stats.topEvents.length === 0 ? (
            <p style={{ fontSize: '0.9rem', opacity: 0.7, fontStyle: 'italic', margin: '8px 0' }}>
              {t ? t('analytics_no_events') || 'Nenhuma interacao registrada ainda. Clique nos botoes do app para gerar dados.' : 'Nenhuma interacao registrada ainda. Clique nos botoes do app para gerar dados.'}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stats.topEvents.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-secondary, #f8fafc)',
                    border: '1px solid var(--border-color, #e2e8f0)',
                    fontSize: '0.9rem'
                  }}
                >
                  <span style={{ fontWeight: 500, wordBreak: 'break-word', paddingRight: '8px' }}>
                    {item.name}
                  </span>
                  <span style={{ 
                    fontWeight: 700, 
                    backgroundColor: 'var(--accent-light, #e6f4ea)', 
                    color: 'var(--primary-color, #143e27)',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '0.85rem'
                  }}>
                    {item.count} {item.count === 1 ? 'clique' : 'cliques'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Page Views Breakdown */}
        {stats.pageViewsList && stats.pageViewsList.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Activity size={18} style={{ color: 'var(--primary-color, #143e27)' }} />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                {t ? t('analytics_page_views') || 'Acessos por Tela' : 'Acessos por Tela'}
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stats.pageViewsList.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-secondary, #f8fafc)',
                    border: '1px solid var(--border-color, #e2e8f0)',
                    fontSize: '0.9rem'
                  }}
                >
                  <span style={{ fontWeight: 500 }}>Tela: {item.name}</span>
                  <span style={{ fontWeight: 700, opacity: 0.8 }}>
                    {item.count} {item.count === 1 ? 'acesso' : 'acessos'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Note & Footer */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '10px', 
          borderRadius: '8px', 
          backgroundColor: 'var(--bg-secondary, #f8fafc)', 
          fontSize: '0.8rem',
          opacity: 0.8,
          marginBottom: '20px'
        }}>
          <ShieldCheck size={18} style={{ flexShrink: 0 }} />
          <span>
            {t ? t('analytics_privacy_note') || 'Privacidade garantida: Os dados de uso sao armazenados localmente e servem para medir o engajamento de recursos sem coletar dados pessoais.' : 'Privacidade garantida: Os dados de uso sao armazenados localmente e servem para medir o engajamento de recursos sem coletar dados pessoais.'}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: '1px solid var(--border-color, #e2e8f0)',
              color: 'inherit',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} />
            {t ? t('analytics_reset') || 'Zerar Dados' : 'Zerar Dados'}
          </button>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--primary-color, #143e27)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {t ? t('close') || 'Fechar' : 'Fechar'}
          </button>
        </div>
      </div>
    </div>
  );
}
