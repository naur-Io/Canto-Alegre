// Base de dados inicial botânica com apenas a Jiboia
export const INITIAL_PLANTS = [
  {
    id: 'plant-jiboia-02',
    commonName: 'Jiboia',
    scientificName: 'Epipremnum aureum',
    origin: 'Ilhas Salomão e Polinésia Francesa (Pacífico Sul)',
    photoUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    plantType: 'Luz Indireta / Meia Sombra',
    healthStatus: 'Excelente Vigor',
    lastWatered: new Date(Date.now() - 86400000 * 2).toISOString(),
    sunlight: {
      lightType: 'indireta',
      period: 'Luz Indireta Forte / Sol da Manhã Suave',
      hoursPerDay: '4 a 6 horas',
      notes: 'Prefere luz difusa abundante para manter a variegação amarela das folhas. Sol forte do meio-dia queima as folhas.'
    },
    watering: {
      frequencyTimesPerWeek: 2,
      frequencyDays: 3,
      amountMl: '150 - 250 ml',
      description: 'Regar cerca de 2 vezes por semana. Verificar com o dedo se o substrato está seco antes de regar.'
    },
    soilType: 'Substrato fértil e bem drenável (composto orgânico com casca de pinus moída e perlita)',
    idealTemperature: '18°C a 30°C (aprecia ambientes quentes; proteger de ventos gelados)',
    howToCare: 'Remover folhas secas na base com tesoura limpa. Podar as pontas longas quando desejar estimular brotações laterais e folhagem mais cheia.',
    fertilizer: {
      type: 'NPK 10-10-10 foliar ou Húmus de Minhoca',
      frequency: 'A cada 30 dias na Primavera e Verão',
      notes: 'Adicionar adubo orgânico ao redor da borda do vaso.'
    },
    propagation: {
      method: 'Estaquia de caule na água ou solo',
      bestSeason: 'Qualquer época do ano (ideal na Primavera/Verão)',
      rootingTime: '10 a 20 dias',
      difficulty: 'Muito Fácil',
      stepByStep: [
        '1. Escolha um ramo saudável com folhas bonitas e localize os nós (pequenas saliências ou raízes aéreas marrons no caule).',
        '2. Corte na diagonal cerca de 1 cm abaixo de um nó, mantendo de 2 a 3 folhas no topo.',
        '3. Retire as folhas mais baixas para que apenas o nó fique submerso.',
        '4. Coloque o corte em um vidro transparente com água limpa em local com boa claridade indireta.',
        '5. Troque a água a cada 2 a 3 dias para oxigenar. Quando as raízes atingirem cerca de 4 cm, transfira para um vaso com terra.'
      ],
      proTips: 'A Jiboia enraíza muito rápido na água. Não deixe folhas encostadas na água para evitar que apodreçam.'
    },
    careTips: [
      'Pode ser cultivada pendente ou conduzida em tutor de fibra de coco.',
      'Limpar a poeira das folhas quinzenalmente para melhorar a fotossíntese.'
    ],
    notes: 'Planta de crescimento rápido e muito resistente para interiores.'
  }
];
