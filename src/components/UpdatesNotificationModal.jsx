import React, { useEffect } from 'react';
import { X, Bell, Sparkles, CheckCircle, ArrowRight, RefreshCw, Calendar, Tag } from 'lucide-react';
import { APP_UPDATES, LATEST_VERSION } from '../services/updatesData';
import { markVersionAsSeen } from '../services/storageService';

export default function UpdatesNotificationModal({ 
  isOpen, 
  onClose, 
  swUpdateAvailable, 
  onReloadApp 
}) {
  useEffect(() => {
    if (isOpen) {
      markVersionAsSeen(LATEST_VERSION);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container updates-modal-container" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '620px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #047857)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <Bell size={18} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>
                  Novidades & Atualizações
                </span>
                <span style={{ 
                  background: 'rgba(16, 185, 129, 0.2)', 
                  border: '1px solid rgba(52, 211, 153, 0.4)', 
                  color: '#34d399', 
                  fontSize: '0.72rem', 
                  padding: '2px 8px', 
                  borderRadius: '20px', 
                  fontWeight: '700' 
                }}>
                  {LATEST_VERSION}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Fique por dentro de cada melhoria do Canto Alegre
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} title="Fechar notificações">
            <X size={20} />
          </button>
        </div>

        {/* PWA Update Banner if new Service Worker is ready */}
        {swUpdateAvailable && (
          <div style={{
            background: 'linear-gradient(135deg, #1b4b32, #0d281a)',
            borderBottom: '1px solid var(--accent-gold)',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <RefreshCw size={18} color="#f59e0b" className="spin-icon" />
              <div style={{ fontSize: '0.85rem', color: '#fff' }}>
                <strong>Nova versão pronta!</strong> Recarregue para aplicar melhorias.
              </div>
            </div>
            <button 
              className="btn btn-primary btn-sm"
              onClick={onReloadApp}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              Recarregar Agora
            </button>
          </div>
        )}

        {/* Updates Timeline Body */}
        <div className="modal-body" style={{ overflowY: 'auto', padding: '20px', flex: 1 }}>
          <div className="updates-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {APP_UPDATES.map((update, index) => (
              <div 
                key={update.id} 
                className="update-card"
                style={{
                  background: index === 0 ? 'rgba(20, 62, 39, 0.55)' : 'rgba(0, 0, 0, 0.25)',
                  border: `1px solid ${index === 0 ? 'rgba(52, 211, 153, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '14px',
                  padding: '18px',
                  position: 'relative'
                }}
              >
                {/* Header of each update */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ 
                        fontWeight: '700', 
                        color: index === 0 ? '#34d399' : '#e2e8f0', 
                        fontSize: '1.05rem' 
                      }}>
                        {update.version}
                      </span>
                      {index === 0 && (
                        <span style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: '#fff',
                          fontSize: '0.68rem',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Versão Atual
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                      <Calendar size={12} />
                      <span>{update.date}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {update.badges.map(b => (
                      <span 
                        key={b}
                        style={{
                          background: 'rgba(255, 255, 255, 0.07)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#a7f3d0',
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '8px'
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title & Summary */}
                <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '6px', lineHeight: '1.4' }}>
                  {update.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.5' }}>
                  {update.summary}
                </p>

                {/* Detailed items list */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingTop: '12px'
                }}>
                  {update.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ fontSize: '1.1rem', lineHeight: '1.2' }}>{item.icon}</span>
                      <div>
                        <div style={{ fontWeight: '600', color: '#f0fdf4', fontSize: '0.85rem' }}>
                          {item.title}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4' }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--card-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 39, 27, 0.95)'
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Canto Alegre &bull; Atualizado e em evolução contínua
          </span>
          <button 
            className="btn btn-primary btn-sm"
            onClick={onClose}
          >
            <CheckCircle size={14} />
            <span>Tudo Certo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
