import { get, set } from 'idb-keyval';
import { INITIAL_PLANTS } from './mockData';
import { apiService } from './apiService';
import { addToPendingQueue, syncWithCloud } from './syncService';

const PLANTS_STORAGE_KEY = 'cantoalegre_user_plants_v1';
const LEGACY_PLANTS_KEY = 'floracare_user_plants_v1';
const API_KEY_STORAGE_KEY = 'cantoalegre_gemini_api_key';
const LEGACY_API_KEY = 'floracare_gemini_api_key';
const INITIALIZED_FLAG_KEY = 'cantoalegre_has_initialized_v1';
const INTRO_COMPLETED_KEY = 'cantoalegre_intro_completed';

// Sincroniza dados em ambos os armazenamentos (IndexedDB + LocalStorage)
export async function persistToAllStorages(plants) {
  if (!Array.isArray(plants)) return;

  // 1. Salvar no IndexedDB (Suporta grandes volumes e imagens comprimidas)
  try {
    await set(PLANTS_STORAGE_KEY, plants);
  } catch (err) {
    console.warn('Falha ao salvar no IndexedDB:', err);
  }

  // 2. Salvar copia redundante no LocalStorage com protecao de cota
  try {
    localStorage.setItem(PLANTS_STORAGE_KEY, JSON.stringify(plants));
    localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
  } catch (err) {
    console.warn('LocalStorage quota excedida, gerando backup leve:', err);
    try {
      // Se estourar a cota de 5MB do LocalStorage, salva versao com imagem otimizada para backup
      const lightweight = plants.map(p => ({
        ...p,
        photoUrl: p.photoUrl && p.photoUrl.startsWith('data:') && p.photoUrl.length > 50000 
          ? 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80' 
          : p.photoUrl
      }));
      localStorage.setItem(PLANTS_STORAGE_KEY, JSON.stringify(lightweight));
      localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
    } catch (e) {
      try {
        localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
      } catch (e2) {}
    }
  }
}

// Carregar todas as plantas salvas pelo usuario
export async function getStoredPlants() {
  const hasInitialized = localStorage.getItem(INITIALIZED_FLAG_KEY) === 'true' || localStorage.getItem('floracare_has_initialized_v1') === 'true';
  let localPlants = null;

  // 1. Tentar ler do IndexedDB (banco principal de alta capacidade)
  try {
    let idbData = await get(PLANTS_STORAGE_KEY);
    if (!idbData) {
      idbData = await get(LEGACY_PLANTS_KEY);
      if (idbData && Array.isArray(idbData)) {
        await set(PLANTS_STORAGE_KEY, idbData);
      }
    }
    if (idbData !== undefined && idbData !== null && Array.isArray(idbData)) {
      localPlants = idbData;
    }
  } catch (error) {
    console.warn('IndexedDB nao disponivel, verificando localStorage:', error);
  }

  // 2. Tentar ler do LocalStorage caso o IndexedDB falhe ou retorne nulo
  if (!localPlants) {
    try {
      let localData = localStorage.getItem(PLANTS_STORAGE_KEY) || localStorage.getItem(LEGACY_PLANTS_KEY);
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) {
          localPlants = parsed;
        }
      }
    } catch (error) {
      console.warn('Erro ao ler do LocalStorage:', error);
    }
  }

  // 3. Se for primeira execucao absoluta (primeiro acesso do usuario), carregar INITIAL_PLANTS
  if (!localPlants && !hasInitialized) {
    localPlants = INITIAL_PLANTS;
    await persistToAllStorages(localPlants);
  } else if (!localPlants) {
    localPlants = [];
  }

  // Tentar sincronizacao assincrona com o backend Spring Boot em segundo plano
  if (navigator.onLine && localPlants.length > 0) {
    syncWithCloud(localPlants, persistToAllStorages).catch(err => 
      console.warn('Sincronizacao em segundo plano falhou:', err)
    );
  }

  return localPlants;
}

