import { get, set } from 'idb-keyval';
import { INITIAL_PLANTS } from './mockData';

const PLANTS_STORAGE_KEY = 'cantoalegre_user_plants_v1';
const LEGACY_PLANTS_KEY = 'floracare_user_plants_v1';
const API_KEY_STORAGE_KEY = 'cantoalegre_gemini_api_key';
const LEGACY_API_KEY = 'floracare_gemini_api_key';
const INITIALIZED_FLAG_KEY = 'cantoalegre_has_initialized_v1';
const INTRO_COMPLETED_KEY = 'cantoalegre_intro_completed';

// Sincroniza dados em ambos os armazenamentos (IndexedDB + LocalStorage)
async function persistToAllStorages(plants) {
  // 1. Salvar no IndexedDB
  try {
    await set(PLANTS_STORAGE_KEY, plants);
  } catch (err) {
    console.warn('Falha ao salvar no IndexedDB:', err);
  }

  // 2. Salvar cópia redundante no LocalStorage
  try {
    localStorage.setItem(PLANTS_STORAGE_KEY, JSON.stringify(plants));
    localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
  } catch (err) {
    console.warn('LocalStorage quota ou indisponível:', err);
  }
}

// Carregar todas as plantas salvas pelo usuário
export async function getStoredPlants() {
  const hasInitialized = localStorage.getItem(INITIALIZED_FLAG_KEY) === 'true' || localStorage.getItem('floracare_has_initialized_v1') === 'true';

  // 1. Tentar ler do IndexedDB (chave nova ou antiga)
  try {
    let idbData = await get(PLANTS_STORAGE_KEY);
    if (!idbData) {
      idbData = await get(LEGACY_PLANTS_KEY);
      if (idbData && Array.isArray(idbData)) {
        await set(PLANTS_STORAGE_KEY, idbData);
      }
    }
    if (idbData !== undefined && idbData !== null && Array.isArray(idbData)) {
      // Filtrar plantas de demonstração antigas, mantendo apenas a Jiboia e plantas customizadas
      const cleaned = idbData.filter(p => p.id !== 'plant-aglaonema-01' && p.id !== 'plant-espada-03' && p.id !== 'plant-suculenta-04');
      if (cleaned.length !== idbData.length) {
        // Se após a limpeza não sobrar nada e não foi deletado explicitamente, insere a Jiboia
        const finalPlants = cleaned.length > 0 ? cleaned : INITIAL_PLANTS;
        await persistToAllStorages(finalPlants);
        return finalPlants;
      }
      return idbData;
    }
  } catch (error) {
    console.warn('IndexedDB não disponível, verificando localStorage:', error);
  }

  // 2. Tentar ler do LocalStorage (chave nova ou antiga)
  try {
    let localData = localStorage.getItem(PLANTS_STORAGE_KEY) || localStorage.getItem(LEGACY_PLANTS_KEY);
    if (localData) {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(p => p.id !== 'plant-aglaonema-01' && p.id !== 'plant-espada-03' && p.id !== 'plant-suculenta-04');
        const finalPlants = cleaned.length > 0 ? cleaned : INITIAL_PLANTS;
        set(PLANTS_STORAGE_KEY, finalPlants).catch(() => {});
        localStorage.setItem(PLANTS_STORAGE_KEY, JSON.stringify(finalPlants));
        return finalPlants;
      }
    }
  } catch (error) {
    console.warn('Erro ao ler do LocalStorage:', error);
  }

  // 3. Se o usuário já interagiu com o app antes e deletou as plantas, retornar vazio
  if (hasInitialized) {
    return [];
  }

  // 4. Primeiro acesso absoluto: semear apenas com a Jiboia
  await persistToAllStorages(INITIAL_PLANTS);
  return INITIAL_PLANTS;
}

// Salvar ou Atualizar uma Planta
export async function savePlant(plantData) {
  const currentPlants = await getStoredPlants();
  const index = currentPlants.findIndex(p => p.id === plantData.id);

  let updatedPlants;
  if (index >= 0) {
    // Atualizar existente preservando histórico
    updatedPlants = [...currentPlants];
    updatedPlants[index] = { 
      ...updatedPlants[index], 
      ...plantData, 
      updatedAt: new Date().toISOString() 
    };
  } else {
    // Adicionar nova planta no início
    const newPlant = {
      ...plantData,
      id: plantData.id || `plant-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      lastWatered: plantData.lastWatered || new Date().toISOString()
    };
    updatedPlants = [newPlant, ...currentPlants];
  }

  await persistToAllStorages(updatedPlants);
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

// Controle de exibição do Guia de Introdução Onboarding
export function hasSeenIntroGuide() {
  return localStorage.getItem(INTRO_COMPLETED_KEY) === 'true';
}

export function markIntroGuideSeen() {
  localStorage.setItem(INTRO_COMPLETED_KEY, 'true');
}

// Controle de Notificações de Atualizações / Novidades
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
  if (!Array.isArray(plants)) throw new Error('Formato de backup inválido.');
  await persistToAllStorages(plants);
  return plants;
}

// Gerenciamento de Tema Visual (Dark / Light)
const THEME_STORAGE_KEY = 'cantoalegre_theme';

export function getStoredTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
}

export function saveTheme(theme) {
  const selected = theme === 'light' ? 'light' : 'dark';
  localStorage.setItem(THEME_STORAGE_KEY, selected);
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', selected);
  }
  return selected;
}

