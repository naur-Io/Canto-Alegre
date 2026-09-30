import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PlantDetailModal from '../PlantDetailModal';

describe('PlantDetailModal Component', () => {
  const mockPlant = {
    id: 'plant-detail-1',
    commonName: 'Espada de Sao Jorge',
    scientificName: 'Sansevieria trifasciata',
    photoUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587'
  };

  it('renders plant details correctly', () => {
    render(
      <PlantDetailModal 
        plant={mockPlant}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onWater={vi.fn()}
      />
    );

    expect(screen.getAllByText('Espada de Sao Jorge').length).toBeGreaterThan(0);
    expect(screen.getByText('Sansevieria trifasciata')).toBeDefined();
    expect(screen.getByText('Alterar / Tirar Foto')).toBeDefined();
  });

  it('triggers delete callback when clicking remove button', () => {
    const handleDelete = vi.fn();
    window.confirm = () => true;

    render(
      <PlantDetailModal 
        plant={mockPlant}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onDelete={handleDelete}
        onWater={vi.fn()}
      />
    );

    const removeBtn = screen.getByText('Remover');
    fireEvent.click(removeBtn);

    expect(handleDelete).toHaveBeenCalledWith('plant-detail-1');
  });

  it('triggers water callback when clicking mark as watered', () => {
    const handleWater = vi.fn();

    render(
      <PlantDetailModal 
        plant={mockPlant}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onWater={handleWater}
      />
    );

    const waterBtn = screen.getByText('Marcar como Regada Hoje');
    fireEvent.click(waterBtn);

    expect(handleWater).toHaveBeenCalledWith('plant-detail-1');
  });
});
