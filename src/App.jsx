import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Search, Plus, Leaf, Droplets, Sun, Sparkles, Filter, CloudSun, Moon } from 'lucide-react';
import Navbar from './components/Navbar';
import PlantCard from './components/PlantCard';
import PlantDetailModal from './components/PlantDetailModal';
import AddPlantModal from './components/AddPlantModal';
import ApiKeyModal from './components/ApiKeyModal';
import IntroGuideModal from './components/IntroGuideModal';
import UpdatesNotificationModal from './components/UpdatesNotificationModal';
import SettingsModal from './components/SettingsModal';
import PresentationLanding from './components/PresentationLanding';
import FeedbackSupportModal from './components/FeedbackSupportModal';

import { 
  getStoredPlants, 
  savePlant, 
  deletePlant, 
  markAsWatered, 
  getStoredApiKey, 
  hasSeenIntroGuide,
  hasUnreadUpdates,
  markVersionAsSeen,
  getStoredTheme,
  saveTheme
} from './services/storageService';
import { getStoredLanguage, saveLanguage } from './services/i18n';
import { LATEST_VERSION } from './services/updatesData';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'garden'
  const [currentLang, setCurrentLang] = useState('pt-BR');
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showUpdatesModal, setShowUpdatesModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [currentTheme, setCurrentTheme] = useState(getStoredTheme());
  const [unreadUpdates, setUnreadUpdates] = useState(false);
  const [swUpdateAvailable, setSwUpdateAvailable] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    saveTheme(currentTheme);
    loadPlants();
    initLanguage();
    setHasApiKey(Boolean(getStoredApiKey() && getStoredApiKey().trim() !== ''));
    setUnreadUpdates(hasUnreadUpdates(LATEST_VERSION));

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('Canto Alegre PWA instalado com sucesso!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const initLanguage = async () => {
    const lang = await getStoredLanguage();
    setCurrentLang(lang);
  };

  const handleLanguageChange = async (newLang) => {
    const applied = await saveLanguage(newLang);
    setCurrentLang(applied);
  };

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIos) {
        alert(currentLang === 'en' 
          ? "To install on iPhone/iPad:\n1. Tap the Share icon (⎋) in Safari;\n2. Tap 'Add to Home Screen'."
          : "Para instalar no iPhone/iPad:\n1. Toque no icone Compartilhar (⎋) no Safari;\n2. Toque em 'Adicionar a Tela de Inicio'.");
      } else {
        alert(currentLang === 'en'
          ? "To install:\nOpen the browser menu (⋮) and select 'Install app' or 'Add to Home screen'."
          : "Para instalar:\nAbra o menu do navegador (⋮) e selecione 'Instalar aplicativo' ou 'Adicionar a tela inicial'.");
      }
    }
  };

  const handleThemeChange = (newTheme) => {
    const applied = saveTheme(newTheme);
    setCurrentTheme(applied);
  };

  const handleToggleTheme = () => {
    handleThemeChange(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const loadPlants = async () => {
    const data = await getStoredPlants();
    setPlants(data);
  };

  const handleWaterPlant = async (plantId) => {
    const updated = await markAsWatered(plantId);
    setPlants(updated);
    if (selectedPlant && selectedPlant.id === plantId) {
      setSelectedPlant(prev => ({ ...prev, lastWatered: new Date().toISOString() }));
    }

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#29b6f6', '#4c966f', '#10b981']
    });
  };

  const handleSavePlant = async (plantData) => {
    const updated = await savePlant(plantData);
    setPlants(updated);
    if (selectedPlant && selectedPlant.id === plantData.id) {
      setSelectedPlant(plantData);
    }
  };

  const handleDeletePlant = async (plantId) => {
    const updated = await deletePlant(plantId);
    setPlants(updated);
  };

  const totalCount = plants.length;
  const now = new Date();
  const needsWaterCount = plants.filter(p => {
    const last = new Date(p.lastWatered);
    const freq = p.watering?.frequencyDays || 3;
    const diffHours = (now - last) / (1000 * 60 * 60);
    return diffHours >= (freq * 24 - 12);
  }).length;

  const filteredPlants = plants.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (p.commonName && p.commonName.toLowerCase().includes(term)) ||
      (p.scientificName && p.scientificName.toLowerCase().includes(term)) ||
      (p.origin && p.origin.toLowerCase().includes(term)) ||
      (p.soilType && p.soilType.toLowerCase().includes(term)) ||
      (p.notes && p.notes.toLowerCase().includes(term)) ||
      (p.sunlight?.notes && p.sunlight.notes.toLowerCase().includes(term)) ||
      (p.propagation?.method && p.propagation.method.toLowerCase().includes(term)) ||
      (p.propagation?.proTips && p.propagation.proTips.toLowerCase().includes(term));
    
    if (!matchesSearch) return false;

    if (activeFilter === 'needs_water') {
      const last = new Date(p.lastWatered);
      const freq = p.watering?.frequencyDays || 3;
      const diffHours = (now - last) / (1000 * 60 * 60);
      return diffHours >= (freq * 24 - 12);
    }

    const lightType = p.sunlight?.lightType || (p.sunlight?.period?.toLowerCase().includes('direto') ? 'direta' : p.sunlight?.period?.toLowerCase().includes('sombra') ? 'sombra' : 'indireta');

    if (activeFilter === 'direct_sun') return lightType === 'direta';
    if (activeFilter === 'indirect_light') return lightType === 'indireta';
    if (activeFilter === 'shade') return lightType === 'sombra';

    return true;
  });

  return (
    <div>
      <Navbar 
        hasApiKey={hasApiKey}
        plantCount={totalCount}
        onAddClick={() => {
          setCurrentView('garden');
          setShowAddModal(true);
        }}
        onOpenKeyModal={() => setShowKeyModal(true)}
        onOpenGuide={() => setShowGuideModal(true)}
        onOpenUpdates={() => {
          setShowUpdatesModal(true);
          setUnreadUpdates(false);
          markVersionAsSeen(LATEST_VERSION);
        }}
        hasUnreadUpdates={unreadUpdates}
        currentTheme={currentTheme}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setShowSettingsModal(true)}
        isInstallable={isInstallable}
        onInstallApp={handleInstallPwa}
        currentView={currentView}
        onSwitchView={setCurrentView}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onOpenFeedback={() => setShowFeedbackModal(true)}
      />

      {currentView === 'landing' ? (
        <PresentationLanding 
          currentLang={currentLang}
          onLaunchApp={() => setCurrentView('garden')}
          isInstallable={isInstallable}
          onInstallApp={handleInstallPwa}
          onOpenFeedback={() => setShowFeedbackModal(true)}
        />
      ) : (
        <main className="app-container">
          {/* Banner Hero / Dashboard do Jardim */}
          <section className="hero-header">
            <div className="hero-text">
              <h1>{currentLang === 'en' ? 'My Smart Garden' : 'Meu Jardim Inteligente'}</h1>
              <p>
                {currentLang === 'en'
                  ? 'Complete botanical guide with light, watering, origin, soil type, and step-by-step cutting propagation instructions.'
                  : 'Guia botanico completo com quantidade de luz, rega, origem, clima, tipo de solo e guia passo a passo para tirar mudas e cultivar.'}
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{totalCount}</div>
                <div className="stat-label">{currentLang === 'en' ? 'Saved Plants' : 'Plantas Salvas'}</div>
              </div>

              <div className="stat-card" style={{ background: needsWaterCount > 0 ? 'rgba(239, 68, 68, 0.25)' : undefined }}>
                <div className="stat-value" style={{ color: needsWaterCount > 0 ? '#fca5a5' : '#fff' }}>
                  {needsWaterCount}
                </div>
                <div className="stat-label">{currentLang === 'en' ? 'Thirsty Today' : 'Sede Hoje'}</div>
              </div>
            </div>
          </section>

          {/* Toolbar de Pesquisa & Filtros */}
          <section className="toolbar">
            <div className="search-box">
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                placeholder={currentLang === 'en' ? "Search by name, origin, soil, or care..." : "Buscar por nome, origem, tipo de solo ou cuidados..."}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-chips">
              <button 
                className={`chip ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                {currentLang === 'en' ? `All (${totalCount})` : `Todas (${totalCount})`}
              </button>

              <button 
                className={`chip ${activeFilter === 'needs_water' ? 'active' : ''}`}
                onClick={() => setActiveFilter('needs_water')}
              >
                <Droplets size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {currentLang === 'en' ? `Needs Water (${needsWaterCount})` : `Precisa de Agua (${needsWaterCount})`}
              </button>

              <button 
                className={`chip ${activeFilter === 'direct_sun' ? 'active' : ''}`}
                onClick={() => setActiveFilter('direct_sun')}
              >
                <Sun size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {currentLang === 'en' ? 'Full Sun' : 'Luz Direta'}
              </button>

              <button 
                className={`chip ${activeFilter === 'indirect_light' ? 'active' : ''}`}
                onClick={() => setActiveFilter('indirect_light')}
              >
                <CloudSun size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {currentLang === 'en' ? 'Indirect Light' : 'Luz Indireta'}
              </button>

              <button 
                className={`chip ${activeFilter === 'shade' ? 'active' : ''}`}
                onClick={() => setActiveFilter('shade')}
              >
                <Moon size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {currentLang === 'en' ? 'Shade' : 'Sombra'}
              </button>
            </div>
          </section>

          {/* Galeria de Cartões de Plantas */}
          {filteredPlants.length > 0 ? (
            <div className="plant-grid">
              {filteredPlants.map(plant => (
                <PlantCard 
                  key={plant.id} 
                  plant={plant} 
                  onWater={handleWaterPlant}
                  onClick={setSelectedPlant}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Leaf className="empty-icon" />
              <h3>{currentLang === 'en' ? 'No plants found' : 'Nenhuma planta encontrada'}</h3>
              <p>
                {currentLang === 'en' 
                  ? 'Add a plant manually or take a photo with AI to start your garden journal.'
                  : 'Adicione uma planta manualmente ou tire uma foto com a IA para iniciar seu diario de cultivo.'}
              </p>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                <Plus size={18} />
                <span>{currentLang === 'en' ? 'Add First Plant' : 'Adicionar Primeira Planta'}</span>
              </button>
            </div>
          )}
        </main>
      )}

      {/* Modais */}
      {selectedPlant && (
        <PlantDetailModal 
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
          onSave={handleSavePlant}
          onDelete={handleDeletePlant}
          onWater={handleWaterPlant}
        />
      )}

      {showAddModal && (
        <AddPlantModal 
          hasApiKey={hasApiKey}
          onClose={() => setShowAddModal(false)}
          onSavePlant={handleSavePlant}
          onOpenKeyModal={() => setShowKeyModal(true)}
        />
      )}

      {showKeyModal && (
        <ApiKeyModal 
          onClose={() => setShowKeyModal(false)}
          onKeySaved={(hasKey) => setHasApiKey(hasKey)}
        />
      )}

      {showGuideModal && (
        <IntroGuideModal 
          isOpen={showGuideModal}
          onClose={() => setShowGuideModal(false)}
          hasApiKey={hasApiKey}
          onKeySaved={(hasKey) => setHasApiKey(hasKey)}
          installPrompt={deferredPrompt}
          onInstallApp={handleInstallPwa}
        />
      )}

      {showUpdatesModal && (
        <UpdatesNotificationModal 
          isOpen={showUpdatesModal}
          onClose={() => setShowUpdatesModal(false)}
          swUpdateAvailable={swUpdateAvailable}
          onReloadApp={() => window.location.reload()}
        />
      )}

      {showSettingsModal && (
        <SettingsModal 
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          hasApiKey={hasApiKey}
          onOpenKeyModal={() => setShowKeyModal(true)}
          onOpenGuide={() => setShowGuideModal(true)}
          isInstallable={isInstallable}
          onInstallApp={handleInstallPwa}
          onReloadPlants={loadPlants}
        />
      )}

      {showFeedbackModal && (
        <FeedbackSupportModal 
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          currentLang={currentLang}
        />
      )}
    </div>
  );
}
