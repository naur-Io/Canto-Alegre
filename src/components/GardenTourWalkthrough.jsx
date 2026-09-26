import React, { useState } from 'react';
import { Leaf, Filter, Plus, Sparkles, HelpCircle, X, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { markGardenTourCompleted } from '../services/storageService';

export default function GardenTourWalkthrough({ isOpen, onClose, currentLang = 'pt-BR' }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const isEn = currentLang === 'en';

  const TOUR_STEPS = [
    {
      icon: <Leaf size={28} color="#10b981" />,
      badge: isEn ? "Step 1 of 5" : "Passo 1 de 5",
      title: isEn ? "Welcome to Your Smart Garden!" : "Bem-vindo ao seu Jardim Inteligente!",
      description: isEn
        ? "This is your main dashboard. Here you can view all your saved plants, track hydration levels, and check which ones need water today."
        : "Este e o seu painel principal. Aqui voce visualiza suas plantas salvas, acompanha o nivel de hidratacao e descobre quais precisam de agua hoje."
    },
    {
      icon: <Filter size={28} color="#10b981" />,
      badge: isEn ? "Step 2 of 5" : "Passo 2 de 5",
      title: isEn ? "Search & Care Filters" : "Busca & Filtros de Cuidados",
      description: isEn
        ? "Use the search bar to find plants by name, origin, or soil type. Tap chips to filter by Full Sun, Indirect Light, Shade, or Thirsty Today."
        : "Use a barra de busca para encontrar plantas por nome, origem ou tipo de solo. Toque nas tags para filtrar por Luz Direta, Indireta, Sombra ou Sede Hoje."
    },
    {
      icon: <Plus size={28} color="#10b981" />,
      badge: isEn ? "Step 3 of 5" : "Passo 3 de 5",
      title: isEn ? "Floating Add Plant Button (+)" : "Botão Flutuante de Adicao (+)",
      description: isEn
        ? "Look at the bottom-right corner! The green floating (+) button allows you to quickly add a new plant anytime from your phone or PC."
        : "Olhe no canto inferior direito! O botao verde flutuante (+) permite cadastrar rapidamente uma nova planta a qualquer momento pelo celular ou PC."
    },
    {
      icon: <Sparkles size={28} color="#10b981" />,
      badge: isEn ? "Step 4 of 5" : "Passo 4 de 5",
      title: isEn ? "Google Gemini AI Vision" : "IA Botânica Google Gemini",
      description: isEn
        ? "Snap a photo of any leaf or pot. Gemini AI recognizes the species, watering needs, soil recommendations, and cutting propagation guides."
        : "Tire uma foto de qualquer folha ou vaso. A IA Gemini reconhece a especie, necessidades de rega, substrato ideal e passos de mudas."
    },
    {
      icon: <HelpCircle size={28} color="#10b981" />,
      badge: isEn ? "Step 5 of 5" : "Passo 5 de 5",
      title: isEn ? "Offline PWA & Support" : "PWA 100% Offline & Suporte",
      description: isEn
        ? "Canto Alegre works offline! Access the top bar to install the app on your device, check software updates, or send feedback to our team."
        : "O Canto Alegre funciona sem internet! Acesse a barra superior para instalar o app no dispositivo, ver novidades ou enviar feedbacks para a equipe."
    }
  ];

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
    <div className="modal-overlay" onClick={handleFinish} style={{ zIndex: 120 }}>
      <div 
        className="modal-container tour-walkthrough-container" 
        onClick={e => e.stopPropagation()} 
        style={{
          maxWidth: '520px',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)'
        }}
      >
        {/* Header Bar */}
        <div className="modal-header" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              padding: '6px 12px',
              borderRadius: '50px',
              background: 'var(--primary-100, rgba(16, 185, 129, 0.15))',
              border: '1px solid var(--border-color)',
              color: 'var(--primary-500, #10b981)',
              fontSize: '0.8rem',
              fontWeight: 700
            }}>
              {stepData.badge}
            </div>
          </div>
          <button className="modal-close" onClick={handleFinish} title={isEn ? "Skip Tour" : "Pular Tour"}>
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body" style={{ padding: '28px 24px', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'var(--primary-50, rgba(16, 185, 129, 0.12))',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {stepData.icon}
          </div>

          <h3 style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            color: 'var(--primary-900)',
            marginBottom: '12px'
          }}>
            {stepData.title}
          </h3>

          <p style={{
            fontSize: '0.96rem',
            color: 'var(--text-main)',
            lineHeight: 1.65,
            maxWidth: '440px',
            margin: '0 auto 24px'
          }}>
            {stepData.description}
          </p>

          {/* Progress Indicator Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
            {TOUR_STEPS.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentStep(idx)}
                style={{
                  width: currentStep === idx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: currentStep === idx ? 'var(--primary-600, #10b981)' : 'var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer" style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={handleFinish}
            style={{ fontSize: '0.84rem' }}
          >
            <span>{isEn ? "Skip Tour" : "Pular Tour"}</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {currentStep > 0 && (
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={handlePrev}
              >
                <ArrowLeft size={15} />
                <span>{isEn ? "Back" : "Anterior"}</span>
              </button>
            )}

            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={handleNext}
              style={{ padding: '8px 18px' }}
            >
              {currentStep < TOUR_STEPS.length - 1 ? (
                <>
                  <span>{isEn ? "Next" : "Próximo"}</span>
                  <ArrowRight size={15} />
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  <span>{isEn ? "Finish" : "Concluir Tour"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
