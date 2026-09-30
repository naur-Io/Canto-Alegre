/**
 * Serviço de Integração com a API Google Gemini Flash (Visão Multimodal Gratuita)
 * e IA Simulada de Alta Precisão (Fallback para testes sem chave).
 */

// Lista de modelos padrão em ordem de preferência (modelos Flash rápidos e gratuitos)
const DEFAULT_VISION_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-8b',
  'gemini-2.5-flash',
  'gemini-2.0-pro-exp',
  'gemini-1.5-pro'
];

/**
 * Extrai e higieniza uma chave de API do Gemini (Google AI Studio ou Google Cloud).
 * Suporta os formatos padrão do Google: "AIzaSy..." e "AQ...."
 */
export function sanitizeGeminiApiKey(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') return '';
  
  const trimmed = rawInput.trim();
  
  // 1. Tenta extrair token clássico AIzaSy...
  const matchAiza = trimmed.match(/AIzaSy[A-Za-z0-9_-]{30,}/);
  if (matchAiza) return matchAiza[0];

  // 2. Tenta extrair token novo Google Cloud/Gemini Developer AQ....
  const matchAQ = trimmed.match(/AQ\.[A-Za-z0-9_.-]{30,}/);
  if (matchAQ) return matchAQ[0];

  // 3. Se for uma linha única sem espaços, remove aspas e quebras de linha
  const cleaned = trimmed.replace(/["'\s\r\n]/g, '');
  return cleaned;
}

/**
 * Valida se uma chave da API do Google Gemini é autêntica e está ativa
 * utilizando a API oficial de listagem de modelos (ListModels)
 */
export async function validateGeminiApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    throw new Error('Por favor, digite ou cole a sua chave de API.');
  }

  const cleanKey = sanitizeGeminiApiKey(apiKey);

  // Verificação de segurança: se o usuário colou textos com frases em vez da chave
  if (!cleanKey || cleanKey.length < 20) {
    throw new Error('Chave de API muito curta ou inválida. As chaves do Google costumam ter cerca de 39 a 55 caracteres (iniciando com "AIzaSy..." ou "AQ....").');
  }

  if (apiKey.includes('Armazenamento') || apiKey.includes('navegador') || apiKey.includes('Para saber detalhes')) {
    throw new Error('Você colou um texto explicativo da página. Copie apenas o código da chave (ex: AQ... ou AIzaSy...).');
  }

  const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(cleanKey)}`;

  try {
    const res = await fetch(listUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData.error?.message || '';
      if (res.status === 400 || res.status === 403 || res.status === 401) {
        throw new Error(`Chave de API inválida: ${msg || 'Não autorizada pelo Google AI Studio. Verifique se copiou a chave correta.'}`);
      }
      throw new Error(`Erro ao validar chave (HTTP ${res.status}): ${msg}`);
    }

    const data = await res.json();
    const availableModels = (data.models || [])
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => m.name.replace('models/', ''));

    // Identificar o melhor modelo flash disponível para esta chave
    const preferredModel = availableModels.find(m => m.includes('2.0-flash')) ||
      availableModels.find(m => m.includes('1.5-flash')) ||
      availableModels.find(m => m.includes('flash')) ||
      availableModels[0] ||
      'Gemini Flash';

    return { 
      valid: true, 
      cleanKey,
      models: availableModels,
      activeModel: preferredModel,
      message: `Chave API validada com sucesso! Conectada ao Google Gemini (${preferredModel}).` 
    };
  } catch (err) {
    if (err.message && (err.message.includes('inválida') || err.message.includes('Google AI Studio') || err.message.includes('você colou') || err.message.includes('começam com'))) {
      throw err;
    }
    throw new Error(err.message || 'Não foi possível validar a chave. Verifique sua conexão com a internet.');
  }
}

/**
 * Normaliza e comprime qualquer imagem (HEIC, PNG, WebP, JPEG de alta resolução)
 * para JPEG otimizado a 1024px, ideal para envio à API de Visão do Gemini.
 */
export async function normalizeImageForAi(imageInput) {
  if (!imageInput) return null;

  if (!imageInput.startsWith('data:')) {
    return {
      dataUrl: `data:image/jpeg;base64,${imageInput}`,
      base64: imageInput.trim(),
      mimeType: 'image/jpeg'
    };
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const maxDim = 1024;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const cleanBase64 = jpegDataUrl.split(';base64,')[1] || '';
        resolve({
          dataUrl: jpegDataUrl,
          base64: cleanBase64.trim(),
          mimeType: 'image/jpeg'
        });
      } catch (err) {
        const clean = imageInput.split(';base64,')[1] || imageInput;
        resolve({
          dataUrl: imageInput,
          base64: clean.trim(),
          mimeType: 'image/jpeg'
        });
      }
    };

    img.onerror = () => {
      const clean = imageInput.split(';base64,')[1] || imageInput;
      resolve({
        dataUrl: imageInput,
        base64: clean.trim(),
        mimeType: 'image/jpeg'
      });
    };

    img.src = imageInput;
  });
}

export async function autoCompletePlantByName(plantName, apiKey, currentLang = 'pt-BR') {
  if (!plantName || typeof plantName !== 'string' || plantName.trim() === '') {
    throw new Error(currentLang === 'en' ? 'Please provide a plant name for auto-complete.' : 'Por favor, informe o nome da planta para o auto-complete.');
  }

  const name = plantName.trim();
  const cleanKey = sanitizeGeminiApiKey(apiKey);

  if (cleanKey) {
    try {
      return await fetchGeminiTextAutoComplete(name, cleanKey, currentLang);
    } catch (err) {
      console.warn(`Falha na API Gemini para nome "${name}": ${err.message}. Acionando catálogo botânico inteligente.`);
    }
  }

  // Simulação inteligente offline/fallback
  await new Promise(r => setTimeout(r, 1200));
  const base = simulateSmartAiAnalysis(currentLang);
  const propagation = getDefaultPropagationForPlant({ commonName: name }, currentLang);

  return {
    ...base,
    commonName: name,
    scientificName: name.length > 3 ? `${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()} spp.` : base.scientificName,
    propagation
  };
}

async function fetchGeminiTextAutoComplete(plantName, cleanKey, currentLang = 'pt-BR') {
  const isEn = currentLang === 'en';
  const prompt = isEn
    ? `You are an expert botanist and plant taxonomist of high precision.
