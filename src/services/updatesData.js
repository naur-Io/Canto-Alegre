export const APP_UPDATES = [
  {
    id: 'v1.1.0',
    version: 'v1.1.0',
    date: '21 de Setembro de 2026',
    title: 'Canto Alegre - PWA Offline, Guia de Mudas e Temas',
    isMajor: true,
    badges: ['Novo', 'PWA Offline', 'Mudas & Propagação'],
    summary: 'Grande atualização com nova identidade Canto Alegre, suporte PWA instalável 100% offline, alternância entre temas escuro e claro, guia botânico de mudas e central de novidades.',
    items: [
      {
        type: 'brand',
        title: 'Nova Identidade: Canto Alegre',
        desc: 'Evoluímos o aplicativo para a marca Canto Alegre, refletindo o amor pelo cultivo, horta e natureza.'
      },
      {
        type: 'theme',
        title: 'Temas Claro e Escuro',
        desc: 'Sessão de configurações adicionada com opção para alternar livremente entre os modos visual claro e escuro.'
      },
      {
        type: 'pwa',
        title: 'PWA Instalável & Cache 100% Offline',
        desc: 'Instale o app direto no seu Android, iPhone ou computador sem precisar de loja. Agora com Service Worker e banco de dados local que funcionam sem internet.'
      },
      {
        type: 'propagation',
        title: 'Guia Completo de Mudas & Estaquia',
        desc: 'Passo a passo botânico com método de estaquia, corte, enraizamento e melhor época do ano para multiplicar qualquer planta.'
      },
      {
        type: 'guide',
        title: 'Guia de Boas-Vindas & Configurações Rápidas',
        desc: 'Novo tour explicativo de entrada para orientar novos usuários e permitir configurações imediatas da API Gemini ou modo simulação.'
      },
      {
        type: 'updates',
        title: 'Central de Atualizações & Notificações',
        desc: 'Notificações integradas dentro do app para acompanhar cada versão e melhoria lançada.'
      },
      {
        type: 'web',
        title: 'Página de Apresentação Web',
        desc: 'Nova landing page em /about.html com botão de download do PWA e resumo dos recursos para compartilhar.'
      },
      {
        type: 'responsive',
        title: 'Navbar Totalmente Responsiva no Mobile',
        desc: 'Organização adaptativa em duas camadas para todos os botões e recursos, eliminando qualquer estouro lateral em celulares.'
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
        type: 'ai',
        title: 'Validação de Chave em Tempo Real',
        desc: 'Teste instantâneo de conexão com o modelo gemini-1.5-flash ao inserir sua chave do Google AI Studio.'
      },
      {
        type: 'botany',
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
        type: 'camera',
        title: 'Câmera Integrada & Upload',
        desc: 'Fotografe diretamente pelo navegador do celular ou escolha fotos da galeria.'
      },
      {
        type: 'water',
        title: 'Controle de Rega',
        desc: 'Registro diário das regas com indicador de sede e histórico local.'
      },
      {
        type: 'storage',
        title: 'Armazenamento Local Seguro',
        desc: 'Todas as fotos e dados salvos no seu próprio navegador via IndexedDB com total privacidade.'
      }
    ]
  }
];

export const LATEST_VERSION = APP_UPDATES[0].id;