// Salvar ou Atualizar uma Planta com Sincronizacao Cloud Resiliente
export async function savePlant(plantData) {
  const currentPlants = await getStoredPlants();
  const index = currentPlants.findIndex(p => p.id === plantData.id);

  let updatedPlants;
  let targetPlant;

  if (index >= 0) {
    updatedPlants = [...currentPlants];
    updatedPlants[index] = { 
      ...updatedPlants[index], 
      ...plantData, 
      updatedAt: new Date().toISOString() 
    };
    targetPlant = updatedPlants[index];
  } else {
    const newPlant = {
      ...plantData,
      id: plantData.id || `plant-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      lastWatered: plantData.lastWatered || new Date().toISOString()
    };
    updatedPlants = [newPlant, ...currentPlants];
    targetPlant = newPlant;
  }

  // Garante a gravacao imediata e persistente no IndexedDB e LocalStorage
  await persistToAllStorages(updatedPlants);

  if (navigator.onLine) {
    apiService.createPlant({
      nickname: targetPlant.commonName || targetPlant.name || targetPlant.nickname || 'Nova Planta',
      customLocation: targetPlant.idealEnvironment || targetPlant.customLocation || targetPlant.location || '',
      photoUrl: targetPlant.photoUrl || targetPlant.image || '',
      notes: targetPlant.notes || ''
    }).then(remoteCreated => {
      if (remoteCreated && remoteCreated.id) {
        targetPlant.remoteId = remoteCreated.id;
        persistToAllStorages(updatedPlants);
      }
    }).catch(err => {
      console.warn('Backend cloud offline, enfileirando plantio para sincronizacao futura:', err);
      addToPendingQueue('CREATE_PLANT', targetPlant);
    });
  } else {
    addToPendingQueue('CREATE_PLANT', targetPlant);
  }

  return updatedPlants;
}

// Excluir Planta
export async function deletePlant(plantId) {
  const currentPlants = await getStoredPlants();
  const updatedPlants = currentPlants.filter(p => p.id !== plantId);
  await persistToAllStorages(updatedPlants);
  return updatedPlants;
}

// Marcar como Regada Hoje
export async function markAsWatered(plantId) {
  const currentPlants = await getStoredPlants();
  const updatedPlants = currentPlants.map(p => {
    if (p.id === plantId) {
      return {
        ...p,
        lastWatered: new Date().toISOString()
      };
    }
    return p;
  });

  await persistToAllStorages(updatedPlants);

  if (navigator.onLine) {
    apiService.waterPlant(plantId).catch(err => {
      console.warn('Backend cloud offline, enfileirando rega para sincronizacao futura:', err);
      addToPendingQueue('WATER_PLANT', { plantId });
    });
  } else {
    addToPendingQueue('WATER_PLANT', { plantId });
  }

  return updatedPlants;
}

// Gerenciamento da Chave de API Gemini
export function getStoredApiKey() {
  const raw = localStorage.getItem(API_KEY_STORAGE_KEY) || localStorage.getItem(LEGACY_API_KEY) || '';
  const matchAiza = raw.match(/AIzaSy[A-Za-z0-9_-]{30,}/);
  if (matchAiza) return matchAiza[0];
  const matchAQ = raw.match(/AQ\.[A-Za-z0-9_.-]{30,}/);
  if (matchAQ) return matchAQ[0];
  return raw.trim();
}

export function saveApiKey(key) {
  if (key && typeof key === 'string' && key.trim() !== '') {
    const trimmed = key.trim();
    const matchAiza = trimmed.match(/AIzaSy[A-Za-z0-9_-]{30,}/);
    const matchAQ = trimmed.match(/AQ\.[A-Za-z0-9_.-]{30,}/);
    const clean = matchAiza ? matchAiza[0] : matchAQ ? matchAQ[0] : trimmed.replace(/["'\s\r\n]/g, '');
    localStorage.setItem(API_KEY_STORAGE_KEY, clean);
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    localStorage.removeItem(LEGACY_API_KEY);
  }
}

// Controle de exibicao do Guia de Introducao Onboarding
export function hasSeenIntroGuide() {
  return localStorage.getItem(INTRO_COMPLETED_KEY) === 'true';
}

export function markIntroGuideSeen() {
  localStorage.setItem(INTRO_COMPLETED_KEY, 'true');
}

// Controle do Tour Guiado Interativo do Jardim
const GARDEN_TOUR_COMPLETED_KEY = 'cantoalegre_garden_tour_completed_v1';

export function hasCompletedGardenTour() {
  return localStorage.getItem(GARDEN_TOUR_COMPLETED_KEY) === 'true';
}

export function markGardenTourCompleted() {
  localStorage.setItem(GARDEN_TOUR_COMPLETED_KEY, 'true');
}

// Controle de Notificacoes de Atualizacoes / Novidades
const LAST_SEEN_VERSION_KEY = 'cantoalegre_last_seen_version';

export function getLastSeenVersion() {
  return localStorage.getItem(LAST_SEEN_VERSION_KEY) || '';
}

export function markVersionAsSeen(version) {
  localStorage.setItem(LAST_SEEN_VERSION_KEY, version);
}

export function hasUnreadUpdates(latestVersion) {
  const seen = getLastSeenVersion();
  return seen !== latestVersion;
}

// Exportar todos os dados do jardim (Backup)
export async function exportGardenBackup() {
  const plants = await getStoredPlants();
  return JSON.stringify({
    version: '1.0',
    exportedAt: new Date().toISOString(),
    plants
  }, null, 2);
}

// Importar dados de backup
export async function importGardenBackup(jsonString) {
  const parsed = JSON.parse(jsonString);
  const plants = Array.isArray(parsed) ? parsed : (parsed.plants || []);
  if (!Array.isArray(plants)) throw new Error('Formato de backup invalido.');
  await persistToAllStorages(plants);
  return plants;
}

// Gerenciamento de Tema Visual (Tema Botânico Único Claro)
const THEME_STORAGE_KEY = 'cantoalegre_theme';

export function getStoredTheme() {
  return 'light';
}

export function saveTheme(theme) {
  const selected = 'light';
  localStorage.setItem(THEME_STORAGE_KEY, selected);
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', selected);
  }
  return selected;
}
