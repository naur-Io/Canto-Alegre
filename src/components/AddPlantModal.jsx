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
import CameraCapture from './CameraCapture';
import { analyzePlantImage, autoCompletePlantByName, getDefaultPropagationForPlant, normalizeImageForAi } from '../services/geminiService';
import { getStoredApiKey } from '../services/storageService';
import { analyticsService } from '../services/analyticsService';

export default function AddPlantModal({ onClose, onSavePlant, onSave, onOpenKeyModal, hasApiKey }) {
  const [photo, setPhoto] = useState(null);
  const [inputPlantName, setInputPlantName] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState('ask_known_name'); // 'ask_known_name' | 'knows_name' | 'choose_photo' | 'form'
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

      setStep('form');
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

      setStep('form');
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
        />
      )}

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
          <div className="modal-header">
            <h3 className="modal-title">
              {step === 'ask_known_name'
                ? 'Adicionar Nova Planta'
                : step === 'knows_name'
                ? 'Digitar Nome & Auto-completar'
                : step === 'choose_photo'
                ? 'Identificação por Foto'
                : 'Ficha Completa da Planta'}
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
                  Você já conhece o nome da planta?
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
                  Escolha uma das opções abaixo para a Inteligência Artificial gerar a ficha botânica completa e o guia de mudas:
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
                        Sim, já sei o nome da planta
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 400, whiteSpace: 'normal', wordBreak: 'break-word', marginTop: '3px', lineHeight: 1.4 }}>
                        Digite o nome (ex: Jiboia, Monstera) para a IA dar auto-complete de todos os cuidados
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
                        Não sei o nome da planta
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400, whiteSpace: 'normal', wordBreak: 'break-word', marginTop: '3px', lineHeight: 1.4 }}>
                        Tire ou envie uma foto para a IA identificar a espécie e preencher a ficha
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
                    Nome da Planta / Nome Popular *
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={inputPlantName}
                    onChange={e => setInputPlantName(e.target.value)}
                    placeholder="Ex: Jiboia, Manjericão, Monstera, Samambaia..."
                    autoFocus
                    required
                    style={{ padding: '12px 14px', fontSize: '1rem' }}
                  />
                </div>

                {/* Foto Opcional */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>
                    Foto da Planta (Opcional)
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
                        Trocar Foto
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <label className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '10px', cursor: 'pointer' }}>
                        <Camera size={16} />
                        <span>Adicionar Foto (Opcional)</span>
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
                      <span>Consultando Guia Botânico & Auto-completando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Auto-completar Ficha com IA</span>
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
                    Voltar para a Pergunta Inicial
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
                      <h4 style={{ color: 'var(--primary-900)', marginBottom: '4px' }}>Tirar Foto da Planta</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Toque para abrir a câmera do seu celular ou webcam
                      </p>
                    </div>

                    <div style={{ textAlign: 'center', margin: '16px 0', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                      OU ESCOLHA UMA OPÇÃO
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* Botão Câmera do Aparelho (100% nativa) */}
                      <label className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', cursor: 'pointer' }}>
                        <Camera size={18} />
                        <span>Tirar Foto com a Câmera</span>
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
                        <span>Escolher Imagem da Galeria</span>
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
                        <span>Abrir Câmera ao Vivo na Tela</span>
                      </button>

                      {/* Google Lens */}
                      <button 
                        type="button"
                        className="btn btn-secondary"
                        onClick={openGoogleLens}
                        style={{ width: '100%', justifyContent: 'center', padding: '11px', gap: '8px' }}
                      >
                        <Search size={16} color="#4285F4" />
                        <span>Abrir Google Lens</span>
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
                        Cadastrar Planta Manualmente sem Foto
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setStep('ask_known_name')}
                        style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)' }}
                      >
                        Voltar para a Pergunta Inicial
                      </button>
                    </div>
                  </div>
                )}
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
                    <h4>Identificação & Origem</h4>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Nome da Planta / Nome Popular *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plantData.commonName} 
                        onChange={e => setPlantData({ ...plantData, commonName: e.target.value })}
                        placeholder="Ex: Aglaonema, Jiboia Amarela, Espada de São Jorge"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nome Científico (Botânico)</label>
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
                    <label className="form-label">De Onde Vem a Planta (Origem Nativa)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={plantData.origin || ''} 
                      onChange={e => setPlantData({ ...plantData, origin: e.target.value })}
                      placeholder="Ex: Florestas Tropicais do Sudeste Asiático (Tailândia, Filipinas)"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ambiente Ideal / Onde Fica a Planta *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={plantData.idealEnvironment || ''} 
                      onChange={e => setPlantData({ ...plantData, idealEnvironment: e.target.value })}
                      placeholder="Ex: Dentro de casa (Sala, Quarto), Fora de casa (Quintal), Terraço, Banheiro..."
                      required
                    />
                  </div>
                </div>

                {/* 2. ILUMINAÇÃO & LUZ */}
                <div className="form-section">
                  <div className="form-section-header">
                    <Sun size={18} className="section-icon" color="#d97706" />
                    <h4>Iluminação & Quantidade de Luz</h4>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Quantidade de Luz *</label>
                      <select 
                        className="form-select"
                        value={plantData.sunlight?.lightType || 'indireta'}
                        onChange={e => setPlantData({
                          ...plantData,
                          sunlight: { ...plantData.sunlight, lightType: e.target.value }
                        })}
                      >
                        <option value="direta">Luz Direta (Sol Pleno / Sol Forte)</option>
                        <option value="indireta">Luz Indireta (Meia Sombra / Luz Difusa)</option>
                        <option value="sombra">Sombra (Luz Baixa / Filtrada)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Horas / Período de Exposição</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plantData.sunlight?.hoursPerDay || ''} 
                        onChange={e => setPlantData({
                          ...plantData,
                          sunlight: { ...plantData.sunlight, hoursPerDay: e.target.value }
                        })}
                        placeholder="Ex: 4 a 6 horas de claridade difusa"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Observações sobre a Iluminação</label>
                    <textarea 
                      className="form-textarea" 
                      rows="2"
                      value={plantData.sunlight?.notes || ''} 
                      onChange={e => setPlantData({
                        ...plantData,
                        sunlight: { ...plantData.sunlight, notes: e.target.value }
                      })}
                      placeholder="Ex: Não usar luz natural direta, evitar sol direto porque queima as folhas..."
                    />
                  </div>
                </div>

                {/* 3. REGA & QUANTIDADE DE ÁGUA */}
                <div className="form-section">
                  <div className="form-section-header">
                    <Droplets size={18} className="section-icon" color="#0284c7" />
                    <h4>Rega & Quantidade de Água</h4>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Frequência (Vezes por semana)</label>
                      <select 
                        className="form-select"
                        value={plantData.watering?.frequencyTimesPerWeek || 2}
                        onChange={e => handleFrequencyTimesChange(e.target.value)}
                      >
                        <option value="1">1 vez por semana (~ a cada 7 dias)</option>
                        <option value="2">2 vezes por semana (~ a cada 3-4 dias)</option>
                        <option value="3">3 vezes por semana (~ a cada 2 dias)</option>
                        <option value="4">4 vezes por semana ou diária</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Quantidade de Água por Rega</label>
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
                    <label className="form-label">Observações e Modo de Rega</label>
                    <textarea 
                      className="form-textarea" 
                      rows="2"
                      value={plantData.watering?.description || ''} 
                      onChange={e => setPlantData({
                        ...plantData,
                        watering: { ...plantData.watering, description: e.target.value }
                      })}
                      placeholder="Ex: Regar quando os primeiros 2cm de solo secarem. Não deixar água acumulada no prato..."
                    />
                  </div>
                </div>

                {/* 4. GUIA DE MUDAS & PROPAGAÇÃO */}
                <div className="form-section">
                  <div className="form-section-header">
                    <Sprout size={18} className="section-icon" />
                    <h4>Como Tirar Mudas (Propagação & Cultivo)</h4>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Método Principal de Fazer Muda</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plantData.propagation?.method || ''} 
                        onChange={e => setPlantData({
                          ...plantData,
                          propagation: { ...plantData.propagation, method: e.target.value }
                        })}
                        placeholder="Ex: Estaquia de caule na água, Divisão de touceiras..."
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Melhor Época do Ano</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plantData.propagation?.bestSeason || ''} 
                        onChange={e => setPlantData({
                          ...plantData,
                          propagation: { ...plantData.propagation, bestSeason: e.target.value }
                        })}
                        placeholder="Ex: Primavera e Verão"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Tempo para Enraizar</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plantData.propagation?.rootingTime || ''} 
                        onChange={e => setPlantData({
                          ...plantData,
                          propagation: { ...plantData.propagation, rootingTime: e.target.value }
                        })}
                        placeholder="Ex: 2 a 4 semanas"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nível de Dificuldade</label>
                      <select 
                        className="form-select"
                        value={plantData.propagation?.difficulty || 'Fácil'}
                        onChange={e => setPlantData({
                          ...plantData,
                          propagation: { ...plantData.propagation, difficulty: e.target.value }
                        })}
                      >
                        <option value="Muito Fácil">Muito Fácil</option>
                        <option value="Fácil">Fácil</option>
                        <option value="Médio">Médio</option>
                        <option value="Avançado">Avançado</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Passo a Passo para Tirar a Muda (um por linha)</label>
                    <textarea 
                      className="form-textarea" 
                      rows="4"
                      value={Array.isArray(plantData.propagation?.stepByStep) ? plantData.propagation.stepByStep.join('\n') : (plantData.propagation?.stepByStep || '')} 
                      onChange={e => handlePropagationStepsChange(e.target.value)}
                      placeholder="1. Escolha um ramo saudável...&#10;2. Corte 1 cm abaixo do nó...&#10;3. Coloque em água limpa..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dica de Ouro / Segredo do Botânico</label>
                    <textarea 
                      className="form-textarea" 
                      rows="2"
                      value={plantData.propagation?.proTips || ''} 
                      onChange={e => setPlantData({
                        ...plantData,
                        propagation: { ...plantData.propagation, proTips: e.target.value }
                      })}
                      placeholder="Ex: Usar canela em pó na cicatriz para não dar fungo, manter na água fresca..."
                    />
                  </div>
                </div>

                {/* 5. SOLO, TEMPERATURA & CLIMA */}
                <div className="form-section">
                  <div className="form-section-header">
                    <Layers size={18} className="section-icon" color="#795548" />
                    <h4>Solo & Temperatura</h4>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tipo de Solo que ela mais gosta</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={plantData.soilType || ''} 
                      onChange={e => setPlantData({ ...plantData, soilType: e.target.value })}
                      placeholder="Ex: Solo rico em matéria orgânica, bem drenado, com terra vegetal e perlita"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Temperatura que a planta gosta (Clima)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={plantData.idealTemperature || ''} 
                      onChange={e => setPlantData({ ...plantData, idealTemperature: e.target.value })}
                      placeholder="Ex: 18°C a 27°C (clima quente e úmido, não tolera frio abaixo de 15°C)"
                    />
                  </div>
                </div>

                {/* 6. COMO CUIDAR, PODAS & RETIRADA DE FOLHAS */}
                <div className="form-section">
                  <div className="form-section-header">
                    <Scissors size={18} className="section-icon" color="#059669" />
                    <h4>Como Cuidar & Manutenção</h4>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Como cuidar (Tirar folhas secas, podas, limpeza)</label>
                    <textarea 
                      className="form-textarea" 
                      rows="3"
                      value={plantData.howToCare || ''} 
                      onChange={e => setPlantData({ ...plantData, howToCare: e.target.value })}
                      placeholder="Ex: Retirar folhas secas ou amareladas cortando na base com tesoura limpa. Limpar o pó das folhas com pano úmido..."
                    />
                  </div>
                </div>

                {/* 7. ADUBAÇÃO & OBSERVAÇÕES EXTRAS */}
                <div className="form-section">
                  <div className="form-section-header">
                    <Flower size={18} className="section-icon" color="#9333ea" />
                    <h4>Adubação & Observações Gerais</h4>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Tipo de Adubo</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plantData.fertilizer?.type || ''} 
                        onChange={e => setPlantData({
                          ...plantData,
                          fertilizer: { ...plantData.fertilizer, type: e.target.value }
                        })}
                        placeholder="Ex: NPK 10-10-10, Húmus de Minhoca, Bokashi"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Frequência de Adubação</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plantData.fertilizer?.frequency || ''} 
                        onChange={e => setPlantData({
                          ...plantData,
                          fertilizer: { ...plantData.fertilizer, frequency: e.target.value }
                        })}
                        placeholder="Ex: A cada 30 dias na Primavera/Verão"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Observações Adicionais</label>
                    <textarea 
                      className="form-textarea" 
                      rows="2"
                      value={plantData.notes || ''} 
                      onChange={e => setPlantData({ ...plantData, notes: e.target.value })}
                      placeholder="Ex: Evitar correntes de ar, excelente para purificar o ambiente..."
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
                    Voltar
                  </button>

                  <button type="submit" className="btn btn-primary">
                    <Check size={16} />
                    <span>Salvar no Meu Jardim</span>
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

