import { get, set } from 'idb-keyval';

const LANGUAGE_KEY = 'cantoalegre_user_language';

export const TRANSLATIONS = {
  'pt-BR': {
    nav: {
      brandTag: 'IA Botanica & Mudas',
      presentation: 'Apresentacao',
      myGarden: 'Meu Jardim',
      installApp: 'Instalar App',
      openApp: 'Ir para o App',
      settings: 'Configuracoes',
      feedback: 'Feedback & Suporte',
      lixeira: 'Lixeira',
      novidades: 'Novidades',
      guia: 'Guia & PWA'
    },
    hero: {
      badge: 'IA Multimodal Google Gemini + PWA 100% Offline',
      title: 'Canto Alegre',
      subtitle: 'Cultive a vida, planta por planta.',
      description: 'Seu assistente botanico inteligente no bolso: tire uma foto da folha ou vaso para identificar a especie, descobrir a rega e sol ideais, e aprender o passo a passo seguro para fazer mudas e propagacao.',
      useAppCta: 'Adquirir e Usar Agora',
      downloadPwa: 'Baixar como App (PWA)',
      viewGithub: 'Ver no GitHub'
    },
    purpose: {
      title: 'Proposito do Canto Alegre',
      description: 'Nascido da vivencia pratica durante voluntariados no Worldpackers em fazendas agroecologicas e eco-pousadas, o Canto Alegre une o aprendizado pratico da terra com IA de ponta para tornar a jardinagem acessivel a todos, em qualquer lugar.',
      card1Title: 'Identificacao por Foto',
      card1Desc: 'Aponte a camera para qualquer planta. A IA analisa as folhas, nervuras e flores para reconhecer nome botanico, familia e origem.',
      card2Title: 'Guia Completo de Mudas',
      card2Desc: 'Aprenda a multiplicar sua colecao com instrucoes de estaquia, divisao de touceira e enraizamento, incluindo a melhor epoca do ano.',
      card3Title: 'Alerta de Sede & Regas',
      card3Desc: 'Acompanhe o cronograma de regas. Veja quais plantas estao com sede e registre cada cuidado com um toque.',
      card4Title: 'Sol & Luminosidade',
      card4Desc: 'Descubra se a especie prefere sol pleno, luz filtrada ou sombra, alem da temperatura e umidade recomendadas.',
      card5Title: '100% Offline (PWA)',
      card5Desc: 'Funciona mesmo sem internet na roca ou na horta. Seus dados e fotos ficam guardados no seu navegador via IndexedDB com total privacidade.',
      card6Title: 'Gratuito & Imediato',
      card6Desc: 'Use diretamente no navegador com dados simulados ou conecte sua chave gratuita do Google AI Studio sem pagar mensalidades.'
    },
    install: {
      title: 'Como Instalar no seu Dispositivo (PWA)',
      subtitle: 'O Canto Alegre e um aplicativo web progressivo que nao ocupa espaco excessivo na memoria e funciona offline no Android e iOS.',
      androidTitle: 'Instalacao no Android (Chrome / Edge / Samsung)',
      androidStep1: '1. Abra o site no navegador do seu celular.',
      androidStep2: '2. Toque no botao "Instalar App" na barra superior ou no menu do navegador (tres pontos no canto superior direito).',
      androidStep3: '3. Selecione "Instalar aplicativo" ou "Adicionar a tela inicial".',
      iosTitle: 'Instalacao no iPhone / iPad (Safari)',
      iosStep1: '1. Abra o site no navegador Safari.',
      iosStep2: '2. Toque no icone de Compartilhar (quadrado com seta para cima na barra inferior).',
      iosStep3: '3. Role as opcoes para baixo e toque em "Adicionar a Tela de Inicio".'
    },
    feedback: {
      title: 'Feedbacks & Suporte',
      subtitle: 'Sua opiniao e fundamental para evoluirmos o Canto Alegre. Envie sugestoes, duvidas ou relatos de problemas.',
      btnOpen: 'Enviar Feedback ou Obter Suporte',
      modalTitle: 'Central de Feedback & Suporte',
      typeLabel: 'Tipo de Mensagem',
      typeSuggestion: 'Sugestao de Funcionalidade',
      typeIssue: 'Relato de Problema / Bug',
      typeQuestion: 'Duvida sobre Cultivo / App',
      messagePlaceholder: 'Escreva sua mensagem detalhada aqui...',
      emailPlaceholder: 'Seu e-mail para contato (opcional)',
      btnSubmit: 'Enviar Mensagem',
      btnClose: 'Fechar',
      successMessage: 'Obrigado pelo seu feedback! Sua mensagem foi registrada com sucesso.'
    },
    credits: {
      title: 'Creditos & Reconhecimentos',
      builtBy: 'Desenvolvido com dedicacao por ruan rickelme (naur-Io).',
      inspiration: 'Inspirado pelas experiencias de voluntariado ambiental e jardinagem via Worldpackers.',
      techStack: 'Construido com React 18, Vite, Spring Boot 3, PostgreSQL e Google Gemini AI API.',
      license: 'Licenca Open-Source MIT.'
    },
    garden: {
      searchPlaceholder: 'Buscar por nome, origem, tipo de solo ou cuidados...',
      filterAll: 'Todas',
      filterNeedsWater: 'Precisa de Agua',
      filterDirectSun: 'Sol Pleno',
      filterIndirectLight: 'Luz Indireta',
      filterShade: 'Sombra',
      emptyTitle: 'Seu Jardim esta Vazio',
      emptySearchTitle: 'Nenhuma planta encontrada',
      emptyDesc: 'Comece sua colecao botanica inteligente cadastrando sua primeira muda.',
      emptySearchDesc: 'Tente alterar os termos da busca ou limpar os filtros ativos.',
      addFirstPlant: 'Cadastrar Primeira Planta'
    },
    plantCard: {
      wateredToday: 'Regada Hoje',
      needsWaterToday: 'Precisa de Agua Hoje!',
      waterInDays: 'Regar em {days} dia(s)',
      overdueDays: 'Atrasada ({days}d)',
      fullSun: 'Sol Direto',
      shade: 'Sombra',
      indirectLight: 'Luz Indireta',
      locationLabel: 'Onde Fica:',
      cuttingsLabel: 'Muda:',
      waterBtn: 'Regar',
      wateredBtn: 'Regada'
    },
    addPlant: {
      title: 'Adicionar Nova Planta',
      knowNameTitle: 'Digitar Nome & Auto-completar',
      photoTitle: 'Identificacao por Foto',
      formTitle: 'Ficha Completa da Planta',
      askTitle: 'Voce ja conhece o nome da planta?',
      askSubtitle: 'Escolha uma das opcoes abaixo para a Inteligencia Artificial gerar a ficha botanica completa e o guia de mudas:',
      optionKnowsNameTitle: 'Sim, ja sei o nome da planta',
      optionKnowsNameDesc: 'Digite o nome (ex: Jiboia, Monstera) para a IA dar auto-complete de todos os cuidados',
      optionPhotoTitle: 'Nao sei o nome da planta',
      optionPhotoDesc: 'Tire ou envie uma foto para a IA identificar a especie e preencher a ficha',
      revealTitle: 'Esta e a sua',
      revealSubtitle: 'Especie identificada com sucesso pela Inteligencia Artificial!',
      revealBtn: 'Confirmar & Ver Ficha Botanica'
    },
    plantDetail: {
      editTitle: 'Editar Ficha Botanica',
      editBtn: 'Editar',
      saveBtn: 'Salvar Alteracoes',
      cancelBtn: 'Cancelar',
      removeBtn: 'Remover',
      waterTodayBtn: 'Marcar como Regada Hoje',
      changePhotoBtn: 'Alterar / Tirar Foto',
      originSection: 'Identificacao & Origem',
      sunSection: 'Iluminacao & Quantidade de Luz',
      waterSection: 'Rega & Quantidade de Agua',
      propagationSection: 'Como Tirar Mudas (Propagacao & Cultivo)',
      soilSection: 'Solo & Temperatura',
      careSection: 'Como Cuidar & Manutencao',
      fertilizerSection: 'Adubacao & Observacoes'
    },
    trashBin: {
      title: 'Lixeira do Jardim',
      itemsCount: '{count} planta(s) removida(s)',
      emptyTitle: 'Sua lixeira esta vazia',
      emptyDesc: 'Plantas excluidas aparecerao aqui antes de serem removidas permanentemente.',
      restoreBtn: 'Restaurar',
      deleteBtn: 'Excluir',
      emptyTrashBtn: 'Esvaziar Lixeira',
      confirmTitle: 'Confirmar exclusao definitiva?',
      confirmYes: 'Sim, Esvaziar',
      closeBtn: 'Fechar'
    },
    apiKey: {
      title: 'Conectar IA Gemini do Google',
      desc: 'Insira sua chave de API gratuita do Google AI Studio para atuar com 100% de precisao na identificacao por foto.',
      placeholder: 'Cole sua API key aqui (ex: AIzaSy...)',
      saveBtn: 'Salvar Chave'
    },
    settings: {
      title: 'Configuracoes do Canto Alegre',
      languageTitle: 'Idioma da Interface',
      backupTitle: 'Backup & Restauracao',
      exportBackup: 'Exportar Backup do Jardim',
      importBackup: 'Importar Backup'
    },
    analytics: {
      title: 'Estatisticas de Uso & Telemetria',
      pageViews: 'Visualizacoes de Pagina',
      topClicks: 'Recursos mais Utilizados'
    }
  },
  'en': {
    nav: {
      brandTag: 'Botanical AI & Cuttings',
      presentation: 'About',
      myGarden: 'My Garden',
      installApp: 'Install App',
      openApp: 'Launch App',
      settings: 'Settings',
      feedback: 'Feedback & Support',
      lixeira: 'Trash Bin',
      novidades: 'Updates',
      guia: 'Guide & PWA'
    },
    hero: {
      badge: 'Multimodal Google Gemini AI + 100% Offline PWA',
      title: 'Canto Alegre',
      subtitle: 'Nurture life, plant by plant.',
      description: 'Your smart botanical assistant in your pocket: snap a photo of any leaf or pot to identify the species, discover ideal watering and sunlight, and learn step-by-step cutting propagation.',
      useAppCta: 'Acquire & Use Now',
      downloadPwa: 'Download as App (PWA)',
      viewGithub: 'View on GitHub'
    },
    purpose: {
      title: 'Purpose of Canto Alegre',
      description: 'Born from hands-on volunteering experiences through Worldpackers on eco-farms and eco-lodges, Canto Alegre combines practical soil wisdom with cutting-edge AI to make gardening accessible to everyone, anywhere.',
      card1Title: 'Photo Identification',
      card1Desc: 'Point your camera at any plant. AI analyzes leaves, veins, and flowers to recognize botanical name, family, and origin.',
      card2Title: 'Complete Propagation Guide',
      card2Desc: 'Learn to multiply your collection with step-by-step cutting, division, and rooting instructions, including best seasons.',
      card3Title: 'Thirst Alert & Watering Logs',
      card3Desc: 'Track your watering schedule. See at a glance which plants need water today and log care with a single tap.',
      card4Title: 'Sunlight & Climate Care',
      card4Desc: 'Discover whether species prefer full sun, filtered light, or shade, along with recommended temperature and humidity.',
      card5Title: '100% Offline (PWA)',
      card5Desc: 'Works seamlessly without internet in remote areas or gardens. Your data and photos stay securely in your browser via IndexedDB.',
      card6Title: 'Free & Immediate',
      card6Desc: 'Use directly in your browser with simulation mode or connect your free Google AI Studio API key without subscriptions.'
    },
    install: {
      title: 'How to Install on Your Device (PWA)',
      subtitle: 'Canto Alegre is a Progressive Web App that consumes minimal storage and works offline on both Android and iOS.',
      androidTitle: 'Android Installation (Chrome / Edge / Samsung)',
      androidStep1: '1. Open the website in your mobile browser.',
      androidStep2: '2. Tap the "Install App" button in top bar or browser menu (three dots in top right).',
      androidStep3: '3. Select "Install app" or "Add to Home screen".',
      iosTitle: 'iPhone / iPad Installation (Safari)',
      iosStep1: '1. Open the website in the Safari browser.',
      iosStep2: '2. Tap the Share button (square with up arrow on bottom bar).',
      iosStep3: '3. Scroll down and select "Add to Home Screen".'
    },
    feedback: {
      title: 'Feedback & Support',
      subtitle: 'Your opinion is essential for improving Canto Alegre. Send suggestions, questions, or bug reports.',
      btnOpen: 'Send Feedback or Get Support',
      modalTitle: 'Feedback & Support Center',
      typeLabel: 'Message Type',
      typeSuggestion: 'Feature Suggestion',
      typeIssue: 'Bug / Issue Report',
      typeQuestion: 'Question about Plant Care / App',
      messagePlaceholder: 'Write your detailed message here...',
      emailPlaceholder: 'Your email for reply (optional)',
      btnSubmit: 'Send Message',
      btnClose: 'Close',
      successMessage: 'Thank you for your feedback! Your message has been successfully recorded.'
    },
    credits: {
      title: 'Credits & Acknowledgments',
      builtBy: 'Developed with dedication by ruan rickelme (naur-Io).',
      inspiration: 'Inspired by environmental volunteering and gardening experiences via Worldpackers.',
      techStack: 'Built with React 18, Vite, Spring Boot 3, PostgreSQL, and Google Gemini AI API.',
      license: 'Open-Source MIT License.'
    },
    garden: {
      searchPlaceholder: 'Search by name, origin, soil, or care...',
      filterAll: 'All',
      filterNeedsWater: 'Needs Water',
      filterDirectSun: 'Full Sun',
      filterIndirectLight: 'Indirect Light',
      filterShade: 'Shade',
      emptyTitle: 'Your Garden is Empty',
      emptySearchTitle: 'No plants found',
      emptyDesc: 'Start your smart botanical collection by registering your first plant.',
      emptySearchDesc: 'Try changing your search terms or clearing active filters.',
      addFirstPlant: 'Add First Plant'
    },
    plantCard: {
      wateredToday: 'Watered Today',
      needsWaterToday: 'Needs Water Today!',
      waterInDays: 'Water in {days} day(s)',
      overdueDays: 'Overdue ({days}d)',
      fullSun: 'Full Sun',
      shade: 'Shade',
      indirectLight: 'Indirect Light',
      locationLabel: 'Location:',
      cuttingsLabel: 'Cuttings:',
      waterBtn: 'Water',
      wateredBtn: 'Watered'
    },
    addPlant: {
      title: 'Add New Plant',
      knowNameTitle: 'Type Name & Auto-complete',
      photoTitle: 'Photo Identification',
      formTitle: 'Complete Botanical Form',
      askTitle: 'Do you already know the plant\'s name?',
      askSubtitle: 'Choose an option below for Artificial Intelligence to generate the complete botanical sheet and cutting guide:',
      optionKnowsNameTitle: 'Yes, I know the plant\'s name',
      optionKnowsNameDesc: 'Type the name (e.g. Pothos, Monstera) for AI to auto-complete all care details',
      optionPhotoTitle: 'I don\'t know the plant\'s name',
      optionPhotoDesc: 'Take or upload a photo for AI to identify the species and fill out the sheet',
      revealTitle: 'This is your',
      revealSubtitle: 'Species successfully identified by Artificial Intelligence!',
      revealBtn: 'Confirm & View Botanical Sheet'
    },
    plantDetail: {
      editTitle: 'Edit Botanical Sheet',
      editBtn: 'Edit',
      saveBtn: 'Save Changes',
      cancelBtn: 'Cancel',
      removeBtn: 'Remove',
      waterTodayBtn: 'Mark Watered Today',
      changePhotoBtn: 'Change / Take Photo',
      originSection: 'Identification & Origin',
      sunSection: 'Sunlight & Lighting',
      waterSection: 'Watering Schedule',
      propagationSection: 'How to Take Cuttings (Propagation)',
      soilSection: 'Soil & Climate',
      careSection: 'Maintenance & Pruning',
      fertilizerSection: 'Fertilizer & Notes'
    },
    trashBin: {
      title: 'Garden Trash Bin',
      itemsCount: '{count} removed item(s)',
      emptyTitle: 'Your trash bin is empty',
      emptyDesc: 'Deleted plants will appear here before being permanently removed.',
      restoreBtn: 'Restore',
      deleteBtn: 'Delete',
      emptyTrashBtn: 'Empty Trash Bin',
      confirmTitle: 'Confirm permanent deletion?',
      confirmYes: 'Yes, Empty All',
      closeBtn: 'Close'
    },
    apiKey: {
      title: 'Connect Google Gemini AI',
      desc: 'Enter your free Google AI Studio API key for 100% precision in photo identification.',
      placeholder: 'Paste your API key here (e.g. AIzaSy...)',
      saveBtn: 'Save Key'
    },
    settings: {
      title: 'Canto Alegre Settings',
      languageTitle: 'Interface Language',
      backupTitle: 'Backup & Restore',
      exportBackup: 'Export Garden Backup',
      importBackup: 'Import Backup'
    },
    analytics: {
      title: 'Usage & Analytics Stats',
      pageViews: 'Page Views',
      topClicks: 'Top Used Features'
    }
  }
};