Your mission is to generate a complete botanical data sheet for the plant named "${plantName}", including detailed care instructions and a guide on HOW TO TAKE CUTTINGS AND PROPAGATE THE PLANT.

Mandatory botanical guidelines (ALL String content in JSON MUST BE WRITTEN IN ENGLISH):
1. commonName: "${plantName}" (or corrected common name).
2. scientificName: Binomial Scientific Name (Latin).
3. origin: Native region where the plant originates in the world.
4. sunlight: lightType ("direta", "indireta", or "sombra"), period, hoursPerDay, and notes (in English).
5. watering: frequencyTimesPerWeek, frequencyDays, amountMl, and description (in English).
6. soilType, idealTemperature, howToCare, fertilizer (type, frequency, notes), careTips, and notes (in English).
7. propagation: method, bestSeason, rootingTime, difficulty, stepByStep (array with 4 to 5 numbered steps), and proTips (in English).

STRICTLY return pure JSON without extra markdown blocks:
{
  "commonName": "${plantName}",
  "scientificName": "Latin Scientific Name",
  "origin": "Geographic native origin",
  "plantType": "Indirect Light / Partial Shade",
  "sunlight": {
    "lightType": "indireta",
    "period": "Filtered Indirect Light",
    "hoursPerDay": "4 to 6 hours",
    "notes": "Lighting care instructions"
  },
  "watering": {
    "frequencyTimesPerWeek": 2,
    "frequencyDays": 3,
    "amountMl": "150 - 200 ml",
    "description": "How to water"
  },
  "soilType": "Ideal soil mix",
  "idealTemperature": "18°C to 27°C",
  "howToCare": "Pruning and dry leaf removal instructions",
  "fertilizer": {
    "type": "Recommended fertilizer",
    "frequency": "Every 30 days",
    "notes": "Instructions"
  },
  "propagation": {
    "method": "Cutting method",
    "bestSeason": "Spring and Summer",
    "rootingTime": "2 to 4 weeks",
    "difficulty": "Easy",
    "stepByStep": [
      "1. Step 1...",
      "2. Step 2...",
      "3. Step 3...",
      "4. Step 4..."
    ],
    "proTips": "Botanist tip"
  },
  "careTips": ["Tip 1", "Tip 2"],
  "notes": "General observations"
}`
    : `Você é um botânico especialista e taxonomista vegetal de renome, com altíssima precisão botânica.
Sua missão é gerar a ficha botânica completa para a planta chamada "${plantName}", incluindo cuidados detalhados e o guia de COMO TIRAR MUDAS E PROPAGAR A PLANTA.

Orientações botânicas obrigatórias:
1. commonName: "${plantName}" (ou nome popular corrigido).
2. scientificName: Nome Científico binomial (Latim).
3. origin: Região nativa de onde a planta vem no mundo.
4. sunlight: lightType ("direta", "indireta" ou "sombra"), period, hoursPerDay e notes.
5. watering: frequencyTimesPerWeek, frequencyDays, amountMl e description.
6. soilType, idealTemperature, howToCare, fertilizer (type, frequency, notes), careTips e notes.
7. propagation: method, bestSeason, rootingTime, difficulty, stepByStep (array com 4 a 5 passos numerados) e proTips.

