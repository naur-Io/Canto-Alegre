import { get, set } from 'idb-keyval';

const API_BASE_URL = 'http://localhost:8080/api/v1';
const GUEST_ID_KEY = 'canto_alegre_guest_uuid';

export async function getOrCreateGuestId() {
  let guestId = await get(GUEST_ID_KEY);
  if (!guestId) {
    guestId = crypto.randomUUID();
    await set(GUEST_ID_KEY, guestId);
  }
  return guestId;
}

async function fetchWithGuestId(url, options = {}) {
  const guestId = await getOrCreateGuestId();
  const headers = {
    'Content-Type': 'application/json',
    'X-Guest-Id': guestId,
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Erro na requisicao HTTP: ${response.status}`);
  }
  return response.json();
}

export const apiService = {
  async getPlants() {
    return fetchWithGuestId('/plants');
  },

  async createPlant(plantData) {
    return fetchWithGuestId('/plants', {
      method: 'POST',
      body: JSON.stringify(plantData)
    });
  },

  async waterPlant(plantId, notes = '') {
    return fetchWithGuestId(`/plants/${plantId}/water`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    });
  },

  async getThirstyPlants() {
    return fetchWithGuestId('/plants/thirsty');
  },

  async searchSpecies(query = '') {
    return fetchWithGuestId(`/species?search=${encodeURIComponent(query)}`);
  }
};
