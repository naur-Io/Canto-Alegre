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
      feedback: 'Feedback & Suporte'
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
      feedback: 'Feedback & Support'
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