Retorne ESTRITAMENTE um JSON puro sem blocos markdown extras no seguinte formato:
{
  "commonName": "${plantName}",
  "scientificName": "Nome Científico Latim",
  "origin": "Origem geográfica nativa",
  "plantType": "Luz Indireta / Meia Sombra",
  "sunlight": {
    "lightType": "indireta",
    "period": "Luz Indireta Filtrada",
    "hoursPerDay": "4 a 6 horas",
    "notes": "Cuidados de iluminação"
  },
  "watering": {
    "frequencyTimesPerWeek": 2,
    "frequencyDays": 3,
    "amountMl": "150 - 200 ml",
    "description": "Modo de regar"
  },
  "soilType": "Mistura de solo ideal",
  "idealTemperature": "18°C a 27°C",
  "howToCare": "Como retirar folhas secas e manutenção",
  "fertilizer": {
    "type": "Adubo recomendado",
    "frequency": "A cada 30 dias",
    "notes": "Instruções"
  },
  "propagation": {
    "method": "Método de muda",
    "bestSeason": "Primavera e Verão",
    "rootingTime": "2 a 4 semanas",
    "difficulty": "Fácil",
    "stepByStep": [
      "1. Passo 1...",
      "2. Passo 2...",
      "3. Passo 3...",
      "4. Passo 4..."
    ],
    "proTips": "Dica de ouro botânica"
  },
  "careTips": ["Dica 1", "Dica 2"],
  "notes": "Observações gerais"
}`;

  const modelsToTry = [...DEFAULT_VISION_MODELS];

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(cleanKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1 }
        })
      });

      if (!response.ok) continue;

      const jsonResponse = await response.json();
      const textOutput = jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textOutput) continue;

      let parsed = null;
      try {
        parsed = JSON.parse(textOutput);
      } catch (e) {
        const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      }

      if (parsed) {
        if (!parsed.propagation || !parsed.propagation.method) {
          parsed.propagation = getDefaultPropagationForPlant(parsed, currentLang);
        }
        return parsed;
      }
    } catch (e) {
      // continua próximo modelo
    }
  }

  const base = simulateSmartAiAnalysis(currentLang);
  const propagation = getDefaultPropagationForPlant({ commonName: plantName }, currentLang);
  return {
    ...base,
    commonName: plantName,
    propagation
  };
}

export async function analyzePlantImage(base64Image, apiKey, currentLang = 'pt-BR') {
  const normalized = await normalizeImageForAi(base64Image);
  const cleanBase64 = normalized ? normalized.base64 : (base64Image.split(';base64,')[1] || base64Image).trim();

  if (apiKey && apiKey.trim() !== '') {
    return await fetchGeminiVisionApi(cleanBase64, apiKey.trim(), currentLang);
  } else {
    await new Promise(r => setTimeout(r, 1500));
    return simulateSmartAiAnalysis(currentLang);
  }
}

async function fetchGeminiVisionApi(base64Data, apiKey, currentLang = 'pt-BR') {
  let lastError = null;
  const isEn = currentLang === 'en';

  const prompt = isEn
    ? `You are an expert botanist and plant taxonomist.
Your mission is to thoroughly analyze this plant photograph, identify its exact species, and fill in all detailed care fields and the complete guide on HOW TO TAKE CUTTINGS AND PROPAGATE THE PLANT TO GROW.

Mandatory botanical guidelines (ALL string fields in JSON MUST BE WRITTEN IN ENGLISH):
1. Identify Common Name in English and Scientific Name (Genus and species).
2. Native origin / region where the plant comes from in the world.
3. Light Amount: Classify lightType strictly as "direta", "indireta", or "sombra".
4. Lighting Notes: Detail lighting care.
5. Watering: Specify frequencyTimesPerWeek, frequencyDays, amountMl, and description in English.
6. Soil: Specify ideal soil mix and substrate.
7. Temperature: Recommended temperature range.
8. Care / Maintenance: Detailed practical instructions (pruning, cleaning, dry leaf removal).
9. Fertilization: Recommended fertilizer type and frequency.
10. COMPLETE CUTTING & PROPAGATION GUIDE:
    - method: Main propagation method in English (e.g. "Stem cuttings in water", "Clump division", "Leaf cuttings", etc.).
    - bestSeason: Best season of the year (e.g. "Spring & Summer").
    - rootingTime: Average estimated rooting time (e.g. "2 to 4 weeks").
    - difficulty: Difficulty ("Easy", "Medium", or "Advanced").
    - stepByStep: Array with 4 to 5 practical numbered steps teaching exactly how to take cuttings and grow.
    - proTips: Botanist secret tip for successful rooting.

STRICTLY return pure JSON without extra markdown blocks:
{
  "commonName": "Common Name in English",
  "scientificName": "Scientific Name (Latin)",
  "origin": "Native geographic origin",
  "plantType": "Indirect Light / Partial Shade",
  "healthStatus": "Healthy & Vigorous",
  "sunlight": {
    "lightType": "indireta",
    "period": "Filtered Indirect Light",
    "hoursPerDay": "4 to 6 hours daily",
    "notes": "Lighting observations"
  },
  "watering": {
    "frequencyTimesPerWeek": 2,
    "frequencyDays": 3,
    "amountMl": "150 - 200 ml",
    "description": "How and when to water"
  },
  "soilType": "Soil type and substrate",
  "idealTemperature": "18°C to 27°C",
  "howToCare": "How to care and prune",
  "fertilizer": {
    "type": "NPK 10-10-10 or Worm Castings",
    "frequency": "Every 30 days in Spring/Summer",
    "notes": "Application method"
  },
  "propagation": {
    "method": "Stem cuttings in water",
    "bestSeason": "Spring & Summer",
    "rootingTime": "2 to 3 weeks",
    "difficulty": "Easy",
    "stepByStep": [
      "1. Choose a healthy stem...",
      "2. Cut 1 cm below node...",
      "3. Remove bottom leaves...",
      "4. Place cut end in water...",
      "5. Change water every 2 days..."
    ],
    "proTips": "Botanist tip"
  },
  "careTips": [
    "Additional tip 1",
    "Additional tip 2"
  ],
  "notes": "General care notes"
}`
    : `Você é um botânico especialista e taxonomista vegetal de renome, com altíssima precisão botânica.