export async function getStoredLanguage() {
  try {
    const lang = await get(LANGUAGE_KEY);
    if (lang && TRANSLATIONS[lang]) return lang;
  } catch (err) {}
  const local = localStorage.getItem(LANGUAGE_KEY);
  if (local && TRANSLATIONS[local]) return local;
  return 'pt-BR';
}

export async function saveLanguage(lang) {
  const selected = lang === 'en' ? 'en' : 'pt-BR';
  try {
    await set(LANGUAGE_KEY, selected);
  } catch (err) {}
  localStorage.setItem(LANGUAGE_KEY, selected);
  return selected;
}

export function translateEnvironment(text, currentLang = 'pt-BR') {
  if (!text) return '';
  if (currentLang !== 'en') return text;

  const exactMap = {
    'Dentro de casa (Sala, Quarto ou Escritório)': 'Indoor (Living Room, Bedroom or Office)',
    'Dentro de casa (Banheiro, Varanda protegida ou Cozinha)': 'Indoor (Bathroom, Protected Balcony or Kitchen)',
    'Dentro de casa (Banheiro ou Cômodo de Sombra)': 'Indoor (Bathroom or Shaded Room)',
    'Dentro de casa': 'Indoor',
    'Fora de casa (Quintal, Horta ou Sacada de Sol)': 'Outdoor (Yard, Garden or Sun Balcony)',
    'Fora de casa (Quintal ou Sacada Ensolarada)': 'Outdoor (Full Sun Yard or Balcony)',
    'Fora de casa': 'Outdoor',
    'Dentro/Fora de casa': 'Indoor/Outdoor'
  };

  if (exactMap[text]) return exactMap[text];

  let result = text;
  result = result.replace(/Dentro de casa/gi, 'Indoor');
  result = result.replace(/Fora de casa/gi, 'Outdoor');
  result = result.replace(/Sala, Quarto ou Escritório/gi, 'Living Room, Bedroom or Office');
  result = result.replace(/Quintal ou Sacada Ensolarada/gi, 'Full Sun Yard or Balcony');
  result = result.replace(/Banheiro ou Cômodo de Sombra/gi, 'Bathroom or Shaded Room');
  result = result.replace(/Banheiro, Varanda protegida ou Cozinha/gi, 'Bathroom, Protected Balcony or Kitchen');
  result = result.replace(/Quintal, Horta ou Sacada de Sol/gi, 'Yard, Garden or Sun Balcony');
  return result;
}

