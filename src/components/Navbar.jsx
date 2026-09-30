import React from 'react';
import { Leaf, Plus, Key, Sparkles, HelpCircle, Download, Bell, Settings, Globe, Layout, BookOpen, MessageSquare, Trash2 } from 'lucide-react';
import { TRANSLATIONS } from '../services/i18n';
import { analyticsService } from '../services/analyticsService';

export default function Navbar({ 
  hasApiKey, 
  onAddClick, 
  onOpenKeyModal, 
  onOpenGuide, 
  onOpenUpdates,
  hasUnreadUpdates,
  onOpenSettings,
  isInstallable, 
  onInstallApp,
  currentView = 'landing',
  onSwitchView,
  currentLang = 'pt-BR',
  onLanguageChange,
  onOpenFeedback,
  onOpenAnalytics,
  trashCount = 0,
  onOpenTrashBin
}) {
  const t = TRANSLATIONS[currentLang]?.nav || TRANSLATIONS['pt-BR'].nav;

  return (
    <header className="navbar">
      <div className="app-container navbar-content">
        {/* Linha Principal */}
        <div className="navbar-main-row">
          <div 
            className="brand" 
            onClick={() => onSwitchView && onSwitchView(currentView === 'landing' ? 'garden' : 'landing')} 
            style={{ cursor: 'pointer' }} 
            title="Canto Alegre"
          >
            <div className="brand-icon">
              <Leaf size={20} />
            </div>
            <div className="brand-info">
              <span className="brand-title">Canto Alegre</span>
              <span className="brand-subtitle">{t.brandTag}</span>
            </div>
          </div>

          {/* Grupo de Ações Primárias (Idioma, Alternador de Tela e Nova Planta) */}
          <div className="nav-primary-actions">
            {/* Alternador de Idioma (PT-BR / EN) */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onLanguageChange && onLanguageChange(currentLang === 'pt-BR' ? 'en' : 'pt-BR')}
              title="Mudar idioma / Switch language"
              aria-label="Alternar Idioma"
              style={{ fontWeight: 700, padding: '6px 10px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Globe size={14} />
              <span>{currentLang === 'pt-BR' ? 'PT-BR' : 'EN'}</span>
            </button>

            {/* Alternador de Tela (Apresentacao vs Meu Jardim) */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onSwitchView && onSwitchView(currentView === 'landing' ? 'garden' : 'landing')}
              title={currentView === 'landing' ? t.myGarden : t.presentation}
              style={{ fontWeight: 600, padding: '6px 12px' }}
            >
              {currentView === 'landing' ? (
                <>
                  <Layout size={14} />
                  <span className="nav-btn-text-full">{t.myGarden}</span>
                </>
              ) : (
                <>
                  <BookOpen size={14} />
                  <span className="nav-btn-text-full">{t.presentation}</span>
                </>
              )}
            </button>

            {/* Configuracoes */}
            <button 
              className="btn btn-secondary btn-sm nav-btn-settings"
              onClick={onOpenSettings}
              title={currentLang === 'en' ? "Canto Alegre Settings" : "Configuracoes do Canto Alegre"}
              aria-label="Configuracoes"
            >
              <Settings size={15} />
            </button>

            {/* CTA Adicionar Planta */}
            {currentView === 'garden' && (
              <button 
                className="btn btn-primary btn-sm nav-btn-add"
                onClick={onAddClick}
                title={currentLang === 'en' ? "Add new plant to garden" : "Adicionar nova planta ao jardim"}
              >
                <Plus size={16} />
                <span className="nav-btn-text-full">{currentLang === 'en' ? 'New Plant' : 'Nova Planta'}</span>
                <span className="nav-btn-text-short">{currentLang === 'en' ? 'Plant' : 'Planta'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Grupo de Ações Secundárias */}
        <div className="nav-secondary-actions">
          {/* Feedback & Suporte */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              analyticsService.trackEvent('Navbar', 'click', 'Feedback');
              onOpenFeedback && onOpenFeedback();
            }}
            title={t.feedback}
          >
            <MessageSquare size={14} />
            <span className="nav-btn-text-full">{t.feedback}</span>
            <span className="nav-btn-text-short">{currentLang === 'en' ? 'Support' : 'Suporte'}</span>
          </button>

          {/* Notificacoes / Atualizacoes */}
          <button 
            className="btn btn-secondary btn-sm nav-btn-updates"
            onClick={() => {
              analyticsService.trackEvent('Navbar', 'click', 'Novidades');
              onOpenUpdates && onOpenUpdates();
            }}
            title={currentLang === 'en' ? "Canto Alegre News & Updates" : "Novidades & Atualizacoes do Canto Alegre"}
            style={{ position: 'relative' }}
          >
            <Bell size={14} />
            {hasUnreadUpdates && (
              <span className="unread-dot-badge" />
            )}
            <span className="nav-btn-text-full">{currentLang === 'en' ? 'Updates' : 'Novidades'}</span>
            <span className="nav-btn-text-short">{currentLang === 'en' ? 'Updates' : 'Novidades'}</span>
          </button>

          {/* Lixeira */}
          <button 
            className="btn btn-secondary btn-sm nav-btn-trash"
            onClick={() => {
              analyticsService.trackEvent('Navbar', 'click', 'Lixeira');
              onOpenTrashBin && onOpenTrashBin();
            }}
            title={currentLang === 'en' ? "Garden Trash Bin" : "Lixeira do Jardim"}
            style={{ position: 'relative' }}
          >
            <Trash2 size={14} color={trashCount > 0 ? '#ef4444' : 'currentColor'} />
            {trashCount > 0 && (
              <span className="unread-dot-badge" style={{ background: '#ef4444' }} />
            )}
            <span className="nav-btn-text-full">{currentLang === 'en' ? `Trash Bin ${trashCount > 0 ? `(${trashCount})` : ''}` : `Lixeira ${trashCount > 0 ? `(${trashCount})` : ''}`}</span>
            <span className="nav-btn-text-short">{currentLang === 'en' ? 'Trash' : 'Lixeira'}</span>
          </button>

          {/* Guia & PWA */}
          <button 
            className="btn btn-secondary btn-sm nav-btn-guide"
            onClick={() => {
              analyticsService.trackEvent('Navbar', 'click', 'Guia_PWA');
              onOpenGuide && onOpenGuide();
            }}
            title={currentLang === 'en' ? "How Canto Alegre Works & PWA Install" : "Como Funciona o Canto Alegre & Instalar PWA"}
          >
            <HelpCircle size={14} />
            <span className="nav-btn-text-full">{currentLang === 'en' ? 'Guide & PWA' : 'Guia & PWA'}</span>
            <span className="nav-btn-text-short">{currentLang === 'en' ? 'Guide' : 'Guia'}</span>
          </button>

          {/* Instalar App */}
          {isInstallable && (
            <button 
              className="btn btn-install btn-sm nav-btn-install"
              onClick={() => {
                analyticsService.trackEvent('Navbar', 'click', 'Instalar_PWA');
                onInstallApp && onInstallApp();
              }}
              title={currentLang === 'en' ? "Install Canto Alegre on your device" : "Instalar Canto Alegre no seu dispositivo"}
            >
              <Download size={14} />
              <span className="nav-btn-text-full">{t.installApp}</span>
              <span className="nav-btn-text-short">{currentLang === 'en' ? 'Install' : 'Instalar'}</span>
            </button>
          )}

          {/* Status IA Gemini */}
          <button 
            className={`btn ${hasApiKey ? 'btn-key-active' : 'btn-secondary'} btn-sm nav-btn-key`}
            onClick={() => {
              analyticsService.trackEvent('Navbar', 'click', 'Config_IA_Gemini');
              onOpenKeyModal && onOpenKeyModal();
            }}
            title={hasApiKey ? (currentLang === 'en' ? "Gemini API Key Connected (Click to change)" : "Chave API Gemini Conectada (Clique para alterar)") : (currentLang === 'en' ? "Simulation Mode Active (Click to set key)" : "Modo Simulacao Ativo (Clique para configurar chave)")}
          >
            {hasApiKey ? (
              <>
                <span className="status-dot online" />
                <Sparkles size={14} />
                <span className="nav-btn-text-full">{currentLang === 'en' ? 'Gemini AI Active' : 'IA Gemini Conectada'}</span>
                <span className="nav-btn-text-short">{currentLang === 'en' ? 'Gemini AI' : 'IA Gemini'}</span>
              </>
            ) : (
              <>
                <span className="status-dot demo" />
                <Key size={14} />
                <span className="nav-btn-text-full">{currentLang === 'en' ? 'Demo Mode' : 'Modo Simulado'}</span>
                <span className="nav-btn-text-short">{currentLang === 'en' ? 'Demo' : 'Simulado'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