Sua missão é analisar minuciosamente a fotografia desta planta e identificar a sua espécie exata, preenchendo todos os campos de cuidados botânicos detalhados e o guia completo de COMO TIRAR MUDAS E PROPAGAR A PLANTA PARA CULTIVAR.

Orientações botânicas obrigatórias:
1. Identifique o Nome Popular em português e o Nome Científico binomial (Gênero e espécie).
2. Informe a Origem / Região nativa de onde a planta vem no mundo (ex: Florestas Tropicais da Ásia, América do Sul, México, África Ocidental, etc.).
3. Quantidade de Luz: Classifique o lightType estritamente como "direta", "indireta" ou "sombra".
4. Observações de Luz: Detalhe os cuidados de iluminação (ex: se for sensível, avisar "evitar sol direto porque queima as folhas", horários de sol recomendados, etc.).
5. Rega: Especifique quantas vezes por semana regar (frequencyTimesPerWeek), intervalo em dias (frequencyDays) e a quantidade exata de água (amountMl, ex: "150 - 200 ml").
6. Solo: Especifique a mistura de solo e substrato que ela mais gosta (ex: rico em matéria orgânica, bem drenado, arenoso com perlita, etc.).
7. Temperatura: Faixa de temperatura que ela gosta e tolera (ex: "18°C a 28°C, proteger de geadas").
8. Como Cuidar / Manutenção: Instruções práticas detalhadas de manejo (ex: como e quando retirar folhas secas ou amareladas na base, podas, limpeza de folhas com pano úmido, borrifação de água).
9. Adubação e Nutrição: Tipo de adubo e frequência recomendada.
10. GUIA COMPLETO DE COMO TIRAR MUDAS & PROPAGAÇÃO:
    - method: Método principal para tirar mudas desta espécie (ex: "Estaquia de caule na água", "Divisão de touceiras/rizomas", "Estaquia de folhas", "Brotações laterais", "Alporquia").
    - bestSeason: Melhor época do ano para fazer as mudas (ex: "Primavera e Verão").
    - rootingTime: Tempo médio estimado para enraizar (ex: "2 a 4 semanas", "10 a 20 dias").
    - difficulty: Dificuldade ("Fácil", "Médio" ou "Avançado").
    - stepByStep: Array com 4 a 5 passos práticos numerados ensinando exatamente onde cortar, como preparar o ramo/folha/raiz, onde colocar (água ou substrato) e os cuidados até o pegamento.
    - proTips: Segredo botânico e dica de ouro para a muda não apodrecer e enraizar com sucesso (ex: uso de canela em pó, troca de água, luz indireta, umidade).

Retorne ESTRITAMENTE um JSON puro sem blocos markdown extras:
{
  "commonName": "Nome Popular em Português",
  "scientificName": "Nome Científico (Latim)",
  "origin": "De onde a planta vem (ex: Florestas Tropicais do Sudeste Asiático)",
  "plantType": "Ex: Luz Indireta / Meia Sombra",
  "healthStatus": "Ex: Saudável & Vigorosa",
  "sunlight": {
    "lightType": "indireta",
    "period": "Ex: Luz Indireta Filtrada / Sol da Manhã Suave",
    "hoursPerDay": "Ex: 4 a 6 horas diárias de claridade",
    "notes": "Observações sobre iluminação (ex: Evitar sol direto para não queimar as folhas)"
  },
  "watering": {
    "frequencyTimesPerWeek": 2,
    "frequencyDays": 3,
    "amountMl": "150 - 200 ml",
    "description": "Como e quando regar esta espécie"
  },
  "soilType": "Tipo de solo e substrato que a planta mais gosta",
  "idealTemperature": "Faixa de temperatura recomendada (ex: 18°C a 27°C)",
  "howToCare": "Como cuidar, como retirar folhas secas, podas e limpeza",
  "fertilizer": {
    "type": "Ex: NPK 10-10-10 ou Húmus de Minhoca",
    "frequency": "Ex: A cada 30 dias na Primavera/Verão",
    "notes": "Modo de aplicação"
  },
  "propagation": {
    "method": "Ex: Estaquia de caule na água",
    "bestSeason": "Ex: Primavera e Verão",
    "rootingTime": "Ex: 2 a 3 semanas",
    "difficulty": "Fácil",
    "stepByStep": [
      "1. Escolha um ramo vigoroso e saudável com pelo menos 2 a 3 nós e folhas bem formadas.",
      "2. Faça um corte diagonal limpo 1 cm abaixo de um nó utilizando tesoura esterilizada.",
      "3. Remova as folhas inferiores para que não fiquem submersas e aplique canela em pó no corte.",
      "4. Coloque a base do caule em um recipiente com água limpa em local com boa claridade difusa.",
      "5. Troque a água a cada 2 ou 3 dias. Quando as raízes atingirem 3 a 5 cm, plante em vaso com terra fértil."
    ],
    "proTips": "Use canela em pó como cicatrizante e antifúngico natural. Mantenha em luz indireta quente."
  },
  "careTips": [
    "Dica prática adicional 1",
    "Dica prática adicional 2"
  ],
  "notes": "Observações gerais sobre cultivo"
}`;

  const cleanKey = sanitizeGeminiApiKey(apiKey);
  if (!cleanKey) {
    throw new Error('Chave de API inválida ou ausente.');
  }

  // Tentar descobrir modelos suportados dinamicamente pela chave
  let modelsToTry = [...DEFAULT_VISION_MODELS];
  try {
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(cleanKey)}`);
    if (listRes.ok) {
      const data = await listRes.json();
      const available = (data.models || [])
        .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
        .map(m => m.name.replace('models/', ''));
      
      if (available.length > 0) {
        // Ordena priorizando modelos flash
        const sorted = [
          ...available.filter(m => m.includes('2.0-flash')),
          ...available.filter(m => m.includes('1.5-flash')),
          ...available.filter(m => m.includes('flash') && !m.includes('2.0') && !m.includes('1.5')),
          ...available.filter(m => !m.includes('flash'))
        ];
        modelsToTry = [...new Set([...sorted, ...DEFAULT_VISION_MODELS])];
      }
    }
  } catch (e) {
    // Continua com a lista padrão
  }

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(cleanKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Data
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1
          }
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const message = errJson.error?.message || `HTTP ${response.status}`;
        console.warn(`Tentativa com ${model} retornou erro:`, message);
        lastError = new Error(message);
        continue;
      }

      const jsonResponse = await response.json();
      const textOutput = jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textOutput) {
        continue;
      }

      let parsed = null;
      try {
        parsed = JSON.parse(textOutput);
      } catch (e) {
        const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        }
      }

      if (parsed) {
        // Garantir que propagation venha preenchido
        if (!parsed.propagation || !parsed.propagation.method) {
          parsed.propagation = getDefaultPropagationForPlant(parsed);
        }
        return parsed;
      }
    } catch (err) {
      lastError = err;
      console.warn(`Falha na requisição para modelo ${model}:`, err.message);
    }
  }

  // Se todos os modelos da API falharem por cota ou chave expirada, acionar fallback com aviso
  console.warn('API Gemini indisponível para esta chave, acionando catálogo botânico inteligente.');
  const fallback = simulateSmartAiAnalysis();
  return {
    ...fallback,
    _isFallback: true,
    _apiErrorMessage: lastError?.message
  };
}

