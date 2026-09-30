import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PlantCard from '../PlantCard';

describe('PlantCard Component', () => {
  const mockPlant = {
    id: 'plant-card-1',
    commonName: 'Jiboia Verde',
    scientificName: 'Epipremnum aureum',
    lastWatered: new Date().toISOString()
  };

  it('triggers onSelect when clicking the card', () => {
    const handleSelect = vi.fn();

    render(
      <PlantCard 
        plant={mockPlant}
        onWater={vi.fn()}
        onSelect={handleSelect}
      />
    );

    const cardTitle = screen.getByText('Jiboia Verde');
    fireEvent.click(cardTitle);

    expect(handleSelect).toHaveBeenCalledWith(mockPlant);
  });
});
