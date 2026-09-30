import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddPlantModal from '../AddPlantModal';

vi.mock('../../services/geminiService', async () => {
  const actual = await vi.importActual('../../services/geminiService');
  return {
    ...actual,
    autoCompletePlantByName: vi.fn().mockResolvedValue({
      commonName: 'Jiboia',
      scientificName: 'Epipremnum aureum',
      idealEnvironment: 'Dentro de casa',
      sunlight: { lightType: 'indireta' },
      watering: { frequencyTimesPerWeek: 2, frequencyDays: 3 }
    })
  };
});

describe('AddPlantModal Component', () => {
  it('renders initial question step in PT-BR', () => {
    render(
      <AddPlantModal 
        isOpen={true} 
        onClose={vi.fn()} 
        onSave={vi.fn()} 
        hasApiKey={false} 
        currentLang="pt-BR"
      />
    );

    expect(screen.getByText(/ja conhece o nome da planta/i)).toBeDefined();
    
    const knowsNameBtn = screen.getByText(/ja sei o nome da planta/i);
    fireEvent.click(knowsNameBtn);

    expect(screen.getByText('Nome da Planta / Nome Popular *')).toBeDefined();
  });

  it('renders initial question step in EN when currentLang is en', () => {
    render(
      <AddPlantModal 
        isOpen={true} 
        onClose={vi.fn()} 
        onSave={vi.fn()} 
        hasApiKey={false} 
        currentLang="en"
      />
    );

    expect(screen.getByText("Do you already know the plant's name?")).toBeDefined();
    expect(screen.getByText("Yes, I know the plant's name")).toBeDefined();
  });

  it('triggers AI autocomplete and shows animated reveal card', async () => {
    render(
      <AddPlantModal 
        isOpen={true} 
        onClose={vi.fn()} 
        onSave={vi.fn()} 
        hasApiKey={false} 
        currentLang="pt-BR"
      />
    );

    const knowsNameBtn = screen.getByText(/ja sei o nome da planta/i);
    fireEvent.click(knowsNameBtn);

    const nameInput = screen.getByPlaceholderText('Ex: Jiboia, Manjericão, Monstera, Samambaia...');
    fireEvent.change(nameInput, { target: { value: 'Jiboia' } });

    const autoCompleteBtn = screen.getByText('Auto-completar Ficha com IA');
    fireEvent.click(autoCompleteBtn);

    // Deve exibir o card de revelacao animado com "Esta e a sua Jiboia!"
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('Jiboia'))).toBeDefined();
    });
  });
});
