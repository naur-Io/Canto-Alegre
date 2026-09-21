import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Sun, 
  Moon, 
  Key, 
  Download, 
  Database, 
  CheckCircle2, 
  ExternalLink, 
  BookOpen, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { exportGardenBackup, importGardenBackup } from '../services/storageService';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  currentTheme, 
  onThemeChange,
  hasApiKey, 
  onOpenKeyModal,
  onOpenGuide,
  isInstallable,
  onInstallApp,
  onReloadPlants
}) {
  const [exportSuccess, setExportSuccess] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      const json = await exportGardenBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `canto-alegre-jardim-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao exportar:', err);
    }
  };

  const handleResetToDefault = async () => {
    if (window.confirm('Deseja redefinir as plantas iniciais para o padrão (apenas a Jiboia)?')) {
      localStorage.removeItem('cantoalegre_user_plants_v1');
      localStorage.removeItem('cantoalegre_has_initialized_v1');
      if (onReloadPlants) await onReloadPlants();
      setResetMessage('Jardim redefinido para o padrão com sucesso.');
      setTimeout(() => setResetMessage(''), 3500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container settings-modal-container" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '580px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="settings-icon-header">
              <Settings size={20} color="var(--primary-600)" />
            </div>
            <div>
              <div className="modal-title">Configurações</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Personalize tema, inteligência artificial e preferências
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} title="Fechar configurações">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ overflowY: 'auto', padding: '20px', flex: 1 }}>
          
          {/* SEÇÃO 1: TEMA VISUAL */}
          <section style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ marginBottom: '10px', display: 'block', fontWeight: '700' }}>
              Aparência & Tema Visual
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              {/* Opção Tema Escuro */}
              <div 
                className={`theme-option-card ${currentTheme === 'dark' ? 'active' : ''}`}
                onClick={() => onThemeChange('dark')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div className="theme-icon-box dark">
                    <Moon size={18} />
                  </div>
                  {currentTheme === 'dark' && (
                    <span className="theme-active-tag">Ativo</span>
                  )}
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                  Tema Escuro
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Tons botânicos profundos, confortável para a visão e economia de energia.
                </div>
              </div>

              {/* Opção Tema Claro */}
              <div 
                className={`theme-option-card ${currentTheme === 'light' ? 'active' : ''}`}
                onClick={() => onThemeChange('light')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div className="theme-icon-box light">
                    <Sun size={18} />
                  </div>
                  {currentTheme === 'light' && (
                    <span className="theme-active-tag">Ativo</span>
                  )}
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                  Tema Claro
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Fundo limpo e suave, ideal para leitura em ambientes bem iluminados.
                </div>
              </div>
            </div>
          </section>

          {/* SEÇÃO 2: INTELIGÊNCIA ARTIFICIAL */}
          <section style={{ 
            marginBottom: '24px', 
            padding: '16px', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-color)',
            background: 'var(--primary-50)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={16} color="var(--primary-600)" />
                <span style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                  Motor de IA (Google Gemini)
                </span>
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '12px',
                background: hasApiKey ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: hasApiKey ? '#10b981' : '#f59e0b'
              }}>
                {hasApiKey ? 'Chave Ativa' : 'Modo Simulado'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.5' }}>
              {hasApiKey 
                ? 'Sua chave do Google AI Studio está conectada para identificação em tempo real.' 
                : 'Você está utilizando o banco de dados de simulação offline.'}
            </p>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onClose();
                onOpenKeyModal();
              }}
            >
              <Key size={14} />
              <span>{hasApiKey ? 'Gerenciar Chave de API' : 'Configurar Chave Google AI'}</span>
            </button>
          </section>

          {/* SEÇÃO 3: PWA E GUIA */}
          <section style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ marginBottom: '10px', display: 'block', fontWeight: '700' }}>
              Aplicativo & Recursos
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {isInstallable && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--surface)'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-main)' }}>Instalar no Dispositivo</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Crie o atalho na tela inicial do celular ou PC.</div>
                  </div>
                  <button className="btn btn-install btn-sm" onClick={onInstallApp}>
                    <Download size={14} />
                    <span>Instalar</span>
                  </button>
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--surface)'
              }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-main)' }}>Guia de Introdução</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Reveja o passo a passo sobre como o app funciona.</div>
                </div>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => {
                    onClose();
                    onOpenGuide();
                  }}
                >
                  <BookOpen size={14} />
                  <span>Abrir Guia</span>
                </button>
              </div>

              <a 
                href="/about.html" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--surface)',
                  textDecoration: 'none'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-main)' }}>Página de Apresentação</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Visualizar página web sobre o Canto Alegre.</div>
                </div>
                <div style={{ color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem' }}>
                  <span>Abrir</span>
                  <ExternalLink size={13} />
                </div>
              </a>
            </div>
          </section>

          {/* SEÇÃO 4: DADOS E BACKUP */}
          <section style={{ marginBottom: '10px' }}>
            <label className="form-label" style={{ marginBottom: '10px', display: 'block', fontWeight: '700' }}>
              Dados do Jardim
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary btn-sm" onClick={handleExport}>
                <Database size={14} />
                <span>Exportar Dados (JSON)</span>
              </button>
              <button className="btn btn-secondary btn-sm" onClick={handleResetToDefault} title="Restaura a coleção com apenas a Jiboia">
                <RotateCcw size={14} />
                <span>Redefinir para Padrão (Jiboia)</span>
              </button>
            </div>
            {exportSuccess && (
              <div style={{ color: 'var(--primary-600)', fontSize: '0.8rem', marginTop: '8px' }}>
                Arquivo de backup baixado com sucesso.
              </div>
            )}
            {resetMessage && (
              <div style={{ color: 'var(--primary-600)', fontSize: '0.8rem', marginTop: '8px' }}>
                {resetMessage}
              </div>
            )}
          </section>

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
            Canto Alegre Versão 1.1.0
          </span>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            <span>Concluir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
