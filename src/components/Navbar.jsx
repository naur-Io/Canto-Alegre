import React from 'react';
import { Leaf, Plus, Key, Sparkles, HelpCircle, Download, Bell, Settings, Sun, Moon, Globe, Layout, BookOpen, MessageSquare } from 'lucide-react';
import { TRANSLATIONS } from '../services/i18n';

export default function Navbar({ 
  hasApiKey, 
  onAddClick, 
  onOpenKeyModal, 
  onOpenGuide, 
  onOpenUpdates,
  hasUnreadUpdates,
  currentTheme,
  onToggleTheme,
  onOpenSettings,
  isInstallable, 
  onInstallApp,
  currentView = 'landing',
  onSwitchView,
  currentLang = 'pt-BR',
  onLanguageChange,
  onOpenFeedback
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

          {/* Grupo de Ações Primárias (Idioma, Tema, Alternador de Tela e Nova Planta) */}
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

            {/* Alternar Tema Visual */}
            <button 
              className="btn btn-secondary btn-sm nav-btn-theme"
              onClick={onToggleTheme}
              title={currentTheme === 'dark' ? "Mudar para Tema Claro" : "Mudar para Tema Escuro"}
              aria-label="Alternar Tema"
            >
              {currentTheme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#3b82f6" />}
            </button>

            {/* Configuracoes */}
            <button 
              className="btn btn-secondary btn-sm nav-btn-settings"
              onClick={onOpenSettings}
              title="Configuracoes do Canto Alegre"
              aria-label="Configuracoes"
            >
              <Settings size={15} />
            </button>

            {/* CTA Adicionar Planta */}
            {currentView === 'garden' && (
              <button 
                className="btn btn-primary btn-sm nav-btn-add"
                onClick={onAddClick}
                title="Adicionar nova planta ao jardim"
              >
                <Plus size={16} />
                <span className="nav-btn-text-full">Nova Planta</span>
                <span className="nav-btn-text-short">Planta</span>
              </button>
            )}
          </div>
        </div>

        {/* Grupo de Ações Secundárias */}
        <div className="nav-secondary-actions">
          {/* Feedback & Suporte */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenFeedback}
            title={t.feedback}
          >
            <MessageSquare size={14} />
            <span className="nav-btn-text-full">{t.feedback}</span>
            <span className="nav-btn-text-short">Suporte</span>
          </button>

          {/* Notificacoes / Atualizacoes */}
          <button 
            className="btn btn-secondary btn-sm nav-btn-updates"
            onClick={onOpenUpdates}
            title="Novidades & Atualizacoes do Canto Alegre"
            style={{ position: 'relative' }}
          >
            <Bell size={14} />
            {hasUnreadUpdates && (
              <span className="unread-dot-badge" />
            )}
            <span className="nav-btn-text-full">Novidades</span>
            <span className="nav-btn-text-short">Novidades</span>
          </button>

          {/* Guia & PWA */}
          <button 
            className="btn btn-secondary btn-sm nav-btn-guide"
            onClick={onOpenGuide}
            title="Como Funciona o Canto Alegre & Instalar PWA"
          >
            <HelpCircle size={14} />
            <span className="nav-btn-text-full">Guia & PWA</span>
            <span className="nav-btn-text-short">Guia</span>
          </button>

          {/* Instalar App */}
          {isInstallable && (
            <button 
              className="btn btn-install btn-sm nav-btn-install"
              onClick={onInstallApp}
              title="Instalar Canto Alegre no seu dispositivo"
            >
              <Download size={14} />
              <span className="nav-btn-text-full">{t.installApp}</span>
              <span className="nav-btn-text-short">Instalar</span>
            </button>
          )}

          {/* Status IA Gemini */}
          <button 
            className={`btn ${hasApiKey ? 'btn-key-active' : 'btn-secondary'} btn-sm nav-btn-key`}
            onClick={onOpenKeyModal}
            title={hasApiKey ? "Chave API Gemini Conectada (Clique para alterar)" : "Modo Simulacao Ativo (Clique para configurar chave)"}
          >
            {hasApiKey ? (
              <>
                <span className="status-dot online" />
                <Sparkles size={14} />
                <span className="nav-btn-text-full">IA Gemini Conectada</span>
                <span className="nav-btn-text-short">IA Gemini</span>
              </>
            ) : (
              <>
                <span className="status-dot demo" />
                <Key size={14} />
                <span className="nav-btn-text-full">Modo Simulado</span>
                <span className="nav-btn-text-short">Simulado</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
