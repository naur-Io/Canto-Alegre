import React, { useState, useEffect, useCallback } from 'react';
import { Leaf, Filter, Plus, Sparkles, HelpCircle, X, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { markGardenTourCompleted } from '../services/storageService';

export default function GardenTourWalkthrough({ isOpen, onClose, currentLang = 'pt-BR' }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const isEn = currentLang === 'en';

  const TOUR_STEPS = [
    {
      targetSelector: '.nav-btn-add, .fab-add-plant',
      icon: <Plus size={26} color="#10b981" />,
      badge: isEn ? "Step 1 of 5" : "Passo 1 de 5",
      title: isEn ? "Add New Plant" : "Adicionar Nova Planta",
      description: isEn
        ? "Click here or use the floating (+) button at the bottom right to register a new plant. You will be asked if you already know the plant's name or wish to identify it using AI."
        : "Clique no botão Nova Planta ou no botão flutuante (+) no canto inferior para cadastrar uma muda. O sistema perguntará se você já sabe o nome ou se prefere identificar por foto com IA."
    },
    {
      targetSelector: '.toolbar',
      icon: <Filter size={26} color="#10b981" />,
      badge: isEn ? "Step 2 of 5" : "Passo 2 de 5",
      title: isEn ? "Search & Care Filters" : "Busca & Filtros de Cuidados",
      description: isEn
        ? "Use the search bar to find plants by name, origin, or soil type. Tap chips to filter by Full Sun, Indirect Light, Shade, or Thirsty Today."
        : "Use a barra de busca para encontrar plantas por nome, origem ou tipo de solo. Toque nos chips para filtrar por Luz Direta, Indireta, Sombra ou Sede Hoje."
    },
    {
      targetSelector: '.brand',
      icon: <Leaf size={26} color="#10b981" />,
      badge: isEn ? "Step 3 of 5" : "Passo 3 de 5",
      title: isEn ? "Navigation & Product Presentation" : "Navegação & Apresentação",
      description: isEn
        ? "Tap the brand or view toggle button to switch between the product presentation landing page and your Smart Garden dashboard at any time."
        : "Toque na marca ou no alternador de tela para alternar entre a página de apresentação do produto e o seu Painel de Jardim Inteligente a qualquer momento."
    },
    {
      targetSelector: '.nav-btn-key',
      icon: <Sparkles size={26} color="#10b981" />,
      badge: isEn ? "Step 4 of 5" : "Passo 4 de 5",
      title: isEn ? "Google Gemini AI Engine" : "Motor de IA Botânica Gemini",
      description: isEn
        ? "Connect your free Google AI Studio key for instant photo identification, or use the high-precision offline simulation mode."
        : "Conecte sua chave gratuita do Google AI Studio para identificação inteligente por foto ou utilize o modo de simulação offline."
    },
    {
      targetSelector: '.nav-secondary-actions',
      icon: <HelpCircle size={26} color="#10b981" />,
      badge: isEn ? "Step 5 of 5" : "Passo 5 de 5",
      title: isEn ? "Guide, PWA & Support" : "Guia, PWA Offline & Suporte",
      description: isEn
        ? "Install Canto Alegre on your Android or iOS device to work 100% offline, check software updates, and send feedback directly to our team."
        : "Instale o Canto Alegre no seu Android ou iOS para funcionar 100% offline, confira as novidades do sistema e envie suas sugestões de suporte."
    }
  ];

  const updateHighlightRect = useCallback(() => {
    if (!isOpen) return;
    const step = TOUR_STEPS[currentStep];
    if (step && step.targetSelector) {
      const el = document.querySelector(step.targetSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
        return;
      }
    }
    setTargetRect(null);
  }, [isOpen, currentStep]);

  useEffect(() => {
    updateHighlightRect();
    window.addEventListener('resize', updateHighlightRect);
    window.addEventListener('scroll', updateHighlightRect, true);
    return () => {
      window.removeEventListener('resize', updateHighlightRect);
      window.removeEventListener('scroll', updateHighlightRect, true);
    };
  }, [updateHighlightRect]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    markGardenTourCompleted();
    onClose();
  };

  const stepData = TOUR_STEPS[currentStep];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'auto' }}>
      {/* Target Element Spotlight Highlight Box */}
      {targetRect ? (
        <div 
          className="tour-spotlight-box"
          style={{
            position: 'fixed',
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            borderRadius: '14px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65), 0 0 20px rgba(16, 185, 129, 0.8)',
            border: '2px solid #10b981',
            zIndex: 10000,
            pointerEvents: 'none',
            transition: 'all 0.3s ease-in-out'
          }}
        />
      ) : (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            zIndex: 10000
          }} 
          onClick={handleFinish}
        />
      )}

      {/* Popover Card */}
      <div 
        className="modal-container tour-walkthrough-container" 
        onClick={e => e.stopPropagation()} 
        style={{
          position: 'fixed',
          zIndex: 10001,
          maxWidth: '480px',
          width: '90%',
          top: targetRect ? Math.min(Math.max(targetRect.top + targetRect.height + 16, 20), window.innerHeight - 380) : '50%',
          left: '50%',
          transform: targetRect ? 'translateX(-50%)' : 'translate(-50%, -50%)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
          background: 'var(--surface, #ffffff)',
          border: '1px solid var(--border-color)',
          transition: 'top 0.3s ease-in-out, transform 0.3s ease-in-out'
        }}
      >
        {/* Header Bar */}
        <div className="modal-header" style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              padding: '4px 12px',
              borderRadius: '50px',
              background: 'var(--primary-50, rgba(16, 185, 129, 0.12))',
              border: '1px solid var(--border-color)',
              color: 'var(--primary-600, #059669)',
              fontSize: '0.8rem',
              fontWeight: 700
            }}>
              {stepData.badge}
            </div>
          </div>
          <button className="modal-close" onClick={handleFinish} title={isEn ? "Skip Tour" : "Pular Tour"}>
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body" style={{ padding: '20px 24px', textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'var(--primary-50, rgba(16, 185, 129, 0.12))',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px'
          }}>
            {stepData.icon}
          </div>

          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--primary-900, #0f291e)',
            marginBottom: '8px'
          }}>
            {stepData.title}
          </h3>

          <p style={{
            fontSize: '0.92rem',
            color: 'var(--text-main, #111827)',
            lineHeight: 1.6,
            marginBottom: '18px'
          }}>
            {stepData.description}
          </p>

          {/* Progress Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
            {TOUR_STEPS.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentStep(idx)}
                style={{
                  width: currentStep === idx ? '22px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: currentStep === idx ? 'var(--primary-600, #059669)' : 'var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer" style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--modal-footer-bg, #f5faf7)'
        }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={handleFinish}
            style={{ fontSize: '0.82rem' }}
          >
            <span>{isEn ? "Skip" : "Pular"}</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {currentStep > 0 && (
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={handlePrev}
              >
                <ArrowLeft size={14} />
                <span>{isEn ? "Back" : "Anterior"}</span>
              </button>
            )}

            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={handleNext}
              style={{ padding: '8px 16px' }}
            >
              {currentStep < TOUR_STEPS.length - 1 ? (
                <>
                  <span>{isEn ? "Next" : "Próximo"}</span>
                  <ArrowRight size={14} />
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  <span>{isEn ? "Finish" : "Concluir"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
