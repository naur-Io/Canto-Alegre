import React from 'react';
import { Droplets, Sun, AlertCircle, CheckCircle2, Clock, Globe, Sprout, Home } from 'lucide-react';
import { translateEnvironment, translateMethod } from '../services/i18n';

export default function PlantCard({ plant, onWater, onSelect, onClick, currentLang = 'pt-BR' }) {
  const isEn = currentLang === 'en';

  const handleCardClick = () => {
    const selectFn = onSelect || onClick;
    if (selectFn) selectFn(plant);
  };

  // Cálculo de dias até a próxima rega
  const lastWateredDate = new Date(plant.lastWatered);
  const freqDays = plant.watering?.frequencyDays || 3;
  const nextWaterDate = new Date(lastWateredDate.getTime() + freqDays * 86400000);
  
  const now = new Date();
  const diffHours = (nextWaterDate - now) / (1000 * 60 * 60);
  const needsWater = diffHours <= 0;

  // Formatar status de rega
  let waterStatusText = '';
  let isWateredToday = false;

  const hoursSinceLastWater = (now - lastWateredDate) / (1000 * 60 * 60);
  if (hoursSinceLastWater < 14) {
    isWateredToday = true;
    waterStatusText = isEn ? 'Watered Today' : 'Regada Hoje';
  } else if (needsWater) {
    const daysOverdue = Math.abs(Math.floor(diffHours / 24));
    waterStatusText = daysOverdue > 0 
      ? (isEn ? `Overdue (${daysOverdue}d)` : `Atrasada (${daysOverdue}d)`)
      : (isEn ? 'Needs Water Today!' : 'Precisa de Agua Hoje!');
  } else {
    const daysLeft = Math.ceil(diffHours / 24);
    waterStatusText = isEn 
      ? `Water in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`
      : `Regar em ${daysLeft} dia${daysLeft > 1 ? 's' : ''}`;
  }

  const handleWaterClick = (e) => {
    e.stopPropagation();
    onWater(plant.id);
  };

  // Determinar rótulo de luz
  const periodStr = typeof plant.sunlight?.period === 'string' ? plant.sunlight.period.toLowerCase() : '';
  const lightType = plant.sunlight?.lightType || (periodStr.includes('direto') ? 'direta' : periodStr.includes('sombra') ? 'sombra' : 'indireta');
  const getLightBadge = () => {
    if (lightType === 'direta') {
      return { text: isEn ? 'Full Sun' : 'Sol Direto', className: 'badge-sun-direct' };
    }
    if (lightType === 'sombra') {
      return { text: isEn ? 'Shade' : 'Sombra', className: 'badge-shade' };
    }
    return { text: isEn ? 'Indirect Light' : 'Luz Indireta', className: 'badge-sun-indirect' };
  };
  const lightBadge = getLightBadge();

  const rawPropMethod = plant.propagation?.method || plant.propagationMethod || '';
  const propagationMethod = translateMethod(rawPropMethod, currentLang);

  const rawEnv = plant.idealEnvironment || (
    lightType === 'direta' 
      ? 'Fora de casa (Quintal ou Sacada Ensolarada)'
      : lightType === 'sombra' 
      ? 'Dentro de casa (Banheiro ou Cômodo de Sombra)'
      : 'Dentro de casa (Sala, Quarto ou Escritório)'
  );
  const environmentText = translateEnvironment(rawEnv, currentLang);

  return (
    <div className="plant-card" onClick={handleCardClick}>
      <div className="card-img-wrapper">
        <img 
          src={plant.photoUrl || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'} 
          alt={plant.commonName} 
          className="card-img"
          loading="lazy"
        />
        <div className="badge-overlay">
          <span className={`badge ${lightBadge.className}`}>
            <Sun size={12} />
            {lightBadge.text}
          </span>

          <span className="badge badge-environment" title={`${isEn ? 'Location' : 'Onde fica'}: ${environmentText}`}>
            <Home size={12} />
            {environmentText}
          </span>

          {needsWater && !isWateredToday && (
            <span className="badge badge-urgent">
              <AlertCircle size={12} />
              {isEn ? 'Water Today' : 'Regar Hoje'}
            </span>
          )}
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title">{plant.commonName}</h3>
        <p className="card-subtitle">{plant.scientificName || (isEn ? 'Botanical species' : 'Espécie botânica')}</p>

        <div className="card-environment-box" title={`${isEn ? 'Location' : 'Onde fica a planta'}: ${environmentText}`}>
          <Home size={13} color="#047857" />
          <span><strong>{isEn ? 'Location:' : 'Onde Fica:'}</strong> {environmentText}</span>
        </div>

        {plant.origin && (
          <div className="card-origin-snippet" title={plant.origin}>
            <Globe size={12} />
            <span>{plant.origin}</span>
          </div>
        )}

        {propagationMethod && (
          <div className="card-propagation-snippet" title={`${isEn ? 'Cutting propagation' : 'Como tirar mudas'}: ${propagationMethod}`}>
            <Sprout size={12} color="#059669" />
            <span>{isEn ? 'Cuttings:' : 'Muda:'} {propagationMethod}</span>
          </div>
        )}

        <div className="care-mini-info">
          <div className="care-item" title={isEn ? "Water volume" : "Volume de água"}>
            <Droplets size={14} color="#0284c7" />
            <span>{plant.watering?.amountMl || '150 - 200 ml'}</span>
          </div>
          <div className="care-item" title={isEn ? "Watering frequency" : "Frequência de rega"}>
            <Clock size={14} color="#059669" />
            <span>
              {plant.watering?.frequencyTimesPerWeek 
                ? `${plant.watering.frequencyTimesPerWeek}x / ${isEn ? 'week' : 'semana'}` 
                : (isEn ? `Every ${plant.watering?.frequencyDays || 3}d` : `A cada ${plant.watering?.frequencyDays || 3}d`)}
            </span>
          </div>
        </div>

        <div className="card-footer">
          <div className={`water-status ${needsWater && !isWateredToday ? 'needs-water' : 'watered'}`}>
            {isWateredToday ? (
              <CheckCircle2 size={14} />
            ) : needsWater ? (
              <AlertCircle size={14} />
            ) : (
              <Clock size={14} />
            )}
            <span>{waterStatusText}</span>
          </div>

          <button
            className={`btn btn-sm ${isWateredToday ? 'btn-secondary' : 'btn-accent-water'}`}
            onClick={handleWaterClick}
            title={isEn ? "Mark as watered now" : "Marcar como regada agora"}
          >
            <Droplets size={14} />
            <span>{isWateredToday ? (isEn ? 'Watered' : 'Regada') : (isEn ? 'Water' : 'Regar')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
