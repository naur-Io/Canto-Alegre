import { get, set } from 'idb-keyval';
import { apiService } from './apiService';

const QUEUE_STORAGE_KEY = 'cantoalegre_pending_sync_queue';
const SYNC_STATUS_KEY = 'cantoalegre_last_sync_time';

export async function getPendingQueue() {
  try {
    const queue = await get(QUEUE_STORAGE_KEY);
    return Array.isArray(queue) ? queue : [];
  } catch (err) {
    console.warn('Falha ao ler fila de sincronizacao:', err);
    return [];
  }
}

export async function addToPendingQueue(type, payload) {
  try {
    const queue = await getPendingQueue();
    const newItem = {
      id: crypto.randomUUID(),
      type,
      payload,
      timestamp: new Date().toISOString()
    };
    await set(QUEUE_STORAGE_KEY, [...queue, newItem]);
  } catch (err) {
    console.warn('Falha ao adicionar item a fila de sincronizacao:', err);
  }
}

export async function clearPendingQueue() {
  try {
    await set(QUEUE_STORAGE_KEY, []);
  } catch (err) {
    console.warn('Falha ao limpar fila de sincronizacao:', err);
  }
}

export async function processPendingQueue() {
  if (!navigator.onLine) return;

  const queue = await getPendingQueue();
  if (queue.length === 0) return;

  const remaining = [];

  for (const item of queue) {
    try {
      if (item.type === 'CREATE_PLANT') {
        await apiService.createPlant({
          nickname: item.payload.name || item.payload.nickname || 'Nova Planta',
          customLocation: item.payload.customLocation || item.payload.location || '',
          photoUrl: item.payload.photoUrl || item.payload.image || '',
          notes: item.payload.notes || ''
        });
      } else if (item.type === 'WATER_PLANT') {
        await apiService.waterPlant(item.payload.plantId, item.payload.notes || '');
      }
    } catch (err) {
      console.warn('Falha ao processar item da fila de sincronizacao:', item, err);
      remaining.push(item);
    }
  }

  await set(QUEUE_STORAGE_KEY, remaining);
}

export async function syncWithCloud(localPlants = [], persistToAllStorages = null) {
  if (!navigator.onLine) {
    return { synced: false, reason: 'offline', plants: localPlants };
  }

  try {
    await processPendingQueue();

    const remotePlants = await apiService.getPlants();

    if (!Array.isArray(remotePlants)) {
      return { synced: false, reason: 'invalid_response', plants: localPlants };
    }

    const normalizedRemote = remotePlants.map(rp => ({
      id: rp.id,
      name: rp.nickname || (rp.species ? rp.species.commonName : 'Planta'),
      commonName: rp.species ? rp.species.commonName : (rp.nickname || 'Planta'),
      scientificName: rp.species ? rp.species.scientificName : '',
      customLocation: rp.customLocation || '',
      image: rp.photoUrl || '',
      lastWatered: rp.lastWateredAt || rp.updatedAt || new Date().toISOString(),
      nextWateringAt: rp.nextWateringAt,
      notes: rp.notes || '',
      createdAt: rp.createdAt,
      updatedAt: rp.updatedAt,
      species: rp.species
    }));

    const mergedMap = new Map();
    localPlants.forEach(lp => mergedMap.set(lp.id, lp));

    normalizedRemote.forEach(rp => {
      mergedMap.set(rp.id, rp);
    });

    const mergedList = Array.from(mergedMap.values());

    if (persistToAllStorages && typeof persistToAllStorages === 'function') {
      await persistToAllStorages(mergedList);
    }

    await set(SYNC_STATUS_KEY, new Date().toISOString());

    return { synced: true, plants: mergedList };
  } catch (err) {
    console.warn('Falha ao sincronizar com o backend cloud:', err.message);
    return { synced: false, reason: err.message, plants: localPlants };
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    processPendingQueue().catch(err => console.warn('Erro ao processar fila online:', err));
  });
}
