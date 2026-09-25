import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Download, 
  Github, 
  Camera, 
  Scissors, 
  Droplets, 
  Sun, 
  WifiOff, 
  Zap, 
  Smartphone, 
  HelpCircle, 
  Heart, 
  MessageSquare,
  Globe
} from 'lucide-react';
import { TRANSLATIONS } from '../services/i18n';

export default function PresentationLanding({ 
  currentLang = 'pt-BR', 
  onLaunchApp, 
  isInstallable, 
  onInstallApp, 
  onOpenFeedback 
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS['pt-BR'];

  return (
    <div className="presentation-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section className="hero" style={{ maxWidth: '1100px', margin: '40px auto 20px', padding: '0 20px', textAlign: 'center' }}>
        <div className="app-icon-showcase" style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <img 
            src="/icons/icon-192.png" 
            alt="Canto Alegre Icon" 
            width="110" 
            height="110" 
            style={{
              borderRadius: '26px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(16, 185, 129, 0.35)'
            }}
          />
        </div>

        <div className="hero-badge" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(52, 211, 153, 0.35)',
          borderRadius: '50px',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--primary-400, #34d399)',
          marginBottom: '24px'
        }}>
          <Sparkles size={16} />
          <span>{t.hero.badge}</span>
        </div>

        <h1 style={{ fontSize: '3rem', lineHeight: 1.15, marginBottom: '20px', color: '#ffffff', letterSpacing: '-0.02em' }}>
          {t.hero.title}<br />
          <span style={{
            background: 'linear-gradient(135deg, #6ee7b7, #34d399, #fef08a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t.hero.subtitle}
          </span>
        </h1>

        <p style={{ fontSize: '1.15rem', maxWidth: '740px', margin: '0 auto 32px', color: 'var(--text-muted, #a7f3d0)', lineHeight: 1.7 }}>
          {t.hero.description}
        </p>

        <div className="hero-buttons" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
          <button 
            className="btn btn-primary" 
            onClick={onLaunchApp}
            style={{ fontSize: '1.05rem', padding: '14px 28px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
          >
            <span>{t.hero.useAppCta}</span>
            <ArrowRight size={18} />
          </button>

          <button 
            className="btn btn-install" 
            onClick={onInstallApp}
            style={{ fontSize: '1.05rem', padding: '14px 28px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
          >
            <Download size={18} />
            <span>{t.hero.downloadPwa}</span>
          </button>

          <a 
            href="https://github.com/naur-Io/FloraCare" 
            target="_blank" 
            rel="noreferrer" 
            className="btn btn-secondary"
            style={{ fontSize: '1.05rem', padding: '14px 24px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
          >
            <Github size={18} />
            <span>{t.hero.viewGithub}</span>
          </a>
        </div>
      </section>

      {/* Purpose & Features Grid Section */}
      <section className="features-section" style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="section-title" style={{ fontSize: '2.1rem', color: '#fff', marginBottom: '14px' }}>
            {t.purpose.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '780px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            {t.purpose.description}
          </p>
        </div>

        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
          <div className="feature-card">
            <div className="feature-icon"><Camera size={24} style={{ color: '#34d399' }} /></div>
            <h3>{t.purpose.card1Title}</h3>
            <p>{t.purpose.card1Desc}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Scissors size={24} style={{ color: '#34d399' }} /></div>
            <h3>{t.purpose.card2Title}</h3>
            <p>{t.purpose.card2Desc}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Droplets size={24} style={{ color: '#34d399' }} /></div>
            <h3>{t.purpose.card3Title}</h3>
            <p>{t.purpose.card3Desc}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Sun size={24} style={{ color: '#34d399' }} /></div>
            <h3>{t.purpose.card4Title}</h3>
            <p>{t.purpose.card4Desc}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><WifiOff size={24} style={{ color: '#34d399' }} /></div>
            <h3>{t.purpose.card5Title}</h3>
            <p>{t.purpose.card5Desc}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Zap size={24} style={{ color: '#34d399' }} /></div>
            <h3>{t.purpose.card6Title}</h3>
            <p>{t.purpose.card6Desc}</p>
          </div>
        </div>
      </section>

      {/* PWA Installation Instructions (Android & iOS) */}
      <section className="guide-section" style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
        <div className="guide-card" style={{
          background: 'linear-gradient(135deg, rgba(20, 62, 39, 0.7), rgba(12, 37, 23, 0.9))',
          border: '1px solid rgba(52, 211, 153, 0.35)',
          borderRadius: '20px',
          padding: '36px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <Smartphone size={28} style={{ color: '#34d399' }} />
            <h2 style={{ fontSize: '1.85rem', color: '#fff' }}>{t.install.title}</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '28px' }}>
            {t.install.subtitle}
          </p>

          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div className="step-item" style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '22px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h4 style={{ color: '#6ee7b7', fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{t.install.androidTitle}</span>
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '6px' }}>{t.install.androidStep1}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '6px' }}>{t.install.androidStep2}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{t.install.androidStep3}</p>
            </div>

            <div className="step-item" style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '22px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h4 style={{ color: '#6ee7b7', fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{t.install.iosTitle}</span>
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '6px' }}>{t.install.iosStep1}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '6px' }}>{t.install.iosStep2}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{t.install.iosStep3}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback & Support Section */}
      <section style={{ maxWidth: '1100px', margin: '20px auto 40px', padding: '0 20px', width: '100%' }}>
        <div style={{
          background: 'rgba(15, 39, 27, 0.65)',
          border: '1px solid var(--card-border, rgba(52, 211, 153, 0.2))',
          borderRadius: '20px',
          padding: '30px',
          display: 'flex',
          justifyContent: 'space-between',

          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '6px' }}>{t.feedback.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px' }}>{t.feedback.subtitle}</p>
          </div>
          <button className="btn btn-primary" onClick={onOpenFeedback} style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
            <MessageSquare size={18} />
            <span>{t.feedback.btnOpen}</span>
          </button>
        </div>
      </section>

      {/* Footer Credits */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--card-border, rgba(52, 211, 153, 0.2))', background: 'rgba(7, 21, 13, 0.95)', padding: '36px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>{t.credits.title}</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '680px', lineHeight: 1.6 }}>
            {t.credits.builtBy} {t.credits.inspiration}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {t.credits.techStack} &bull; {t.credits.license}
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={onLaunchApp}>
              <span>{t.nav.myGarden}</span>
            </button>
            <a href="https://github.com/naur-Io/FloraCare" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
              <Github size={14} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
