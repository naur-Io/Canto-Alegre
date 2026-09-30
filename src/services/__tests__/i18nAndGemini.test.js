import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  translateEnvironment, 
  translateSoil, 
  translateTemperature, 
  translateMethod, 
  translateDifficulty, 
  translateBestSeason, 
  translateRootingTime 
} from '../i18n';
import { 
  autoCompletePlantByName, 
  analyzePlantImage, 
  getDefaultPropagationForPlant, 
  simulateSmartAiAnalysis 
} from '../geminiService';

describe('i18n Bidirectional Translation Helpers', () => {
  it('should translate environment text bidirectionally between PT-BR and EN', () => {
    const ptText = 'Dentro de casa (Sala, Quarto ou Escritório)';
    const enText = translateEnvironment(ptText, 'en');
    expect(enText).toBe('Indoor (Living Room, Bedroom or Office)');

    const backToPt = translateEnvironment(enText, 'pt-BR');
    expect(backToPt).toBe('Dentro de casa (Sala, Quarto ou Escritório)');
  });

  it('should translate soil text bidirectionally', () => {
    const ptSoil = 'Solo rico em matéria orgânica, leve e com boa drenagem';
    const enSoil = translateSoil(ptSoil, 'en');
    expect(enSoil).toBe('Soil rich in organic matter, light and well-draining');

    const ptAgain = translateSoil(enSoil, 'pt-BR');
    expect(ptAgain).toBe('Solo rico em matéria orgânica, leve e com boa drenagem');
  });

  it('should translate temperature text bidirectionally', () => {
    const ptTemp = '18°C a 27°C (clima ameno a quente)';
    const enTemp = translateTemperature(ptTemp, 'en');
    expect(enTemp).toBe('18°C to 27°C (mild to warm climate)');

    const ptAgain = translateTemperature(enTemp, 'pt-BR');
    expect(ptAgain).toBe('18°C a 27°C (clima ameno a quente)');
  });

  it('should translate propagation method bidirectionally', () => {
    const ptMethod = 'Estaquia de caule com nó na água';
    const enMethod = translateMethod(ptMethod, 'en');
    expect(enMethod).toBe('Stem cuttings with node in water');

    const ptAgain = translateMethod(enMethod, 'pt-BR');
    expect(ptAgain).toBe('Estaquia de caule com nó na água');
  });

  it('should translate difficulty, best season, and rooting time', () => {
    expect(translateDifficulty('Muito Fácil', 'en')).toBe('Very Easy');
    expect(translateDifficulty('Very Easy', 'pt-BR')).toBe('Muito Fácil');

    expect(translateBestSeason('Primavera e Verão', 'en')).toBe('Spring & Summer');
    expect(translateBestSeason('Spring & Summer', 'pt-BR')).toBe('Primavera e Verão');

    expect(translateRootingTime('2 a 4 semanas', 'en')).toBe('2 to 4 weeks');
    expect(translateRootingTime('2 to 4 weeks', 'pt-BR')).toBe('2 a 4 semanas');
  });
});

describe('Gemini Service i18n & Propagation Support', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should generate default propagation guide in English when currentLang is en', () => {
    const propagationEn = getDefaultPropagationForPlant({ commonName: 'Golden Pothos' }, 'en');
    expect(propagationEn.method).toBe('Stem cuttings with node in water');
    expect(propagationEn.bestSeason).toBe('Spring & Summer');
    expect(propagationEn.difficulty).toBe('Very Easy');
    expect(propagationEn.stepByStep.length).toBeGreaterThan(0);

    const propagationPt = getDefaultPropagationForPlant({ commonName: 'Jiboia' }, 'pt-BR');
    expect(propagationPt.method).toBe('Estaquia de caule com nó na água');
    expect(propagationPt.bestSeason).toBe('Primavera e Verão');
    expect(propagationPt.difficulty).toBe('Muito Fácil');
  });

  it('should return simulated analysis in English when currentLang is en', async () => {
    const resultEn = simulateSmartAiAnalysis('en');
    expect(resultEn).toBeDefined();
    expect(resultEn.commonName).toBeDefined();
  });

  it('should support currentLang parameter in autoCompletePlantByName fallback', async () => {
    const result = await autoCompletePlantByName('Monstera', null, 'en');
    expect(result.commonName).toBe('Monstera');
    expect(result.propagation).toBeDefined();
  });

  it('should support currentLang parameter in analyzePlantImage fallback', async () => {
    const dummyBase64 = 'aW1hZ2VfZGF0YQ==';
    const result = await analyzePlantImage(dummyBase64, null, 'en');
    expect(result).toBeDefined();
    expect(result.commonName).toBeDefined();
  });
});
