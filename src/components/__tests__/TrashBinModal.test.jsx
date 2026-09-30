import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TrashBinModal from '../TrashBinModal';

describe('TrashBinModal Component', () => {
  const mockPlants = [
    {
      id: 'trash-1',
      commonName: 'Jiboia Removida',
      scientificName: 'Epipremnum aureum',
      deletedAt: new Date().toISOString()
    }
  ];

  it('renders empty trash bin message when list is empty', () => {
    render(
      <TrashBinModal 
        isOpen={true} 
        onClose={vi.fn()} 
        trashPlants={[]} 
        onRestore={vi.fn()} 
        onPermanentDelete={vi.fn()} 
        onEmptyTrash={vi.fn()} 
      />
    );

    expect(screen.getByText('Sua lixeira esta vazia')).toBeDefined();
  });

  it('renders trash plant items and calls onRestore when clicking restore', () => {
    const handleRestore = vi.fn();

    render(
      <TrashBinModal 
        isOpen={true} 
        onClose={vi.fn()} 
        trashPlants={mockPlants} 
        onRestore={handleRestore} 
        onPermanentDelete={vi.fn()} 
        onEmptyTrash={vi.fn()} 
      />
    );

    expect(screen.getByText('Jiboia Removida')).toBeDefined();
    
    const restoreBtn = screen.getByText('Restaurar');
    fireEvent.click(restoreBtn);

    expect(handleRestore).toHaveBeenCalledWith('trash-1');
  });

  it('calls onPermanentDelete when clicking delete button', () => {
    const handleDelete = vi.fn();

    render(
      <TrashBinModal 
        isOpen={true} 
        onClose={vi.fn()} 
        trashPlants={mockPlants} 
        onRestore={vi.fn()} 
        onPermanentDelete={handleDelete} 
        onEmptyTrash={vi.fn()} 
      />
    );

    const deleteBtn = screen.getByText('Excluir');
    fireEvent.click(deleteBtn);

    expect(handleDelete).toHaveBeenCalledWith('trash-1');
  });
});
