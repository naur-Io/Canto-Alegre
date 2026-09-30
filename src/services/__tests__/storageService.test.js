import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getStoredPlants, 
  savePlant, 
  deletePlant, 
  getTrashBinPlants, 
  restorePlantFromTrash, 
  permanentlyDeletePlant, 
  emptyTrashBin,
  getDeletedPlantIds
} from '../storageService';

describe('storageService - Persistent Deletion & Trash Bin', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save a plant and retrieve it in getStoredPlants', async () => {
    const newPlant = {
      id: 'test-plant-1',
      commonName: 'Planta Teste',
      scientificName: 'Testus plantus'
    };

    await savePlant(newPlant);
    const plants = await getStoredPlants();
    
    expect(plants.some(p => p.id === 'test-plant-1')).toBe(true);
  });

  it('should persistently delete a plant and move it to the trash bin', async () => {
    const plant = {
      id: 'test-plant-delete',
      commonName: 'Jiboia Teste',
      scientificName: 'Epipremnum aureum'
    };

    await savePlant(plant);
    let activePlants = await getStoredPlants();
    expect(activePlants.some(p => p.id === 'test-plant-delete')).toBe(true);

    // Excluir a planta
    activePlants = await deletePlant('test-plant-delete');
    expect(activePlants.some(p => p.id === 'test-plant-delete')).toBe(false);

    // Verificar se o ID consta em deletedPlantIds
    const deletedIds = await getDeletedPlantIds();
    expect(deletedIds).toContain('test-plant-delete');

    // Verificar se a planta esta na Lixeira
    const trash = await getTrashBinPlants();
    expect(trash.some(p => p.id === 'test-plant-delete')).toBe(true);

    // Ao recarregar getStoredPlants, a planta NUNCA deve retornar
    const reloadedPlants = await getStoredPlants();
    expect(reloadedPlants.some(p => p.id === 'test-plant-delete')).toBe(false);
  });

  it('should restore a plant from the trash bin back to garden', async () => {
    const plant = {
      id: 'test-plant-restore',
      commonName: 'Samambaia Teste'
    };

    await savePlant(plant);
    await deletePlant('test-plant-restore');

    let trash = await getTrashBinPlants();
    expect(trash.some(p => p.id === 'test-plant-restore')).toBe(true);

    // Restaurar a planta
    const result = await restorePlantFromTrash('test-plant-restore');
    expect(result.trash.some(p => p.id === 'test-plant-restore')).toBe(false);
    expect(result.plants.some(p => p.id === 'test-plant-restore')).toBe(true);

    // Verificar se o ID foi removido de deletedPlantIds
    const deletedIds = await getDeletedPlantIds();
    expect(deletedIds).not.toContain('test-plant-restore');
  });

  it('should permanently delete a plant from the trash bin', async () => {
    const plant = {
      id: 'test-plant-perm',
      commonName: 'Cacto Teste'
    };

    await savePlant(plant);
    await deletePlant('test-plant-perm');

    let trash = await getTrashBinPlants();
    expect(trash.length).toBeGreaterThan(0);

    const updatedTrash = await permanentlyDeletePlant('test-plant-perm');
    expect(updatedTrash.some(p => p.id === 'test-plant-perm')).toBe(false);
  });

  it('should empty the trash bin completely', async () => {
    await savePlant({ id: 'trash-1', commonName: 'Planta 1' });
    await savePlant({ id: 'trash-2', commonName: 'Planta 2' });

    await deletePlant('trash-1');
    await deletePlant('trash-2');

    let trash = await getTrashBinPlants();
    expect(trash.length).toBeGreaterThanOrEqual(2);

    const empty = await emptyTrashBin();
    expect(empty.length).toBe(0);
  });
});