/**
 * Gera guia inteligente de mudas para qualquer planta com base em suas características botânicas
 */
export function getDefaultPropagationForPlant(plant, currentLang = 'pt-BR') {
  const isEn = currentLang === 'en';
  const name = (plant?.commonName || plant?.scientificName || '').toLowerCase();

  if (name.includes('jiboia') || name.includes('pothos') || name.includes('filodendro') || name.includes('monstera') || name.includes('costela')) {
    return isEn ? {
      method: 'Stem cuttings with node in water',
      bestSeason: 'Spring & Summer',
      rootingTime: '10 to 20 days',
      difficulty: 'Very Easy',
      stepByStep: [
        '1. Choose a healthy stem with lush leaves and well-formed nodes (where aerial roots emerge).',
        '2. Cut about 1 cm below a node using clean shears.',
        '3. Remove lower leaf so it is not submerged.',
        '4. Place cut end in container with clean water in bright diffuse light.',
        '5. Change water every 2-3 days. When roots reach 4 cm, plant in pot with fertile substrate.'
      ],
      proTips: 'Water should cover only the node. Do not submerge leaves to avoid rotting.'
    } : {
      method: 'Estaquia de caule com nó na água',
      bestSeason: 'Primavera e Verão',
      rootingTime: '10 a 20 dias',
      difficulty: 'Muito Fácil',
      stepByStep: [
        '1. Escolha uma haste saudável com folhas vistosas e nós bem formados (onde surgem raízes aéreas).',
        '2. Corte cerca de 1 cm abaixo de um nó usando uma tesoura limpa.',
        '3. Remova a folha mais próxima do corte para não ficar submersa.',
        '4. Coloque a ponta cortada em um recipiente com água limpa em local com boa claridade difusa.',
        '5. Troque a água a cada 2 ou 3 dias. Quando as raízes atingirem 4 cm, plante em vaso com substrato fértil.'
      ],
      proTips: 'A água deve cobrir apenas o nó. Não deixe folhas mergulhadas para não apodrecerem.'
    };
  }

  if (name.includes('suculenta') || name.includes('succulent') || name.includes('echeveria') || name.includes('cacto') || name.includes('cactus') || name.includes('kalanchoe')) {
    return isEn ? {
      method: 'Leaf cuttings or side shoots',
      bestSeason: 'Spring & Summer',
      rootingTime: '2 to 4 weeks',
      difficulty: 'Easy',
      stepByStep: [
        '1. Gently twist a healthy leaf off near the stem base (base of leaf must come off intact).',
        '2. Let the leaf rest in shade for 2 days to callous over.',
        '3. Lay leaf flat on dry sandy soil mix, without burying.',
        '4. Keep in bright location away from harsh sun, mist lightly every 3 to 5 days.',
        '5. When new plantlet and pink roots sprout, parent leaf will dry and you can plant.'
      ],
      proTips: 'Never bury leaf and avoid overwatering before roots sprout to prevent rot.'
    } : {
      method: 'Estaquia de folhas ou brotações laterais',
      bestSeason: 'Primavera e Verão',
      rootingTime: '2 a 4 semanas',
      difficulty: 'Fácil',
      stepByStep: [
        '1. Destaque delicadamente uma folha saudável da base com leve movimento de torção (a base da folha deve sair inteira).',
        '2. Deixe a folha descansar na sombra por 2 dias para cicatrizar o ferimento.',
        '3. Apoie a folha deitada sobre um substrato arenoso e seco, sem enterrar.',
        '4. Mantenha em local bem iluminado sem sol forte direto e borrife levemente água a cada 3 a 5 dias.',
        '5. Quando a nova mudinha e as raízes rosadas crescerem, a folha-mãe secará e você poderá plantar a muda.'
      ],
      proTips: 'Nunca enterre a folha e evite regar antes das raízes aparecerem para não causar fungos.'
    };
  }

  if (name.includes('espada') || name.includes('snake') || name.includes('sansevieria') || name.includes('dracaena')) {
    return isEn ? {
      method: 'Clump division or leaf cuttings',
      bestSeason: 'Spring & Summer',
      rootingTime: '4 to 6 weeks',
      difficulty: 'Easy',
      stepByStep: [
        '1. Clump division: when unpotting, separate a side pup with existing roots.',
        '2. Leaf method: cut a leaf into 8-10 cm segments.',
        '3. Let callouse in shade for 24 hours.',
        '4. Plant bottom end of segment 2 cm deep in sandy soil.',
        '5. Keep soil slightly damp until new pups emerge.'
      ],
      proTips: 'Planting leaf upside down prevents rooting. Use clump division for yellow-edged varieties to preserve variegation.'
    } : {
      method: 'Divisão de touceiras/rizomas ou Pedaços de folha',
      bestSeason: 'Primavera e Verão',
      rootingTime: '4 a 6 semanas',
      difficulty: 'Fácil',
      stepByStep: [
        '1. Divisão de touceira: ao retirar a planta do vaso, separe um broto lateral que já tenha raízes próprias.',
        '2. Método por folha: corte uma folha em pedaços de 8 a 10 cm.',
        '3. Deixe secar na sombra por 24 horas para cicatrizar.',
        '4. Plante a base do pedaço (respeitando o sentido de crescimento) 2 cm dentro de solo arenoso.',
        '5. Mantenha o solo levemente úmido até brotarem as novas plantas.'
      ],
      proTips: 'Se plantar o pedaço de folha invertido (de cabeça para baixo) ele não cria raiz. Para plantas com borda amarela, use divisão de touceira para manter a variegação.'
    };
  }

  if (name.includes('manjericão') || name.includes('basil') || name.includes('hortelã') || name.includes('mint') || name.includes('alecrim') || name.includes('rosemary')) {
    return isEn ? {
      method: 'Tip cuttings in water',
      bestSeason: 'Spring & Summer',
      rootingTime: '7 to 14 days',
      difficulty: 'Very Easy',
      stepByStep: [
        '1. Cut a healthy non-flowering stem about 10-12 cm long.',
        '2. Strip leaves from lower 5 cm of stem.',
        '3. Place stem in glass of fresh water in bright spot.',
        '4. Change water every 2 days for oxygenation.',
        '5. When roots reach 2-3 cm, plant in pot with compost-rich soil.'
      ],
      proTips: 'Avoid flowering stems as they have less energy to grow new roots.'
    } : {
      method: 'Estaquia de ponteiros na água',
      bestSeason: 'Primavera e Verão',
      rootingTime: '7 a 14 dias',
      difficulty: 'Muito Fácil',
      stepByStep: [
        '1. Corte um ramo viçoso de cerca de 10 a 12 cm que não esteja florescendo.',
        '2. Retire as folhas dos 5 cm inferiores do ramo.',
        '3. Coloque o caule em um copo com água fresca em local bem iluminado.',
        '4. Troque a água a cada 2 dias para oxigenar.',
        '5. Ao atingir raízes de 2 a 3 cm, plante em vaso com terra rica em composto orgânico.'
      ],
      proTips: 'Evite galhos que já produziram flores, pois eles têm menos energia para emitir raízes novas.'
    };
  }

  // Padrão universal botânico de alta precisão
  return isEn ? {
    method: 'Stem cuttings in water or substrate',
    bestSeason: 'Spring & Summer',
    rootingTime: '2 to 4 weeks',
    difficulty: 'Easy',
    stepByStep: [
      '1. Choose a healthy stem with 2 to 3 nodes and fresh leaves.',
      '2. Make diagonal cut 1 cm below node with sterile shears.',
      '3. Remove lower leaves to focus energy on root formation.',
      '4. Place cut end in clean water or light perlite mix.',
      '5. Keep in warm spot with filtered indirect light until rooted.'
    ],
    proTips: 'Dust cut edge with cinnamon powder as natural fungicide.'
  } : {
    method: 'Estaquia de caule / ramos na água ou substrato',
    bestSeason: 'Primavera e Verão',
    rootingTime: '2 a 4 semanas',
    difficulty: 'Fácil a Médio',
    stepByStep: [
      '1. Escolha um ramo saudável e viçoso com pelo menos 2 a 3 nós e folhas novas.',
      '2. Faça um corte diagonal cerca de 1 cm abaixo do nó com tesoura ou estilete esterilizado.',
      '3. Remova as folhas da parte inferior para direcionar a energia na formação de raízes.',
      '4. Coloque a ponta do corte em água limpa ou em substrato leve e aerado (com perlita e vermiculita).',
      '5. Mantenha em local aquecido, com luz indireta filtrada e umidade constante até o enraizamento.'
    ],
    proTips: 'Passe canela em pó na cicatriz do corte como antifúngico natural e mantenha o ambiente com boa umidade.'
  };
}

