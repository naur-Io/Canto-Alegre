import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, Check } from 'lucide-react';
import { normalizeImageForAi } from '../services/geminiService';

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const nativeInputRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (traseira) ou 'user' (frontal)
  const [capturedImage, setCapturedImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const stopCamera = () => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
      } catch (err) {
        console.warn('Erro ao interromper tracks:', err);
      }
      streamRef.current = null;
    }
    setStream(null);
  };

  const startCamera = async () => {
    stopCamera();
    setErrorMsg('');
    setIsLoading(true);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg('Seu navegador não suporta visualização de câmera ao vivo.');
      setIsLoading(false);
      return;
    }

    let mediaStream = null;

    // Tentativa 1: facingMode ideal com dimensões flexíveis
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
    } catch (err1) {
      console.warn('Tentativa 1 com resolução ideal falhou:', err1);
      // Tentativa 2: facingMode ideal sem restrição de tamanho
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode }
          },
          audio: false
        });
      } catch (err2) {
        console.warn('Tentativa 2 falhou:', err2);
        // Tentativa 3: qualquer câmera disponível
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        } catch (err3) {
          console.error('Todas as tentativas WebRTC falharam:', err3);
          setErrorMsg('Não foi possível iniciar o vídeo da câmera. Verifique as permissões ou use a câmera do sistema.');
          setIsLoading(false);
          return;
        }
      }
    }

    streamRef.current = mediaStream;
    setStream(mediaStream);
    setIsLoading(false);

    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.setAttribute('playsinline', 'true');
      videoRef.current.setAttribute('muted', 'true');
      try {
        await videoRef.current.play();
      } catch (playErr) {
        console.warn('Falha no video.play():', playErr);
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const takePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      try {
        const normalized = await normalizeImageForAi(dataUrl);
        setCapturedImage(normalized ? normalized.dataUrl : dataUrl);
      } catch (e) {
        setCapturedImage(dataUrl);
      }
      stopCamera();
    }
  };

  const handleNativeCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        stopCamera();
        const raw = reader.result;
        try {
          const normalized = await normalizeImageForAi(raw);
          onCapture(normalized ? normalized.dataUrl : raw);
        } catch (e) {
          onCapture(raw);
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '520px', background: '#0f271b', color: '#fff' }}>
        <div className="modal-header" style={{ background: '#0f271b', borderBottomColor: 'rgba(255,255,255,0.1)' }}>
          <span style={{ fontWeight: '700', color: '#fff' }}>Tirar Foto da Planta</span>
          <button className="modal-close" onClick={onClose} style={{ color: '#fff' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '16px', textAlign: 'center' }}>
          <input 
            ref={nativeInputRef} 
            type="file" 
            accept="image/*" 
            capture="environment" 
            onChange={handleNativeCapture} 
            style={{ display: 'none' }} 
          />

          {errorMsg ? (
            <div style={{ padding: '24px 12px', color: '#fca5a5' }}>
              <p style={{ marginBottom: '16px', fontSize: '0.95rem' }}>{errorMsg}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => nativeInputRef.current?.click()}
                  style={{ justifyContent: 'center' }}
                >
                  <Camera size={18} />
                  <span>Abrir Câmera do Aparelho</span>
                </button>
                <button type="button" className="btn btn-secondary" onClick={onClose} style={{ justifyContent: 'center' }}>
                  Voltar
                </button>
              </div>
            </div>
          ) : capturedImage ? (
            <div>
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: '380px', marginBottom: '16px' }}>
                <img src={capturedImage} alt="Foto capturada" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={retakePhoto}>
                  <RefreshCw size={16} />
                  <span>Tirar Outra</span>
                </button>
                <button className="btn btn-primary" onClick={confirmPhoto}>
                  <Check size={16} />
                  <span>Usar Esta Foto</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000', maxHeight: '380px', minHeight: '260px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />

                {isLoading && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.9rem' }}>
                    Iniciando câmera...
                  </div>
                )}

                <button 
                  onClick={toggleCamera}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Alternar Câmera"
                >
                  <RefreshCw size={18} />
                </button>
              </div>

              <canvas ref={canvasRef} style={{ display: 'none' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <button 
                  className="btn btn-primary"
                  onClick={takePhoto}
                  style={{ padding: '14px 28px', fontSize: '1rem', width: '100%', maxWidth: '280px', justifyContent: 'center' }}
                >
                  <Camera size={20} />
                  <span>Capturar Foto</span>
                </button>

                <button 
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => nativeInputRef.current?.click()}
                  style={{ border: 'none', background: 'transparent', color: '#a7f3d0' }}
                >
                  Ou tirar foto com a câmera do aparelho
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
