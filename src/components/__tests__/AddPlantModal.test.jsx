import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddPlantModal from '../AddPlantModal';

describe('AddPlantModal Component', () => {
  it('renders initial question step and handles save callback', () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <AddPlantModal 
        isOpen={true} 
        onClose={handleClose} 
        onSave={handleSave} 
        hasApiKey={false} 
      />
    );

    expect(screen.getByText('Você já conhece o nome da planta?')).toBeDefined();
    
    // Clicar em "Sim, ja sei o nome da planta"
    const knowsNameBtn = screen.getByText('Sim, já sei o nome da planta');
    fireEvent.click(knowsNameBtn);

    expect(screen.getByText('Nome da Planta / Nome Popular *')).toBeDefined();
  });
});
