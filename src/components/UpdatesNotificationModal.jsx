import React, { useEffect } from 'react';
import { 
  X, 
  Bell, 
  Sparkles, 
  CheckCircle, 
  RefreshCw, 
  Calendar, 
  Leaf, 
  Sun, 
  Smartphone, 
  Sprout, 
  BookOpen, 
  Globe, 
  Camera, 
  Droplets, 
  Database 
} from 'lucide-react';
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

  const renderItemIcon = (type) => {
    switch (type) {
      case 'brand': return <Leaf size={15} color="var(--primary-600)" />;
      case 'theme': return <Sun size={15} color="#f59e0b" />;
      case 'pwa': return <Smartphone size={15} color="#10b981" />;
      case 'propagation': return <Sprout size={15} color="#10b981" />;
      case 'guide': return <BookOpen size={15} color="#60a5fa" />;
      case 'updates': return <Bell size={15} color="#f59e0b" />;
      case 'web': return <Globe size={15} color="#34d399" />;
      case 'ai': return <Sparkles size={15} color="#a855f7" />;
      case 'botany': return <Leaf size={15} color="#10b981" />;
      case 'camera': return <Camera size={15} color="#3b82f6" />;
      case 'water': return <Droplets size={15} color="#0284c7" />;
      case 'storage': return <Database size={15} color="#8b5cf6" />;
      default: return <CheckCircle size={15} color="var(--primary-600)" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container updates-modal-container" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '620px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary-800), var(--primary-600))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}>
              <Bell size={18} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="modal-title">
                  Novidades & Atualizações
                </span>
                <span style={{ 
                  background: 'var(--primary-50)', 
                  border: '1px solid var(--border-color)', 
                  color: 'var(--primary-600)', 
                  fontSize: '0.72rem', 
                  padding: '2px 8px', 
                  borderRadius: '20px', 
                  fontWeight: '700' 
                }}>
                  {LATEST_VERSION}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Acompanhe o histórico de melhorias do Canto Alegre
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
            background: 'var(--primary-50)',
            borderBottom: '1px solid var(--border-color)',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <RefreshCw size={18} color="#f59e0b" className="spin-icon" />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                <strong>Nova versão pronta.</strong> Recarregue para aplicar melhorias.
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
          <div className="updates-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {APP_UPDATES.map((update, index) => (
              <div 
                key={update.id} 
                className="update-card"
                style={{
                  background: index === 0 ? 'var(--surface-card)' : 'var(--surface)',
                  border: `1px solid ${index === 0 ? 'var(--primary-500)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
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
                        color: 'var(--text-main)', 
                        fontSize: '1.05rem' 
                      }}>
                        {update.version}
                      </span>
                      {index === 0 && (
                        <span style={{
                          background: 'var(--primary-600)',
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
                          background: 'var(--primary-50)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-muted)',
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
                <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', marginBottom: '6px', lineHeight: '1.4', fontWeight: '700' }}>
                  {update.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.5' }}>
                  {update.summary}
                </p>

                {/* Detailed items list with Lucide icons */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '12px'
                }}>
                  {update.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ marginTop: '2px', flexShrink: 0 }}>
                        {renderItemIcon(item.type)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.85rem' }}>
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
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Canto Alegre &bull; Evolução contínua
          </span>
          <button 
            className="btn btn-primary btn-sm"
            onClick={onClose}
          >
            <span>Fechar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
