import React, { useState } from 'react';
import { X, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { TRANSLATIONS } from '../services/i18n';

export default function FeedbackSupportModal({ isOpen, onClose, currentLang = 'pt-BR' }) {
  const [msgType, setMsgType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const t = TRANSLATIONS[currentLang]?.feedback || TRANSLATIONS['pt-BR'].feedback;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Salva o feedback enviado localmente no IndexedDB / LocalStorage para auditoria
    try {
      const existing = JSON.parse(localStorage.getItem('cantoalegre_user_feedbacks') || '[]');
      const newFeedback = {
        id: crypto.randomUUID(),
        type: msgType,
        message: message.trim(),
        email: email.trim(),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('cantoalegre_user_feedbacks', JSON.stringify([newFeedback, ...existing]));
    } catch (err) {
      console.warn('Falha ao registrar feedback:', err);
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setMessage('');
    setEmail('');
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="modal-icon-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              <MessageSquare size={20} style={{ color: '#10b981' }} />
            </div>
            <h3>{t.modalTitle}</h3>
          </div>
          <button className="btn-icon" onClick={onClose} title="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <CheckCircle2 size={54} style={{ color: '#10b981', marginBottom: '16px' }} />
              <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '10px' }}>{t.successMessage}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
                Agradecemos por contribuir para o crescimento do Canto Alegre!
              </p>
              <button className="btn btn-primary" onClick={handleReset}>
                <span>{t.btnClose}</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '6px', fontWeight: 600 }}>
                  {t.typeLabel}
                </label>
                <select 
                  value={msgType}
                  onChange={e => setMsgType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm, 8px)',
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--card-border, rgba(52, 211, 153, 0.2))',
                    color: '#fff',
                    fontSize: '0.92rem'
                  }}
                >
                  <option value="suggestion">{t.typeSuggestion}</option>
                  <option value="issue">{t.typeIssue}</option>
                  <option value="question">{t.typeQuestion}</option>
                </select>
              </div>

              <div>
                <textarea
                  rows={5}
                  required
                  placeholder={t.messagePlaceholder}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm, 8px)',
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--card-border, rgba(52, 211, 153, 0.2))',
                    color: '#fff',
                    fontSize: '0.92rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm, 8px)',
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--card-border, rgba(52, 211, 153, 0.2))',
                    color: '#fff',
                    fontSize: '0.92rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  <span>{t.btnClose}</span>
                </button>
                <button type="submit" className="btn btn-primary">
                  <Send size={16} />
                  <span>{t.btnSubmit}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
