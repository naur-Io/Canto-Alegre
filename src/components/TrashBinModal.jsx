import React, { useState } from 'react';
import { Trash2, RotateCcw, X, AlertTriangle, Sprout, CheckCircle2 } from 'lucide-react';

export default function TrashBinModal({
  isOpen,
  onClose,
  trashPlants = [],
  onRestore,
  onPermanentDelete,
  onEmptyTrash,
  currentLang = 'pt-BR'
}) {
  const [confirmingEmpty, setConfirmingEmpty] = useState(false);

  if (!isOpen) return null;

  const isEn = currentLang === 'en';

  const handleEmpty = () => {
    if (confirmingEmpty) {
      onEmptyTrash();
      setConfirmingEmpty(false);
    } else {
      setConfirmingEmpty(true);
    }
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(isEn ? 'en-US' : 'pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoStr;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '580px', width: '90%' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--primary-50, rgba(239, 68, 68, 0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-danger, #ef4444)'
            }}>
              <Trash2 size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                {isEn ? "Garden Trash Bin" : "Lixeira do Jardim"}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isEn 
                  ? `${trashPlants.length} removed item(s)` 
                  : `${trashPlants.length} planta(s) removida(s)`}
              </p>
            </div>
          </div>

          <button className="modal-close" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', padding: '16px 20px' }}>
          {trashPlants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <Sprout size={48} color="var(--primary-300, #a7f3d0)" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                {isEn ? "Your trash bin is empty" : "Sua lixeira esta vazia"}
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                {isEn 
                  ? "Deleted plants will appear here before being permanently removed." 
                  : "Plantas excluidas aparecerao aqui antes de serem removidas permanentemente."}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {trashPlants.map(plant => (
                <div 
                  key={plant.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    background: 'var(--surface-hover, #f8fafc)',
                    border: '1px solid var(--border-color)',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <img 
                      src={plant.photoUrl || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80'} 
                      alt={plant.commonName || plant.name}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4 style={{ 
                        margin: 0, 
                        fontSize: '0.95rem', 
                        fontWeight: 700, 
                        color: 'var(--primary-900)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {plant.commonName || plant.name || 'Planta'}
                      </h4>
                      {plant.scientificName && (
                        <p style={{ 
                          margin: '2px 0 0', 
                          fontSize: '0.78rem', 
                          fontStyle: 'italic', 
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {plant.scientificName}
                        </p>
                      )}
                      {plant.deletedAt && (
                        <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {isEn ? 'Removed on: ' : 'Excluido em: '}{formatDate(plant.deletedAt)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onRestore(plant.id)}
                      title={isEn ? "Restore to Garden" : "Restaurar para o Jardim"}
                      style={{ color: 'var(--primary-600, #059669)', padding: '6px 10px', fontSize: '0.8rem' }}
                    >
                      <RotateCcw size={14} />
                      <span className="nav-btn-text-full">{isEn ? "Restore" : "Restaurar"}</span>
                    </button>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onPermanentDelete(plant.id)}
                      title={isEn ? "Delete Permanently" : "Excluir Definitivamente"}
                      style={{ color: 'var(--accent-danger, #ef4444)', borderColor: '#fca5a5', padding: '6px 10px', fontSize: '0.8rem' }}
                    >
                      <Trash2 size={14} />
                      <span className="nav-btn-text-full">{isEn ? "Delete" : "Excluir"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {trashPlants.length > 0 && (
          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
            {confirmingEmpty ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-danger)', fontWeight: 600 }}>
                  {isEn ? "Confirm permanent deletion?" : "Confirmar exclusao definitiva?"}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setConfirmingEmpty(false)}>
                    {isEn ? "Cancel" : "Cancelar"}
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleEmpty} style={{ background: 'var(--accent-danger, #ef4444)', borderColor: '#ef4444' }}>
                    {isEn ? "Yes, Empty All" : "Sim, Esvaziar"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={handleEmpty}
                  style={{ color: 'var(--accent-danger)', borderColor: '#fca5a5' }}
                >
                  <Trash2 size={14} />
                  <span>{isEn ? "Empty Trash Bin" : "Esvaziar Lixeira"}</span>
                </button>

                <button className="btn btn-secondary btn-sm" onClick={onClose}>
                  <span>{isEn ? "Close" : "Fechar"}</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
