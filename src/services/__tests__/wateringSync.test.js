import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { clear } from 'idb-keyval';
import { markAsWatered, persistToAllStorages } from '../storageService';
import { apiService } from '../apiService';
import { getPendingQueue } from '../syncService';

vi.mock('../apiService', () => ({
  apiService: { getPlants: vi.fn(), waterPlant: vi.fn() }
}));

describe('watering synchronized plants', () => {
  beforeEach(async () => {
    await clear();
    localStorage.clear();
    vi.clearAllMocks();
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    apiService.getPlants.mockResolvedValue([]);
    apiService.waterPlant.mockResolvedValue({});
    await persistToAllStorages([
      { id: 'plant-local', remoteId: 'cloud-123', commonName: 'Jiboia', lastWatered: '2020-01-01' }
    ]);
  });

  afterEach(() => vi.restoreAllMocks());

  it('uses the cloud ID while updating the local plant', async () => {
    const plants = await markAsWatered('plant-local');
    expect(apiService.waterPlant).toHaveBeenCalledWith('cloud-123');
    expect(plants[0].id).toBe('plant-local');
    expect(new Date(plants[0].lastWatered).getTime()).toBeGreaterThan(new Date('2020-01-01').getTime());
  });

  it('queues the cloud ID when watering offline', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    await markAsWatered('plant-local');
    expect(apiService.waterPlant).not.toHaveBeenCalled();
    expect(await getPendingQueue()).toEqual([
      expect.objectContaining({ type: 'WATER_PLANT', payload: { plantId: 'cloud-123' } })
    ]);
  });

  it('queues the cloud ID if the online request fails', async () => {
    apiService.waterPlant.mockRejectedValue(new Error('Unavailable'));
    await markAsWatered('plant-local');
    await vi.waitFor(async () => {
      expect(await getPendingQueue()).toEqual([
        expect.objectContaining({ type: 'WATER_PLANT', payload: { plantId: 'cloud-123' } })
      ]);
    });
  });

  it('uses the existing ID for a plant loaded directly from the cloud', async () => {
    await persistToAllStorages([{ id: 'cloud-direct', commonName: 'Cacto' }]);
    await markAsWatered('cloud-direct');
    expect(apiService.waterPlant).toHaveBeenCalledWith('cloud-direct');
  });
});
