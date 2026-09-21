import React, { useState } from 'react';
import { 
  X, 
  Leaf, 
  Camera, 
  Sprout, 
  Droplets, 
  WifiOff, 
  Download, 
  Key, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Smartphone,
  Globe
} from 'lucide-react';
import { saveApiKey, markIntroGuideSeen } from '../services/storageService';
import { validateGeminiApiKey } from '../services/geminiService';

export default function IntroGuideModal({ 
  isOpen, 
  onClose, 
  hasApiKey, 
  onKeySaved,
  installPrompt,
  onInstallApp
}) {
  const [activeTab, setActiveTab] = useState(0); // 0: Como Funciona, 1: Configurações Imediatas, 2: Baixar PWA
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [validating, setValidating] = useState(false);
  const [configSuccess, setConfigSuccess] = useState(false);
  const [configError, setConfigError] = useState('');
  const [dontShowAgain, setDontShowAgain] = useState(true);

  if (!isOpen) return null;

  const handleFinish = () => {
    if (dontShowAgain) {
      markIntroGuideSeen();
    }
    onClose();
  };

  const handleSaveImmediateKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      setConfigError('Por favor, insira a chave gerada no Google AI Studio.');
      return;
    }

    setValidating(true);
    setConfigError('');

    try {
      const result = await validateGeminiApiKey(apiKeyInput.trim());
      if (result.valid) {
        saveApiKey(apiKeyInput.trim());
        if (onKeySaved) onKeySaved(true);
        setConfigSuccess(true);
      } else {
        setConfigError(result.error || 'Chave inválida. Verifique os caracteres e tente novamente.');
      }
    } catch (err) {
      setConfigError('Erro de conexão ao validar chave. Você pode continuar no modo simulado.');
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleFinish}>
      <div 
        className="modal-container intro-modal-container" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '640px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #047857)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Leaf size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: '700', color: '#fff' }}>
                Canto Alegre
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--primary-400)' }}>
                Guia de Introdução & Configurações Rápidas
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={handleFinish} title="Fechar guia">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="intro-tabs" style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0,0,0,0.2)',
          padding: '0 10px'
        }}>
          <button 
            className={`intro-tab-btn ${activeTab === 0 ? 'active' : ''}`}
            onClick={() => setActiveTab(0)}
          >
            <Leaf size={15} />
            <span>1. Como Funciona</span>
          </button>
          <button 
            className={`intro-tab-btn ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => setActiveTab(1)}
          >
            <Key size={15} />
            <span>2. Configurações</span>
          </button>
          <button 
            className={`intro-tab-btn ${activeTab === 2 ? 'active' : ''}`}
            onClick={() => setActiveTab(2)}
          >
            <Download size={15} />
            <span>3. Baixar PWA</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body" style={{ overflowY: 'auto', padding: '20px', flex: 1 }}>
          
          {/* TAB 0: COMO FUNCIONA */}
          {activeTab === 0 && (
            <div className="intro-step-content">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.4rem', color: '#fff', marginBottom: '6px' }}>
                  Bem-vindo ao seu diário botânico inteligente!
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  O Canto Alegre foi projetado para cuidar das suas plantas com inteligência e carinho:
                </p>
              </div>

              <div className="intro-features-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '14px'
              }}>
                <div className="intro-card-feature">
                  <div className="intro-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                    <Camera size={20} color="#34d399" />
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '4px' }}>Identificação por Foto</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Tire uma foto ou envie uma imagem da folha/caule. A IA reconhece a espécie e detalhes botânicos.
                    </p>
                  </div>
                </div>

                <div className="intro-card-feature">
                  <div className="intro-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
                    <Sprout size={20} color="#fbbf24" />
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '4px' }}>Guia de Mudas & Estaquia</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Aprenda como cortar, enraizar na água ou no substrato e a época ideal para multiplicar suas plantas.
                    </p>
                  </div>
                </div>

                <div className="intro-card-feature">
                  <div className="intro-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                    <Droplets size={20} color="#60a5fa" />
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '4px' }}>Alerta de Sede & Rega</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Filtro dinâmico avisa quais plantas precisam de rega hoje. Marque como regada com um clique!
                    </p>
                  </div>
                </div>

                <div className="intro-card-feature">
                  <div className="intro-icon-wrap" style={{ background: 'rgba(168, 85, 247, 0.2)' }}>
                    <WifiOff size={20} color="#c084fc" />
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '4px' }}>100% Offline (PWA)</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Seu jardim fica gravado com segurança no seu próprio aparelho (IndexedDB), funcionando sem internet.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                padding: '14px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Globe size={20} color="#34d399" />
                  <span style={{ fontSize: '0.88rem', color: '#e2e8f0' }}>
                    Quer ver a página completa de apresentação e novidades?
                  </span>
                </div>
                <a 
                  href="/about.html" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    fontSize: '0.82rem',
                    color: '#6ee7b7',
                    textDecoration: 'none',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Abrir Apresentação <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}

          {/* TAB 1: CONFIGURAÇÕES IMEDIATAS */}
          {activeTab === 1 && (
            <div className="intro-step-content">
              <div style={{ marginBottom: '18px' }}>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.3rem', color: '#fff', marginBottom: '6px' }}>
                  Configuração Imediata da IA
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  O Canto Alegre utiliza a IA gratuita <strong>Google Gemini Flash</strong>. Você pode conectar sua chave própria ou usar o Modo Simulado Offline agora mesmo.
                </p>
              </div>

              <div style={{
                background: hasApiKey ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                border: `1px solid ${hasApiKey ? 'rgba(52, 211, 153, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                {hasApiKey ? (
                  <>
                    <CheckCircle2 size={24} color="#34d399" />
                    <div>
                      <div style={{ fontWeight: '600', color: '#fff', fontSize: '0.92rem' }}>Chave API Ativa & Conectada</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sua IA Gemini está pronta para identificar qualquer espécie botânica.</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Sparkles size={24} color="#fbbf24" />
                    <div>
                      <div style={{ fontWeight: '600', color: '#fff', fontSize: '0.92rem' }}>Modo Simulado Ativo</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Você já pode usar o app normalmente com banco de dados botânico de demonstração.</div>
                    </div>
                  </>
                )}
              </div>

              <form onSubmit={handleSaveImmediateKey}>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Inserir Chave Google AI Studio (Grátis):</span>
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ fontSize: '0.8rem', color: 'var(--primary-400)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      Gerar chave grátis <ExternalLink size={11} />
                    </a>
                  </label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="Cole sua chave (AIzaSy...)"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                  />
                </div>

                {configError && (
                  <div style={{ color: '#fca5a5', fontSize: '0.85rem', marginBottom: '12px' }}>
                    {configError}
                  </div>
                )}

                {configSuccess && (
                  <div style={{ color: '#86efac', fontSize: '0.85rem', marginBottom: '12px' }}>
                    Chave configurada com sucesso. IA Gemini ativada.
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-sm" 
                    disabled={validating || !apiKeyInput.trim()}
                  >
                    {validating ? 'Validando...' : 'Salvar e Validar Chave'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setActiveTab(2)}
                  >
                    Continuar no Modo Simulado
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: BAIXAR COMO PWA */}
          {activeTab === 2 && (
            <div className="intro-step-content">
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)'
                }}>
                  <Smartphone size={28} color="#fff" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.35rem', color: '#fff', marginBottom: '6px' }}>
                  Instalar Canto Alegre no seu Aparelho
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Acesse com 1 clique direto da sua tela de início, sem precisar baixar apps pesados de lojas.
                </p>
              </div>

              {/* Botão de Instalação PWA */}
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={onInstallApp}
                  style={{
                    padding: '14px 28px',
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <Download size={18} />
                  <span>Instalar Aplicativo Agora</span>
                </button>
              </div>

              {/* Instruções de instalação por plataforma */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.85rem'
              }}>
                <div style={{ fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
                  Como instalar manualmente:
                </div>
                <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                  <li>
                    <strong>No Android / Google Chrome:</strong> Toque no menu do navegador (três pontinhos) e clique em <em>"Instalar aplicativo"</em> ou <em>"Adicionar à tela inicial"</em>.
                  </li>
                  <li>
                    <strong>No iPhone / iOS Safari:</strong> Toque no ícone de <em>Compartilhar</em> (quadradinho com seta para cima ⎋) e selecione <em>"Adicionar à Tela de Início"</em>.
                  </li>
                  <li>
                    <strong>No Computador (Chrome/Edge):</strong> Clique no ícone de instalação no final da barra de endereços (ao lado da estrela de favoritos).
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="modal-footer" style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--card-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          background: 'rgba(15, 39, 27, 0.95)'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <input 
              type="checkbox" 
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              style={{ accentColor: '#10b981' }}
            />
            <span>Entendi, não abrir este guia automaticamente</span>
          </label>

          <div style={{ display: 'flex', gap: '8px' }}>
            {activeTab > 0 && (
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveTab(prev => prev - 1)}
              >
                <ArrowLeft size={14} />
                <span>Voltar</span>
              </button>
            )}

            {activeTab < 2 ? (
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => setActiveTab(prev => prev + 1)}
              >
                <span>Avançar</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={handleFinish}
              >
                <Leaf size={14} />
                <span>Entrar no Canto Alegre</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
