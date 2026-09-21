import React from 'react';
import { Leaf, Plus, Key, Sparkles, HelpCircle, Download, Bell } from 'lucide-react';

export default function Navbar({ 
  hasApiKey, 
  onAddClick, 
  onOpenKeyModal, 
  onOpenGuide, 
  onOpenUpdates,
  hasUnreadUpdates,
  isInstallable, 
  onInstallApp 
}) {
  return (
    <header className="navbar">
      <div className="app-container navbar-content">
        <div className="brand" onClick={onOpenGuide} style={{ cursor: 'pointer' }} title="Clique para ver o Guia do Canto Alegre">
          <div className="brand-icon">
            <Leaf size={20} />
          </div>
          <div className="brand-info">
            <span className="brand-title">Canto Alegre</span>
            <span className="brand-subtitle">IA Botânica & Mudas</span>
          </div>
        </div>

        <div className="nav-actions">
          {/* Botão Notificações / Atualizações */}
          <button 
            className="btn btn-secondary btn-sm nav-btn-updates"
            onClick={onOpenUpdates}
            title="Novidades & Atualizações do Canto Alegre"
            style={{ position: 'relative' }}
          >
            <Bell size={14} />
            {hasUnreadUpdates && (
              <span className="unread-dot-badge" />
            )}
            <span className="nav-btn-text-full">Novidades</span>
          </button>

          {/* Botão Guia / Apresentação */}
          <button 
            className="btn btn-secondary btn-sm nav-btn-guide"
            onClick={onOpenGuide}
            title="Como Funciona o Canto Alegre & Instalar PWA"
          >
            <HelpCircle size={14} />
            <span className="nav-btn-text-full">Guia & PWA</span>
            <span className="nav-btn-text-short">Guia</span>
          </button>

          {/* Botão de Instalar PWA se disponível */}
          {isInstallable && (
            <button 
              className="btn btn-install btn-sm nav-btn-install"
              onClick={onInstallApp}
              title="Instalar Canto Alegre no seu dispositivo"
            >
              <Download size={14} />
              <span className="nav-btn-text-full">Instalar App</span>
              <span className="nav-btn-text-short">Instalar</span>
            </button>
          )}

          <button 
            className={`btn ${hasApiKey ? 'btn-key-active' : 'btn-secondary'} btn-sm nav-btn-key`}
            onClick={onOpenKeyModal}
            title={hasApiKey ? "Chave API Gemini Conectada (Clique para alterar)" : "Modo Simulação Ativo (Clique para configurar chave)"}
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

          <button 
            className="btn btn-primary btn-sm nav-btn-add"
            onClick={onAddClick}
          >
            <Plus size={16} />
            <span className="nav-btn-text-full">Nova Planta</span>
            <span className="nav-btn-text-short">Adicionar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