export function translateSoil(text, currentLang = 'pt-BR') {
  if (!text) return '';
  if (currentLang !== 'en') return text;
  const exactMap = {
    'Solo rico em matéria orgânica, leve e com boa drenagem': 'Soil rich in organic matter, light and well-draining',
    'Substrato leve, rico em matéria orgânica com boa drenagem.': 'Light substrate, rich in organic matter with good drainage.',
    'Substrato arenoso e muito bem drenado (cactos e suculentas)': 'Sandy and well-drained substrate (cacti and succulents)',
    'Substrato para orquídeas (casca de pínus e carvão)': 'Orchid substrate (pine bark and charcoal)'
  };
  return exactMap[text] || text;
}

export function translateTemperature(text, currentLang = 'pt-BR') {
  if (!text) return '';
  if (currentLang !== 'en') return text;
  const exactMap = {
    '18°C a 27°C (clima ameno a quente)': '18°C to 27°C (mild to warm climate)',
    '18°C a 28°C (proteger de geadas e frio excessivo)': '18°C to 28°C (protect from frost and severe cold)',
    '15°C a 30°C (resistente ao calor)': '15°C to 30°C (heat resistant)'
  };
  return exactMap[text] || text;
}

export function translateMethod(text, currentLang = 'pt-BR') {
  if (!text) return '';
  if (currentLang !== 'en') return text;
  const exactMap = {
    'Estaquia de caule na água ou solo': 'Stem cuttings in water or soil',
    'Estaquia de caule / folha': 'Stem / leaf cuttings',
    'Estaquia de caule': 'Stem cuttings',
    'Estaquia de folha': 'Leaf cuttings',
    'Divisão de touceira': 'Clump division',
    'Divisão de touceira / separação de mudas com raiz': 'Clump division / root separation',
    'Brotos laterais / mudas': 'Side shoots / offsets'
  };
  return exactMap[text] || text;
}

export function translateDifficulty(text, currentLang = 'pt-BR') {
  if (!text) return '';
  if (currentLang !== 'en') return text;
  if (/fácil/i.test(text)) return 'Easy';
  if (/médio/i.test(text)) return 'Medium';
  if (/difícil/i.test(text)) return 'Hard';
  return text;
}

export function translateBestSeason(text, currentLang = 'pt-BR') {
  if (!text) return '';
  if (currentLang !== 'en') return text;
  if (/Primavera/i.test(text) && /Verão/i.test(text)) return 'Spring & Summer';
  if (/Outono/i.test(text) && /Inverno/i.test(text)) return 'Autumn & Winter';
  if (/Ano todo/i.test(text)) return 'All year round';
  return text;
}

export function translateRootingTime(text, currentLang = 'pt-BR') {
  if (!text) return '';
  if (currentLang !== 'en') return text;
  let res = text.replace(/semanas/gi, 'weeks').replace(/dias/gi, 'days').replace(/a/g, 'to');
  return res;
}
