export const APP_UPDATES = [
  {
    id: 'v1.1.0',
    version: 'v1.1.0',
    date: '21 de Setembro de 2026',
    title: 'Canto Alegre 🌿 + PWA Offline, Guia de Mudas e Apresentação',
    isMajor: true,
    badges: ['Novo', 'PWA Offline', 'Mudas & Propagação'],
    summary: 'Grande atualização com nova identidade Canto Alegre, suporte PWA instalável 100% offline, guia botânico de mudas e central de novidades.',
    items: [
      {
        icon: '🏷️',
        title: 'Nova Identidade: Canto Alegre',
        desc: 'Evoluímos o aplicativo para a marca Canto Alegre, refletindo o amor pelo cultivo, horta e natureza.'
      },
      {
        icon: '📱',
        title: 'PWA Instalável & Cache 100% Offline',
        desc: 'Instale o app direto no seu Android, iPhone ou computador sem precisar de loja. Agora com Service Worker e banco de dados local que funcionam sem internet.'
      },
      {
        icon: '🌱',
        title: 'Guia Completo de Mudas & Estaquia',
        desc: 'Passo a passo botânico com método de estaquia, corte, enraizamento e melhor época do ano para multiplicar qualquer planta.'
      },
      {
        icon: '🧭',
        title: 'Guia de Boas-Vindas & Configurações Rápidas',
        desc: 'Novo tour explicativo de entrada para orientar novos usuários e permitir configurações imediatas da API Gemini ou modo simulação.'
      },
      {
        icon: '🔔',
        title: 'Central de Atualizações & Novidades',
        desc: 'Agora você recebe notificações dentro do app sempre que uma nova versão ou funcionalidade for lançada!'
      },
      {
        icon: '🌐',
        title: 'Página de Apresentação Web',
        desc: 'Nova landing page em /about.html com botão de download do PWA e resumo dos recursos para compartilhar com amigos.'
      }
    ]
  },
  {
    id: 'v1.0.1',
    version: 'v1.0.1',
    date: '17 de Agosto de 2026',
    title: 'Validação Dinâmica da API Gemini & Guia de Cultivo',
    isMajor: false,
    badges: ['Melhoria', 'IA'],
    summary: 'Ajustes no serviço de visão computacional da Google AI e refinamento dos prompts botânicos.',
    items: [
      {
        icon: '✨',
        title: 'Validação de Chave em Tempo Real',
        desc: 'Teste instantâneo de conexão com o modelo gemini-1.5-flash ao inserir sua chave do Google AI Studio.'
      },
      {
        icon: '🌿',
        title: 'Refinamento nos Diagnósticos',
        desc: 'Detecção aprimorada de pragas e deficiências minerais com recomendações de correção de solo.'
      }
    ]
  },
  {
    id: 'v1.0.0',
    version: 'v1.0.0',
    date: '13 de Agosto de 2026',
    title: 'Lançamento Inicial da Aplicação',
    isMajor: true,
    badges: ['Lançamento'],
    summary: 'Primeira versão do assistente botânico com identificação por foto, alertas de rega e diário no IndexedDB.',
    items: [
      {
        icon: '📸',
        title: 'Câmera Integrada & Upload',
        desc: 'Fotografe diretamente pelo navegador do celular ou escolha fotos da galeria.'
      },
      {
        icon: '💧',
        title: 'Controle de Rega com Confetes',
        desc: 'Registro diário das regas com indicador de sede e animações interativas.'
      },
      {
        icon: '💾',
        title: 'Armazenamento Local Seguro',
        desc: 'Todas as fotos e dados salvos no seu próprio navegador via IndexedDB com total privacidade.'
      }
    ]
  }
];

export const LATEST_VERSION = APP_UPDATES[0].id;
