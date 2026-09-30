import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Sparkles, 
  Edit3, 
  Check, 
  Loader2, 
  Image as ImageIcon, 
  Info,
  Globe,
  Sun,
  Droplets,
  Thermometer,
  Layers,
  Scissors,
  Flower,
  FileText,
  Search,
  ExternalLink,
  Sprout,
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import CameraCapture from './CameraCapture';
import { analyzePlantImage, autoCompletePlantByName, getDefaultPropagationForPlant, normalizeImageForAi } from '../services/geminiService';
import { getStoredApiKey } from '../services/storageService';
import { analyticsService } from '../services/analyticsService';
import { TRANSLATIONS } from '../services/i18n';

export default function AddPlantModal({ onClose, onSavePlant, onSave, onOpenKeyModal, hasApiKey, currentLang = 'pt-BR' }) {
  const isEn = currentLang === 'en';
  const t = TRANSLATIONS[currentLang]?.addPlant || TRANSLATIONS['pt-BR'].addPlant;

  const [photo, setPhoto] = useState(null);
  const [inputPlantName, setInputPlantName] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState('ask_known_name'); // 'ask_known_name' | 'knows_name' | 'choose_photo' | 'reveal' | 'form'
  const [aiNotice, setAiNotice] = useState(null);
  const nativeCameraInputRef = useRef(null);
  
  // Dados completos do formulário da planta
  const [plantData, setPlantData] = useState({
    commonName: '',
    scientificName: '',
    origin: '',
    plantType: 'Luz Indireta / Meia Sombra',
    idealEnvironment: 'Dentro de casa (Sala, Quarto ou Escritório)',
    sunlight: {
      lightType: 'indireta', // 'direta' | 'indireta' | 'sombra'
      period: 'Luz Indireta Filtrada / Meia Sombra',
      hoursPerDay: '4 a 6 horas',
      notes: ''
    },
    watering: {
      frequencyTimesPerWeek: 2,
      frequencyDays: 3,
      amountMl: '150 - 200 ml',
      description: 'Regar quando a terra superficial secar.'
    },
    propagation: {
      method: 'Estaquia de caule na água ou solo',
      bestSeason: 'Primavera e Verão',
      rootingTime: '2 a 4 semanas',
      difficulty: 'Fácil',
      stepByStep: [
        '1. Escolha um ramo saudável com 2 a 3 nós e folhas novas.',
        '2. Corte cerca de 1 cm abaixo do nó com tesoura limpa.',
        '3. Remova as folhas inferiores e passe canela em pó no corte.',
        '4. Coloque a ponta em água limpa ou substrato úmido em luz difusa.',
        '5. Troque a água a cada 2 dias até enraizar.'
      ],
      proTips: 'Usar canela em pó na cicatriz para evitar fungos e manter em local aquecido com luz indireta.'
    },
    soilType: 'Solo rico em matéria orgânica, leve e com boa drenagem',
    idealTemperature: '18°C a 27°C (clima ameno a quente)',
    howToCare: 'Retirar folhas secas ou amareladas cortando na base com tesoura limpa. Limpar a poeira das folhas periodicamente.',
    fertilizer: {
      type: 'NPK 10-10-10 ou Húmus de Minhoca',
      frequency: 'A cada 30 dias na Primavera/Verão',
      notes: 'Diluir na água da rega'
    },
    careTips: ['Manter em local bem arejado', 'Borrifar água nas folhas se o ar estiver seco'],
    notes: ''
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawResult = reader.result;
        try {
          const normalized = await normalizeImageForAi(rawResult);
          setPhoto(normalized ? normalized.dataUrl : rawResult);
        } catch (normErr) {
          setPhoto(rawResult);
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleCameraZoneClick = () => {
    // Se for dispositivo móvel (Android / iOS), aciona a câmera nativa do sistema diretamente
    const isMobileDevice = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
    if (isMobileDevice && nativeCameraInputRef.current) {
      nativeCameraInputRef.current.click();
    } else {
      setShowCamera(true);
    }
  };

  const handleCameraCapture = async (capturedBase64) => {
    try {
      const normalized = await normalizeImageForAi(capturedBase64);
      setPhoto(normalized ? normalized.dataUrl : capturedBase64);
    } catch (normErr) {
      setPhoto(capturedBase64);
    }
    setShowCamera(false);
  };

  const handleFrequencyTimesChange = (times) => {
    const num = parseInt(times) || 1;
    let days = 3;
    if (num <= 1) days = 7;
    else if (num === 2) days = 3;
    else if (num === 3) days = 2;
    else days = 1;

    setPlantData(prev => ({
      ...prev,
      watering: {
        ...prev.watering,
        frequencyTimesPerWeek: num,
        frequencyDays: days
      }
    }));
  };

  const handlePropagationStepsChange = (text) => {
    const steps = text.split('\n').map(s => s.trim()).filter(Boolean);
    setPlantData(prev => ({
      ...prev,
      propagation: {
        ...prev.propagation,
        stepByStep: steps
      }
    }));
  };

  const runAiAnalysis = async () => {
    if (!photo) return;
    setIsAnalyzing(true);
    setAiNotice(null);
    try {
      const apiKey = getStoredApiKey();
      const result = await analyzePlantImage(photo, apiKey);
      
      if (result._isFallback) {
        setAiNotice('Sua chave foi direcionada para o catálogo botânico inteligente. Você pode ajustar todos os campos abaixo livremente!');
      }

      const propagationResult = result.propagation && result.propagation.method 
        ? result.propagation 
        : getDefaultPropagationForPlant(result);

      setPlantData(prev => ({
        ...prev,
        commonName: result.commonName || prev.commonName || 'Planta Identificada',
        scientificName: result.scientificName || prev.scientificName || '',
        origin: result.origin || prev.origin || '',
        plantType: result.plantType || prev.plantType || 'Luz Indireta / Meia Sombra',
        idealEnvironment: result.idealEnvironment || prev.idealEnvironment,
        sunlight: {
          lightType: result.sunlight?.lightType || (result.sunlight?.period?.toLowerCase().includes('direto') ? 'direta' : result.sunlight?.period?.toLowerCase().includes('sombra') ? 'sombra' : 'indireta'),
          period: result.sunlight?.period || prev.sunlight.period,
          hoursPerDay: result.sunlight?.hoursPerDay || prev.sunlight.hoursPerDay,
          notes: result.sunlight?.notes || result.sunlight?.habits || prev.sunlight.notes
        },
        watering: {
          frequencyTimesPerWeek: result.watering?.frequencyTimesPerWeek || (result.watering?.frequencyDays <= 2 ? 3 : result.watering?.frequencyDays <= 4 ? 2 : 1),
          frequencyDays: result.watering?.frequencyDays || prev.watering.frequencyDays,
          amountMl: result.watering?.amountMl || prev.watering.amountMl,
          description: result.watering?.description || prev.watering.description
        },
        propagation: propagationResult,
        soilType: result.soilType || prev.soilType,
        idealTemperature: result.idealTemperature || prev.idealTemperature,
        howToCare: result.howToCare || (Array.isArray(result.careTips) ? result.careTips.join('\n') : prev.howToCare),
        fertilizer: {
          type: result.fertilizer?.type || prev.fertilizer.type,
          frequency: result.fertilizer?.frequency || prev.fertilizer.frequency,
          notes: result.fertilizer?.notes || prev.fertilizer.notes
        },
        careTips: result.careTips || prev.careTips,
        notes: result.notes || prev.notes
      }));

      setStep('reveal');
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      alert(`Não foi possível conectar à IA Gemini (${err.message || 'Erro de conexão'}).\n\nCarregamos os campos para preenchimento manual.`);
      setStep('form');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runAiAutoCompleteByName = async () => {
    if (!inputPlantName || !inputPlantName.trim()) return;
    setIsAnalyzing(true);
    setAiNotice(null);
    try {
      const apiKey = getStoredApiKey();
      const result = await autoCompletePlantByName(inputPlantName.trim(), apiKey);

      const propagationResult = result.propagation && result.propagation.method 
        ? result.propagation 
        : getDefaultPropagationForPlant(result);

      setPlantData(prev => ({
        ...prev,
        commonName: result.commonName || inputPlantName.trim(),
        scientificName: result.scientificName || prev.scientificName,
        origin: result.origin || prev.origin,
        plantType: result.plantType || prev.plantType,
        idealEnvironment: result.idealEnvironment || prev.idealEnvironment,
        sunlight: {
          lightType: result.sunlight?.lightType || (result.sunlight?.period?.toLowerCase().includes('direto') ? 'direta' : result.sunlight?.period?.toLowerCase().includes('sombra') ? 'sombra' : 'indireta'),
          period: result.sunlight?.period || prev.sunlight.period,
          hoursPerDay: result.sunlight?.hoursPerDay || prev.sunlight.hoursPerDay,
          notes: result.sunlight?.notes || prev.sunlight.notes
        },
        watering: {
          frequencyTimesPerWeek: result.watering?.frequencyTimesPerWeek || 2,
          frequencyDays: result.watering?.frequencyDays || prev.watering.frequencyDays,
          amountMl: result.watering?.amountMl || prev.watering.amountMl,
          description: result.watering?.description || prev.watering.description
        },
        propagation: propagationResult,
        soilType: result.soilType || prev.soilType,
        idealTemperature: result.idealTemperature || prev.idealTemperature,
        howToCare: result.howToCare || (Array.isArray(result.careTips) ? result.careTips.join('\n') : prev.howToCare),
        fertilizer: {
          type: result.fertilizer?.type || prev.fertilizer.type,
          frequency: result.fertilizer?.frequency || prev.fertilizer.frequency,
          notes: result.fertilizer?.notes || prev.fertilizer.notes
        },
        careTips: result.careTips || prev.careTips,
        notes: result.notes || prev.notes
      }));

      setStep('reveal');
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      alert(`Não foi possível auto-completar com IA: ${err.message || 'Erro'}.\nCampos liberados para preenchimento manual.`);
      setPlantData(prev => ({ ...prev, commonName: inputPlantName.trim() }));
      setStep('form');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualEntry = () => {
    setStep('form');
  };

  const openGoogleLens = () => {
    window.open('https://lens.google.com/', '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    analyticsService.trackEvent('Jardim', 'add_plant', plantData.commonName || 'Nova Planta');
    const saveFn = onSavePlant || onSave;
    if (saveFn) {
      saveFn({
        ...plantData,
        photoUrl: photo || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
        lastWatered: new Date().toISOString()
      });
    }
    onClose();
  };

  return (
    <>
      {showCamera && (
        <CameraCapture 
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
          currentLang={currentLang}
        />
      )}

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
          <div className="modal-header">
            <h3 className="modal-title">
              {step === 'ask_known_name'
                ? (t.title || 'Adicionar Nova Planta')
                : step === 'knows_name'
                ? (t.knowNameTitle || 'Digitar Nome & Auto-completar')
                : step === 'choose_photo'
                ? (t.photoTitle || 'Identificação por Foto')
                : step === 'reveal'
                ? (t.revealTitle || 'Esta é a sua')
                : (t.formTitle || 'Ficha Completa da Planta')}
            </h3>
            <button className="modal-close" onClick={onClose} aria-label="Fechar">
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            {/* ETAPA 0: PERGUNTA INICIAL - VOCÊ JÁ CONHECE O NOME DA PLANTA? */}
            {step === 'ask_known_name' && (
              <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  background: 'var(--primary-50, rgba(16, 185, 129, 0.12))',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <HelpCircle size={32} color="var(--primary-600)" />
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '8px' }}>
                  {t.askTitle || 'Você já conhece o nome da planta?'}
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
                  {t.askSubtitle || 'Escolha uma das opções abaixo para a Inteligência Artificial gerar a ficha botânica completa e o guia de mudas:'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
                  {/* Opção 1: Sim, já sei o nome */}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setStep('knows_name')}
                    style={{
                      padding: '16px 20px',
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      fontSize: '1rem',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      width: '100%',
                      whiteSpace: 'normal'
                    }}
                  >
                    <CheckCircle2 size={24} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {t.optionKnowsNameTitle || 'Sim, já sei o nome da planta'}
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 400, whiteSpace: 'normal', wordBreak: 'break-word', marginTop: '3px', lineHeight: 1.4 }}>
                        {t.optionKnowsNameDesc || 'Digite o nome (ex: Jiboia, Monstera) para a IA dar auto-complete de todos os cuidados'}
                      </div>
                    </div>
                  </button>

                  {/* Opção 2: Não sei o nome (Usar Câmera / Foto) */}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep('choose_photo')}
                    style={{
                      padding: '16px 20px',
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      fontSize: '1rem',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      width: '100%',
                      whiteSpace: 'normal'
                    }}
                  >
                    <Camera size={24} color="var(--primary-600)" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {t.optionPhotoTitle || 'Não sei o nome da planta'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400, whiteSpace: 'normal', wordBreak: 'break-word', marginTop: '3px', lineHeight: 1.4 }}>
                        {t.optionPhotoDesc || 'Tire ou envie uma foto para a IA identificar a espécie e preencher a ficha'}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 1A: DIGITAR NOME E AUTO-COMPLETAR COM IA */}
            {step === 'knows_name' && (
              <div>
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px', display: 'block' }}>
                    {isEn ? 'Plant Name / Common Name *' : 'Nome da Planta / Nome Popular *'}
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={inputPlantName}
                    onChange={e => setInputPlantName(e.target.value)}
                    placeholder={isEn ? "e.g. Pothos, Basil, Monstera, Fern..." : "Ex: Jiboia, Manjericão, Monstera, Samambaia..."}
                    autoFocus
                    required
                    style={{ padding: '12px 14px', fontSize: '1rem' }}
                  />
                </div>

                {/* Foto Opcional */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>
                    {isEn ? 'Plant Photo (Optional)' : 'Foto da Planta (Opcional)'}
                  </label>
                  {photo ? (
                    <div className="preview-img-container" style={{ maxHeight: '180px', marginBottom: '10px' }}>
                      <img src={photo} alt="Foto da planta" className="preview-img" />
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setPhoto(null)}
                        style={{ marginTop: '8px' }}
                      >
                        {isEn ? 'Change Photo' : 'Trocar Foto'}
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <label className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '10px', cursor: 'pointer' }}>
                        <Camera size={16} />
                        <span>{isEn ? 'Add Photo (Optional)' : 'Adicionar Foto (Opcional)'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileUpload} 
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Botão de Auto-complete com IA */}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={runAiAutoCompleteByName}
                  disabled={isAnalyzing || !inputPlantName.trim()}
                  style={{ width: '100%', padding: '14px', fontSize: '0.98rem', fontWeight: 700, gap: '8px' }}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                      <span>{isEn ? 'Consulting Botanical AI & Auto-completing...' : 'Consultando Guia Botânico & Auto-completando...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>{isEn ? 'Auto-complete Sheet with AI' : 'Auto-completar Ficha com IA'}</span>
                    </>
                  )}
                </button>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setStep('ask_known_name')}
                    style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)' }}
                  >
                    {isEn ? 'Back to Initial Question' : 'Voltar para a Pergunta Inicial'}
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 1B: IDENTIFICAÇÃO POR FOTO */}
            {step === 'choose_photo' && (
              <div>
                {/* Banner Informativo sobre Modo IA vs Simulação */}
                {hasApiKey ? (
                  <div className="ai-mode-banner active">
                    <Sparkles size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>IA Gemini Flash Gratuita Conectada</strong>
                      <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>
                        Sua foto será analisada pelo Google Gemini com ficha completa de cuidados e guia de mudas.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="ai-mode-banner simulated">
                    <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Modo de Demonstração Botânica</strong>
                      <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>
                        Você pode usar o catálogo botânico ou{' '}
                        <button 
                          type="button" 
                          className="inline-link-btn" 
                          onClick={() => {
                            onClose();
                            onOpenKeyModal?.();
                          }}
                        >
                          conectar chave gratuita do Gemini
                        </button>
                      </p>
                    </div>
                  </div>
                )}

                {/* Visualizador de Foto Selecionada */}
                {photo ? (
                  <div style={{ width: '100%' }}>
                    <div className="preview-img-container">
                      <img src={photo} alt="Foto da planta" className="preview-img" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                      <button 
                        type="button"
                        className="btn btn-primary"
                        onClick={runAiAnalysis}
                        disabled={isAnalyzing}
                        style={{ width: '100%', padding: '12px 16px', fontSize: '0.95rem' }}
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                            <span>Identificando Espécie & Guia de Mudas...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} />
                            <span>Identificar Planta & Guia de Mudas com IA</span>
                          </>
                        )}
                      </button>

                      <button 
                        type="button"
                        className="btn btn-secondary"
                        onClick={openGoogleLens}
                        style={{ width: '100%', padding: '10px', gap: '8px' }}
                      >
                        <Search size={16} color="#4285F4" />
                        <span>Identificar no Google Lens</span>
                        <ExternalLink size={14} style={{ opacity: 0.6 }} />
                      </button>

                      <button 
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setPhoto(null)}
                        disabled={isAnalyzing}
                        style={{ width: '100%', padding: '10px' }}
                      >
                        <ImageIcon size={16} />
                        <span>Tirar ou Escolher Outra Foto</span>
                      </button>
                    </div>

                    {/* Dica para iPhone */}
                    <div style={{ background: 'var(--primary-50)', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      <strong>Dica no iPhone:</strong> Você também pode abrir a foto no aplicativo Fotos do iPhone e tocar no botão de informações para ver o nome da espécie identificado nativamente pelo iOS.
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <button 
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleManualEntry}
                        style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)' }}
                      >
                        Ou continuar para preenchimento manual
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Zona de Escolha de Foto (Câmera ou Arquivo) */
                  <div>
                    {/* Input invisível para acionamento direto da câmera nativa via ref */}
                    <input 
                      ref={nativeCameraInputRef}
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      onChange={handleFileUpload} 
                      style={{ display: 'none' }}
                    />

                    <div className="upload-zone" onClick={handleCameraZoneClick} style={{ cursor: 'pointer' }}>
                      <Camera className="upload-icon" />
                      <h4 style={{ color: 'var(--primary-900)', marginBottom: '4px' }}>{isEn ? 'Take Plant Photo' : 'Tirar Foto da Planta'}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {isEn ? 'Tap to open your phone camera or webcam' : 'Toque para abrir a câmera do seu celular ou webcam'}
                      </p>
                    </div>

                    <div style={{ textAlign: 'center', margin: '16px 0', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                      {isEn ? 'OR CHOOSE AN OPTION' : 'OU ESCOLHA UMA OPÇÃO'}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* Botão Câmera do Aparelho (100% nativa) */}
                      <label className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', cursor: 'pointer' }}>
                        <Camera size={18} />
                        <span>{isEn ? 'Take Photo with Camera' : 'Tirar Foto com a Câmera'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          capture="environment" 
                          onChange={handleFileUpload} 
                          style={{ display: 'none' }}
                        />
                      </label>

                      {/* Botão Escolher da Galeria */}
                      <label className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '12px', cursor: 'pointer' }}>
                        <Upload size={18} />
                        <span>{isEn ? 'Choose Image from Gallery' : 'Escolher Imagem da Galeria'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileUpload} 
                          style={{ display: 'none' }}
                        />
                      </label>

                      {/* Botão Câmera ao Vivo na Tela */}
                      <button 
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowCamera(true)}
                        style={{ width: '100%', justifyContent: 'center', padding: '11px', gap: '8px' }}
                      >
                        <Camera size={16} />
                        <span>{isEn ? 'Open Live Camera View' : 'Abrir Câmera ao Vivo na Tela'}</span>
                      </button>

                      {/* Google Lens */}
                      <button 
                        type="button"
                        className="btn btn-secondary"
                        onClick={openGoogleLens}
                        style={{ width: '100%', justifyContent: 'center', padding: '11px', gap: '8px' }}
                      >
                        <Search size={16} color="#4285F4" />
                        <span>{isEn ? 'Open Google Lens' : 'Abrir Google Lens'}</span>
                        <ExternalLink size={14} style={{ opacity: 0.6 }} />
                      </button>
                    </div>

                    <div style={{ marginTop: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button 
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleManualEntry}
                        style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)' }}
                      >
                        {isEn ? 'Register Plant Manually Without Photo' : 'Cadastrar Planta Manualmente sem Foto'}
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setStep('ask_known_name')}
                        style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)' }}
                      >
                        {isEn ? 'Back to Initial Question' : 'Voltar para a Pergunta Inicial'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ETAPA REVELAÇÃO DA ANIMAÇÃO DA PLANTA IDENTIFICADA */}
            {step === 'reveal' && (
              <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                <div 
                  className="reveal-image-wrapper"
                  style={{
                    position: 'relative',
                    width: '170px',
                    height: '170px',
                    margin: '0 auto 16px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 12px 32px rgba(16, 185, 129, 0.35), 0 0 0 4px var(--primary-500)',
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  <img 
                    src={photo || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80'} 
                    alt={plantData.commonName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--primary-50, rgba(16, 185, 129, 0.12))',
                  color: 'var(--primary-700, #047857)',
                  padding: '6px 16px',
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '12px',
                  border: '1px solid var(--border-color)'
                }}>
                  <Sparkles size={15} color="var(--primary-600)" />
                  <span>{t.revealSubtitle || 'Espécie identificada com sucesso pela Inteligência Artificial!'}</span>
                </div>

                <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '4px' }}>
                  {isEn ? `This is your ${plantData.commonName}!` : `Esta é a sua ${plantData.commonName}!`}
                </h2>

                {plantData.scientificName && (
                  <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    {plantData.scientificName}
                  </p>
                )}

                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.5 }}>
                  {isEn 
                    ? 'We generated the complete care plan, ideal environment, watering schedule, and cutting propagation guide for this species.' 
                    : 'Geramos o plano de regas, ambiente ideal, temperatura recomendada e o guia completo para você tirar mudas com segurança.'}
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setStep('form')}
                  style={{
                    padding: '14px 28px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-full)',
                    margin: '0 auto',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <Sparkles size={18} />
                  <span>{t.revealBtn || 'Confirmar & Ver Ficha Botânica'}</span>
                </button>
              </div>
            )}

            {/* ETAPA 2: FORMULÁRIO DE REVISÃO E SALVAMENTO */}
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="plant-manual-form">
                {aiNotice && (
                  <div className="ai-mode-banner simulated" style={{ marginBottom: '10px' }}>
                    <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{aiNotice}</span>
                  </div>
                )}

                {/* 1. IDENTIFICAÇÃO E ORIGEM */}
                <div className="form-section">
                  <div className="form-section-header">
                    <Globe size={18} className="section-icon" />
                    <h4>{isEn ? 'Identification & Origin' : 'Identificação & Origem'}</h4>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">{isEn ? 'Plant Name / Common Name *' : 'Nome da Planta / Nome Popular *'}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plantData.commonName} 
                        onChange={e => setPlantData({ ...plantData, commonName: e.target.value })}
                        placeholder={isEn ? "e.g. Pothos, Yellow Pothos, Snake Plant" : "Ex: Aglaonema, Jiboia Amarela, Espada de São Jorge"}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{isEn ? 'Scientific Name (Botanical)' : 'Nome Científico (Botânico)'}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plantData.scientificName} 
                        onChange={e => setPlantData({ ...plantData, scientificName: e.target.value })}
                        placeholder="Ex: Aglaonema commutatum"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{isEn ? 'Plant Origin (Native Country/Region)' : 'De Onde Vem a Planta (Origem Nativa)'}</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={plantData.origin || ''} 
                      onChange={e => setPlantData({ ...plantData, origin: e.target.value })}
                      placeholder={isEn ? "e.g. Tropical Rainforests of Southeast Asia (Thailand, Philippines)" : "Ex: Florestas Tropicais do Sudeste Asiático (Tailândia, Filipinas)"}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{isEn ? 'Ideal Environment / Location *' : 'Ambiente Ideal / Onde Fica a Planta *'}</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={plantData.idealEnvironment || ''} 
                      onChange={e => setPlantData({ ...plantData, idealEnvironment: e.target.value })}
                      placeholder={isEn ? "e.g. Indoor (Living Room, Bedroom), Outdoor (Yard), Balcony, Bathroom..." : "Ex: Dentro de casa (Sala, Quarto), Fora de casa (Quintal), Terraço, Banheiro..."}
                      required
                    />
                  </div>
                </div>

                {/* 2. ILUMINAÇÃO & LUZ */}
                <div className="form-section">
                  <div className="form-section-header">
                    <Sun size={18} className="section-icon" color="#d97706" />
                    <h4>{isEn ? 'Sunlight & Lighting' : 'Iluminação & Quantidade de Luz'}</h4>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">{isEn ? 'Light Amount *' : 'Quantidade de Luz *'}</label>
                      <select 
                        className="form-select"
                        value={plantData.sunlight?.lightType || 'indireta'}
                        onChange={e => setPlantData({
                          ...plantData,
                          sunlight: { ...plantData.sunlight, lightType: e.target.value }
                        })}
                      >
                        <option value="direta">{isEn ? 'Direct Light (Full Sun)' : 'Luz Direta (Sol Pleno / Sol Forte)'}</option>
                        <option value="indireta">{isEn ? 'Indirect Light (Partial Shade)' : 'Luz Indireta (Meia Sombra / Luz Difusa)'}</option>
                        <option value="sombra">{isEn ? 'Shade (Low Light / Filtered)' : 'Sombra (Luz Baixa / Filtrada)'}</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{isEn ? 'Hours / Exposure Period' : 'Horas / Período de Exposição'}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plantData.sunlight?.hoursPerDay || ''} 
                        onChange={e => setPlantData({
                          ...plantData,
                          sunlight: { ...plantData.sunlight, hoursPerDay: e.target.value }
                        })}
                        placeholder={isEn ? "e.g. 4 to 6 hours of filtered light" : "Ex: 4 a 6 horas de claridade difusa"}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{isEn ? 'Lighting Notes' : 'Observações sobre a Iluminação'}</label>
                    <textarea 
                      className="form-textarea" 
                      rows="2"
                      value={plantData.sunlight?.notes || ''} 
                      onChange={e => setPlantData({
                        ...plantData,
                        sunlight: { ...plantData.sunlight, notes: e.target.value }
                      })}
                      placeholder={isEn ? "e.g. Avoid harsh direct sun to prevent leaf sunburn..." : "Ex: Não usar luz natural direta, evitar sol direto porque queima as folhas..."}
                    />
                  </div>
                </div>

                {/* 3. REGA & QUANTIDADE DE ÁGUA */}
                <div className="form-section">
                  <div className="form-section-header">
                    <Droplets size={18} className="section-icon" color="#0284c7" />
                    <h4>{isEn ? 'Watering Schedule & Water' : 'Rega & Quantidade de Água'}</h4>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">{isEn ? 'Frequency (Times per week)' : 'Frequência (Vezes por semana)'}</label>
                      <select 
                        className="form-select"
                        value={plantData.watering?.frequencyTimesPerWeek || 2}
                        onChange={e => handleFrequencyTimesChange(e.target.value)}
                      >
                        <option value="1">{isEn ? '1 time per week (~ every 7 days)' : '1 vez por semana (~ a cada 7 dias)'}</option>
                        <option value="2">{isEn ? '2 times per week (~ every 3-4 days)' : '2 vezes por semana (~ a cada 3-4 dias)'}</option>
                        <option value="3">{isEn ? '3 times per week (~ every 2 days)' : '3 vezes por semana (~ a cada 2 dias)'}</option>
                        <option value="4">{isEn ? '4 times per week or daily' : '4 vezes por semana ou diária'}</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{isEn ? 'Water Volume per Watering' : 'Quantidade de Água por Rega'}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plantData.watering?.amountMl || ''} 
                        onChange={e => setPlantData({
                          ...plantData,
                          watering: { ...plantData.watering, amountMl: e.target.value }
                        })}
                        placeholder="Ex: 150 - 200 ml"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{isEn ? 'Watering Notes & Method' : 'Observações e Modo de Rega'}</label>
                    <textarea 
                      className="form-textarea" 
                      rows="2"
                      value={plantData.watering?.description || ''} 
                      onChange={e => setPlantData({
                        ...plantData,
                        watering: { ...plantData.watering, description: e.target.value }
                      })}
                      placeholder={isEn ? "e.g. Water when top 2cm of soil dries out..." : "Ex: Regar quando os primeiros 2cm de solo secarem. Não deixar água acumulada no prato..."}
                    />
                  </div>
                </div>

                {/* 4. GUIA DE MUDAS & PROPAGAÇÃO */}
                <div className="form-section">
                  <div className="form-section-header">
                    <Sprout size={18} className="section-icon" />
                    <h4>{isEn ? 'How to Take Cuttings (Propagation)' : 'Como Tirar Mudas (Propagação & Cultivo)'}</h4>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">{isEn ? 'Primary Propagation Method' : 'Método Principal de Fazer Muda'}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plantData.propagation?.method || ''} 
                        onChange={e => setPlantData({
                          ...plantData,
                          propagation: { ...plantData.propagation, method: e.target.value }
                        })}
                        placeholder={isEn ? "e.g. Stem cuttings in water, Clump division..." : "Ex: Estaquia de caule na água, Divisão de touceiras..."}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{isEn ? 'Best Season of the Year' : 'Melhor Época do Ano'}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plantData.propagation?.bestSeason || ''} 
                        onChange={e => setPlantData({
                          ...plantData,
                          propagation: { ...plantData.propagation, bestSeason: e.target.value }
                        })}
                        placeholder={isEn ? "e.g. Spring & Summer" : "Ex: Primavera e Verão"}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">{isEn ? 'Time to Root' : 'Tempo para Enraizar'}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plantData.propagation?.rootingTime || ''} 
                        onChange={e => setPlantData({
                          ...plantData,
                          propagation: { ...plantData.propagation, rootingTime: e.target.value }
                        })}
                        placeholder={isEn ? "e.g. 2 to 4 weeks" : "Ex: 2 a 4 semanas"}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{isEn ? 'Difficulty Level' : 'Nível de Dificuldade'}</label>
                      <select 
                        className="form-select"
                        value={plantData.propagation?.difficulty || 'Fácil'}
                        onChange={e => setPlantData({
                          ...plantData,
                          propagation: { ...plantData.propagation, difficulty: e.target.value }
                        })}
                      >
                        <option value="Muito Fácil">{isEn ? 'Very Easy' : 'Muito Fácil'}</option>
                        <option value="Fácil">{isEn ? 'Easy' : 'Fácil'}</option>
                        <option value="Médio">{isEn ? 'Medium' : 'Médio'}</option>
                        <option value="Avançado">{isEn ? 'Advanced' : 'Avançado'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{isEn ? 'Step-by-step Cutting Guide (one per line)' : 'Passo a Passo para Tirar a Muda (um por linha)'}</label>
                    <textarea 
                      className="form-textarea" 
                      rows="4"
                      value={Array.isArray(plantData.propagation?.stepByStep) ? plantData.propagation.stepByStep.join('\n') : (plantData.propagation?.stepByStep || '')} 
                      onChange={e => handlePropagationStepsChange(e.target.value)}
                      placeholder={isEn ? "1. Select a healthy stem...&#10;2. Cut 1cm below node...&#10;3. Place in clean water..." : "1. Escolha um ramo saudável...&#10;2. Corte 1 cm abaixo do nó...&#10;3. Coloque em água limpa..."}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{isEn ? 'Botanist Secret Tip' : 'Dica de Ouro / Segredo do Botânico'}</label>
                    <textarea 
                      className="form-textarea" 
                      rows="2"
                      value={plantData.propagation?.proTips || ''} 
                      onChange={e => setPlantData({
                        ...plantData,
                        propagation: { ...plantData.propagation, proTips: e.target.value }
                      })}
                      placeholder={isEn ? "e.g. Dust cut stem with cinnamon powder to prevent fungus..." : "Ex: Usar canela em pó na cicatriz para não dar fungo, manter na água fresca..."}
                    />
                  </div>
                </div>

                {/* 5. SOLO, TEMPERATURA & CLIMA */}
                <div className="form-section">
                  <div className="form-section-header">
                    <Layers size={18} className="section-icon" color="#795548" />
                    <h4>{isEn ? 'Soil & Climate' : 'Solo & Temperatura'}</h4>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{isEn ? 'Preferred Soil Type' : 'Tipo de Solo que ela mais gosta'}</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={plantData.soilType || ''} 
                      onChange={e => setPlantData({ ...plantData, soilType: e.target.value })}
                      placeholder={isEn ? "e.g. Soil rich in organic matter, well draining..." : "Ex: Solo rico em matéria orgânica, bem drenado, com terra vegetal e perlita"}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{isEn ? 'Preferred Temperature & Climate' : 'Temperatura que a planta gosta (Clima)'}</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={plantData.idealTemperature || ''} 
                      onChange={e => setPlantData({ ...plantData, idealTemperature: e.target.value })}
                      placeholder={isEn ? "e.g. 18°C to 27°C (mild to warm climate)" : "Ex: 18°C a 27°C (clima quente e úmido, não tolera frio abaixo de 15°C)"}
                    />
                  </div>
                </div>

                {/* 6. COMO CUIDAR, PODAS & RETIRADA DE FOLHAS */}
                <div className="form-section">
                  <div className="form-section-header">
                    <Scissors size={18} className="section-icon" color="#059669" />
                    <h4>{isEn ? 'Care & Maintenance' : 'Como Cuidar & Manutenção'}</h4>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{isEn ? 'Care guide (Pruning, dry leaves, cleaning)' : 'Como cuidar (Tirar folhas secas, podas, limpeza)'}</label>
                    <textarea 
                      className="form-textarea" 
                      rows="3"
                      value={plantData.howToCare || ''} 
                      onChange={e => setPlantData({ ...plantData, howToCare: e.target.value })}
                      placeholder={isEn ? "e.g. Trim dry leaves at base with clean shears..." : "Ex: Retirar folhas secas ou amareladas cortando na base com tesoura limpa. Limpar o pó das folhas com pano úmido..."}
                    />
                  </div>
                </div>

                {/* 7. ADUBAÇÃO & OBSERVAÇÕES EXTRAS */}
                <div className="form-section">
                  <div className="form-section-header">
                    <Flower size={18} className="section-icon" color="#9333ea" />
                    <h4>{isEn ? 'Fertilization & General Notes' : 'Adubação & Observações Gerais'}</h4>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">{isEn ? 'Fertilizer Type' : 'Tipo de Adubo'}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plantData.fertilizer?.type || ''} 
                        onChange={e => setPlantData({
                          ...plantData,
                          fertilizer: { ...plantData.fertilizer, type: e.target.value }
                        })}
                        placeholder={isEn ? "e.g. NPK 10-10-10, Worm Castings" : "Ex: NPK 10-10-10, Húmus de Minhoca, Bokashi"}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{isEn ? 'Fertilization Frequency' : 'Frequência de Adubação'}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plantData.fertilizer?.frequency || ''} 
                        onChange={e => setPlantData({
                          ...plantData,
                          fertilizer: { ...plantData.fertilizer, frequency: e.target.value }
                        })}
                        placeholder={isEn ? "e.g. Every 30 days in Spring/Summer" : "Ex: A cada 30 dias na Primavera/Verão"}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{isEn ? 'Additional Notes' : 'Observações Adicionais'}</label>
                    <textarea 
                      className="form-textarea" 
                      rows="2"
                      value={plantData.notes || ''} 
                      onChange={e => setPlantData({ ...plantData, notes: e.target.value })}
                      placeholder={isEn ? "e.g. Avoid cold drafts, great for air purification..." : "Ex: Evitar correntes de ar, excelente para purificar o ambiente..."}
                    />
                  </div>
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', position: 'sticky', bottom: 0, background: 'var(--surface)', padding: '12px 0', borderTop: '1px solid var(--border-color)', zIndex: 5 }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setStep('ask_known_name')}
                  >
                    {isEn ? 'Back' : 'Voltar'}
                  </button>

                  <button type="submit" className="btn btn-primary">
                    <Check size={16} />
                    <span>{isEn ? 'Save to My Garden' : 'Salvar no Meu Jardim'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

