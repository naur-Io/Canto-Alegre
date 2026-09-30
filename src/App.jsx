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
import GardenTourWalkthrough from './components/GardenTourWalkthrough';
import TrashBinModal from './components/TrashBinModal';
import { AnalyticsStatsModal } from './components/AnalyticsStatsModal';
import { analyticsService } from './services/analyticsService';

import { 
  getStoredPlants, 
  savePlant, 
  deletePlant, 
  markAsWatered, 
  getStoredApiKey, 
  hasSeenIntroGuide,
  hasCompletedGardenTour,
  hasUnreadUpdates,
  markVersionAsSeen,
  getStoredTheme,
  saveTheme,
  getTrashBinPlants,
  restorePlantFromTrash,
  permanentlyDeletePlant,
  emptyTrashBin
} from './services/storageService';
import { getStoredLanguage, saveLanguage } from './services/i18n';
import { LATEST_VERSION } from './services/updatesData';

const CURRENT_VIEW_KEY = 'cantoalegre_user_current_view';

const getInitialView = () => {
  try {
    const saved = localStorage.getItem(CURRENT_VIEW_KEY);
    if (saved === 'garden' || saved === 'landing') return saved;
    const hasInitialized = localStorage.getItem('cantoalegre_has_initialized_v1') === 'true';
    return hasInitialized ? 'garden' : 'landing';
  } catch (e) {
    return 'landing';
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState(getInitialView); // 'landing' | 'garden'
  const [currentLang, setCurrentLang] = useState('pt-BR');
  const [plants, setPlants] = useState([]);
  const [trashPlants, setTrashPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showUpdatesModal, setShowUpdatesModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showGardenTourModal, setShowGardenTourModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showTrashModal, setShowTrashModal] = useState(false);

  const [unreadUpdates, setUnreadUpdates] = useState(false);
  const [swUpdateAvailable, setSwUpdateAvailable] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    analyticsService.initAnalytics();
    saveTheme('light');
    loadPlants();
    loadTrash();
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

    // Tour guiado automatico apenas na primeira visita absoluta se estiver na tela do jardim
    if (getInitialView() === 'garden' && !hasCompletedGardenTour()) {
      setShowGardenTourModal(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    analyticsService.trackPageView(currentView === 'landing' ? 'LandingPage' : 'Jardim');
  }, [currentView]);

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

  const loadPlants = async () => {
    const data = await getStoredPlants();
    setPlants(data);
    if (data && data.length > 0) {
      const savedView = localStorage.getItem(CURRENT_VIEW_KEY);
      if (!savedView) {
        setCurrentView('garden');
        try {
          localStorage.setItem(CURRENT_VIEW_KEY, 'garden');
          localStorage.setItem('cantoalegre_has_initialized_v1', 'true');
        } catch (e) {}
      }
    }
  };

  const loadTrash = async () => {
    const trash = await getTrashBinPlants();
    setTrashPlants(trash);
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
    handleSwitchView('garden');
    if (selectedPlant && selectedPlant.id === plantData.id) {
      setSelectedPlant(plantData);
    }
  };

  const handleDeletePlant = async (plantId) => {
    const updated = await deletePlant(plantId);
    setPlants(updated);
    loadTrash();
  };

  const handleRestorePlant = async (plantId) => {
    const result = await restorePlantFromTrash(plantId);
    setPlants(result.plants);
    setTrashPlants(result.trash);
  };

  const handlePermanentDeletePlant = async (plantId) => {
    const updatedTrash = await permanentlyDeletePlant(plantId);
    setTrashPlants(updatedTrash);
  };

  const handleEmptyTrash = async () => {
    const empty = await emptyTrashBin();
    setTrashPlants(empty);
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
      (p.idealEnvironment && p.idealEnvironment.toLowerCase().includes(term)) ||
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

    const periodStr = typeof p.sunlight?.period === 'string' ? p.sunlight.period.toLowerCase() : '';
    const lightType = p.sunlight?.lightType || (periodStr.includes('direto') ? 'direta' : periodStr.includes('sombra') ? 'sombra' : 'indireta');

    if (activeFilter === 'direct_sun') return lightType === 'direta';
    if (activeFilter === 'indirect_light') return lightType === 'indireta';
    if (activeFilter === 'shade') return lightType === 'sombra';

    return true;
  });

  const handleSwitchView = (view) => {
    setCurrentView(view);
    try {
      localStorage.setItem(CURRENT_VIEW_KEY, view);
      localStorage.setItem('cantoalegre_has_initialized_v1', 'true');
    } catch (e) {}
  };

  return (
    <div>
      <Navbar 
        hasApiKey={hasApiKey}
        plantCount={totalCount}
        onAddClick={() => {
          handleSwitchView('garden');
          setShowAddModal(true);
        }}
        onOpenKeyModal={() => setShowKeyModal(true)}
        onOpenGuide={() => setShowGardenTourModal(true)}
        onOpenUpdates={() => {
          setShowUpdatesModal(true);
          setUnreadUpdates(false);
          markVersionAsSeen(LATEST_VERSION);
        }}
        hasUnreadUpdates={unreadUpdates}
        onOpenSettings={() => setShowSettingsModal(true)}
        isInstallable={isInstallable}
        onInstallApp={handleInstallPwa}
        currentView={currentView}
        onSwitchView={handleSwitchView}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onOpenFeedback={() => setShowFeedbackModal(true)}
        onOpenAnalytics={() => setShowAnalyticsModal(true)}
        trashCount={trashPlants.length}
        onOpenTrashBin={() => setShowTrashModal(true)}
      />

      {currentView === 'landing' ? (
        <PresentationLanding 
          currentLang={currentLang}
          onLaunchApp={() => handleSwitchView('garden')}
          isInstallable={isInstallable}
          onInstallApp={handleInstallPwa}
          onOpenFeedback={() => setShowFeedbackModal(true)}
        />
      ) : (
        <main className="app-container">
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
                {currentLang === 'en' ? "Full Sun" : "Sol Pleno"}
              </button>

              <button 
                className={`chip ${activeFilter === 'indirect_light' ? 'active' : ''}`}
                onClick={() => setActiveFilter('indirect_light')}
              >
                <CloudSun size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {currentLang === 'en' ? "Indirect Light" : "Luz Indireta"}
              </button>

              <button 
                className={`chip ${activeFilter === 'shade' ? 'active' : ''}`}
                onClick={() => setActiveFilter('shade')}
              >
                <Moon size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {currentLang === 'en' ? "Shade" : "Sombra"}
              </button>
            </div>
          </section>

          {/* Grid de Plantas do Jardim */}
          {filteredPlants.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Leaf size={40} color="#10b981" />
              </div>
              <h3 className="empty-title">
                {searchTerm || activeFilter !== 'all' 
                  ? (currentLang === 'en' ? "No plants found" : "Nenhuma planta encontrada")
                  : (currentLang === 'en' ? "Your Garden is Empty" : "Seu Jardim esta Vazio")}
              </h3>
              <p className="empty-description">
                {searchTerm || activeFilter !== 'all'
                  ? (currentLang === 'en' ? "Try changing your search terms or clearing active filters." : "Tente alterar os termos da busca ou limpar os filtros ativos.")
                  : (currentLang === 'en' ? "Start your smart botanical collection by registering your first plant." : "Comece sua colecao botanica inteligente cadastrando sua primeira muda.")}
              </p>
              {(!searchTerm && activeFilter === 'all') && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                  style={{ marginTop: '16px' }}
                >
                  <Plus size={18} />
                  <span>{currentLang === 'en' ? "Add First Plant" : "Cadastrar Primeira Planta"}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="plants-grid">
              {filteredPlants.map(plant => (
                <PlantCard 
                  key={plant.id}
                  plant={plant}
                  onWater={handleWaterPlant}
                  onSelect={setSelectedPlant}
                  currentLang={currentLang}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {/* Modais da Aplicacao */}
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
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleSavePlant}
          hasApiKey={hasApiKey}
          onOpenKeyModal={() => setShowKeyModal(true)}
          currentLang={currentLang}
        />
      )}

      {showKeyModal && (
        <ApiKeyModal 
          isOpen={showKeyModal}
          onClose={() => setShowKeyModal(false)}
          onKeySaved={() => setHasApiKey(Boolean(getStoredApiKey() && getStoredApiKey().trim() !== ''))}
        />
      )}

      {showGuideModal && (
        <IntroGuideModal 
          isOpen={showGuideModal}
          onClose={() => setShowGuideModal(false)}
          isInstallable={isInstallable}
          onInstallApp={handleInstallPwa}
        />
      )}

      {showUpdatesModal && (
        <UpdatesNotificationModal 
          isOpen={showUpdatesModal}
          onClose={() => setShowUpdatesModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal 
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          hasApiKey={hasApiKey}
          onOpenKeyModal={() => setShowKeyModal(true)}
          onOpenGuide={() => setShowGardenTourModal(true)}
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

      {showGardenTourModal && (
        <GardenTourWalkthrough 
          isOpen={showGardenTourModal}
          onClose={() => setShowGardenTourModal(false)}
          currentLang={currentLang}
        />
      )}

      {showAnalyticsModal && (
        <AnalyticsStatsModal 
          isOpen={showAnalyticsModal}
          onClose={() => setShowAnalyticsModal(false)}
          currentLang={currentLang}
        />
      )}

      {showTrashModal && (
        <TrashBinModal 
          isOpen={showTrashModal}
          onClose={() => setShowTrashModal(false)}
          trashPlants={trashPlants}
          onRestore={handleRestorePlant}
          onPermanentDelete={handlePermanentDeletePlant}
          onEmptyTrash={handleEmptyTrash}
          currentLang={currentLang}
        />
      )}

      {/* Botao Flutuante (FAB) para Adicionar Nova Planta no Jardim */}
      {currentView === 'garden' && (
        <button 
          className="fab-add-plant"
          onClick={() => {
            analyticsService.trackEvent('FAB', 'click', 'Nova_Planta');
            handleSwitchView('garden');
            setShowAddModal(true);
          }}
          title={currentLang === 'en' ? "Add New Plant" : "Adicionar Nova Planta"}
          aria-label="Adicionar Nova Planta"
        >
          <Plus size={32} />
        </button>
      )}
    </div>
  );
}