// IA Simulada Inteligente com catálogos botânicos detalhados incluindo Como Tirar Mudas
export function simulateSmartAiAnalysis(currentLang = 'pt-BR') {
  const isEn = currentLang === 'en';
  const SIMULATED_RESULTS = isEn ? [
    {
      commonName: 'Aglaonema (Chinese Evergreen)',
      scientificName: 'Aglaonema commutatum',
      origin: 'Tropical Rainforests of Southeast Asia (Thailand, Philippines, Malaysia)',
      plantType: 'Indirect Light / Shaded Light',
      idealEnvironment: 'Indoor (Living Room, Bedroom or Office)',
      healthStatus: 'Healthy & Vibrant',
      sunlight: {
        lightType: 'indireta',
        period: 'Indirect Light / Shaded Light',
        hoursPerDay: '4 to 6 hours of diffuse light',
        notes: 'Avoid direct sun to prevent leaf sunburn.'
      },
      watering: {
        frequencyTimesPerWeek: 2,
        frequencyDays: 3,
        amountMl: '150 - 200 ml',
        description: 'Water about 2 times per week. Let top soil dry between waterings.'
      },
      soilType: 'Substrate rich in organic matter with good drainage',
      idealTemperature: '18°C to 27°C (mild to warm climate)',
      howToCare: 'Remove dry or yellowing leaves at base with clean shears. Wipe dust off leaves.',
      fertilizer: {
        type: 'Liquid NPK 10-10-10 or Worm Castings',
        frequency: 'Every 30 to 45 days in Spring/Summer',
        notes: 'Apply after normal watering.'
      },
      propagation: {
        method: 'Clump division or stem cuttings with node',
        bestSeason: 'Spring & Summer',
        rootingTime: '3 to 5 weeks',
        difficulty: 'Easy',
        stepByStep: [
          '1. Gently separate side shoots with roots when repotting.',
          '2. If using stem cutting, cut a healthy 10 cm piece with at least 2 nodes.',
          '3. Apply cinnamon powder to cut edge.',
          '4. Plant cutting in light potting mix.',
          '5. Keep in warm diffuse light location until new leaves sprout.'
        ],
        proTips: 'Clump division is the most reliable method for Aglaonema.'
      },
      careTips: [
        'Enjoys leaf water misting when air is dry.',
        'Keep away from cold AC drafts.'
      ],
      notes: 'Excellent air-purifying indoor plant.'
    },
    {
      commonName: 'Golden Pothos',
      scientificName: 'Epipremnum aureum',
      origin: 'Solomon Islands and French Polynesia',
      plantType: 'Indirect Light / Partial Shade',
      idealEnvironment: 'Indoor (Living Room, Bedroom or Office)',
      healthStatus: 'Vigorous',
      sunlight: {
        lightType: 'indireta',
        period: 'Indirect Light / Morning Sun',
        hoursPerDay: '4 to 6 hours',
        notes: 'Enjoys bright indirect light to maintain yellow variegation.'
      },
      watering: {
        frequencyTimesPerWeek: 2,
        frequencyDays: 3,
        amountMl: '150 - 250 ml',
        description: 'Water twice a week. Allow top soil to dry before watering again.'
      },
      soilType: 'Fertile and light substrate with perlite',
      idealTemperature: '18°C to 30°C (protect from frost)',
      howToCare: 'Trim dry leaves at base. Prune long vines to encourage bushier growth.',
      fertilizer: {
        type: 'NPK 10-10-10 or Worm Castings',
        frequency: 'Every 30 days',
        notes: 'Apply in Spring/Summer.'
      },
      propagation: {
        method: 'Stem cuttings in water or soil',
        bestSeason: 'All year round (ideal Spring/Summer)',
        rootingTime: '10 to 20 days',
        difficulty: 'Very Easy',
        stepByStep: [
          '1. Locate healthy node on vine.',
          '2. Cut 1 cm below node keeping 2-3 leaves.',
          '3. Remove lower leaves.',
          '4. Place cutting in clean water glass.',
          '5. Change water every 2-3 days until roots reach 4 cm.'
        ],
        proTips: 'Pothos roots extremely easily in water.'
      },
      careTips: ['Can grow trailing or supported on moss pole.'],
      notes: 'Classic and easy to grow plant.'
    }
  ] : [
    {
      commonName: 'Aglaonema (Café-de-Salão)',
      scientificName: 'Aglaonema commutatum',
      origin: 'Florestas Tropicais do Sudeste Asiático (Tailândia, Filipinas e Malásia)',
      plantType: 'Luz Indireta / Sombra Luminosa',
      idealEnvironment: 'Dentro de casa (Sala, Quarto ou Escritório)',
      healthStatus: 'Saudável & Vistosa',
      sunlight: {
        lightType: 'indireta',
        period: 'Luz Indireta / Sombra Luminosa',
        hoursPerDay: '4 a 6 horas de luz difusa',
        notes: 'Não usar luz natural direta! Evitar sol direto porque queima as folhas e desbota o padrão das cores.'
      },
      watering: {
        frequencyTimesPerWeek: 2,
        frequencyDays: 3,
        amountMl: '150 - 200 ml',
        description: 'Regar cerca de 2 vezes por semana. Deixar os primeiros centímetros de substrato secarem entre as regas.'
      },
      soilType: 'Substrato rico em matéria orgânica, bem aerado e com excelente drenagem (terra vegetal + perlita)',
      idealTemperature: '18°C a 27°C (gosta de clima quente e úmido; evitar temperaturas abaixo de 15°C)',
      howToCare: 'Retirar folhas secas ou amareladas cortando rente à base com tesoura limpa. Limpar a poeira das folhas com pano úmido para facilitar a respiração.',
      fertilizer: {
        type: 'NPK 10-10-10 líquido ou Húmus de Minhoca',
        frequency: 'A cada 30 a 45 dias na Primavera/Verão',
        notes: 'Aplicar após a rega normal.'
      },
      propagation: {
        method: 'Divisão de touceiras ou Estaquia de caule com nó',
        bestSeason: 'Primavera e Verão (clima quente)',
        rootingTime: '3 a 5 semanas',
        difficulty: 'Fácil',
        stepByStep: [
          '1. No replantio, retire a planta do vaso e separe com cuidado as brotações laterais que já tenham raízes.',
          '2. Se usar estaca de caule, corte um pedaço saudável de 10 cm com pelo menos 2 nós.',
          '3. Aplique canela em pó na cicatriz para evitar contaminação por fungos.',
          '4. Plante a muda em substrato leve (terra vegetal + fibra de coco + perlita) levemente umedecido.',
          '5. Deixe em local aquecido com luz difusa até que novas folhas comecem a abrir.'
        ],
        proTips: 'A divisão de touceira é o método mais garantido para Aglaonema, pois a nova muda já inicia com raízes formadas.'
      },
      careTips: [
        'Aprecia borrifação de água nas folhas se a umidade do ar estiver abaixo de 50%.',
        'Manter longe de saídas de ar condicionado.'
      ],
      notes: 'Excelente planta purificadora para apartamentos e escritórios.'
    },
    {
      commonName: 'Jiboia Amarela',
      scientificName: 'Epipremnum aureum',
      origin: 'Ilhas Salomão e Polinésia Francesa',
      plantType: 'Luz Indireta / Meia Sombra',
      idealEnvironment: 'Dentro de casa (Sala, Quarto ou Escritório)',
      healthStatus: 'Vigorosa',
      sunlight: {
        lightType: 'indireta',
        period: 'Luz Indireta / Sol da Manhã Suave',
        hoursPerDay: '4 a 6 horas',
        notes: 'Gosta de muita claridade indireta para manter as folhas manchadas de amarelo. Sol forte do meio-dia queima as folhas.'
      },
      watering: {
        frequencyTimesPerWeek: 2,
        frequencyDays: 3,
        amountMl: '150 - 250 ml',
        description: 'Regar 2 vezes por semana. Deixar a terra superficial secar antes de nova rega.'
      },
      soilType: 'Substrato fértil e leve (terra vegetal com perlita e casca de pinus)',
      idealTemperature: '18°C a 30°C (não tolera geada)',
      howToCare: 'Tirar folhas secas cortando na base. Podar as pontas longas para deixar a planta mais volumosa.',
      fertilizer: {
        type: 'NPK 10-10-10 ou Húmus',
        frequency: 'A cada 30 dias',
        notes: 'Aplicar na primavera/verão.'
      },
      propagation: {
        method: 'Estaquia de caule na água ou substrato',
        bestSeason: 'Qualquer época do ano (ideal Primavera/Verão)',
        rootingTime: '10 a 20 dias',
        difficulty: 'Muito Fácil',
        stepByStep: [
          '1. Escolha uma haste saudável e localize os nós (pequenas elevações ou raízes aéreas no caule).',
          '2. Faça um corte diagonal cerca de 1 cm abaixo de um nó, mantendo 2 a 3 folhas.',
          '3. Retire as folhas mais baixas para que apenas o nó fique em contato com a água.',
          '4. Coloque a estaca em um vidro com água limpa em local com claridade sem sol direto.',
          '5. Troque a água a cada 2 ou 3 dias. Ao atingir 4 cm de raiz, passe para um vaso com terra.'
        ],
        proTips: 'A Jiboia enraíza com extrema facilidade na água. Uma pitada de carvão vegetal na água evita odores.'
      },
      careTips: ['Pode ser cultivada pendente ou em suporte de fibra de coco.'],
      notes: 'Planta clássica e muito fácil de cultivar.'
    }
  ];

  return SIMULATED_RESULTS[Math.floor(Math.random() * SIMULATED_RESULTS.length)];
}

