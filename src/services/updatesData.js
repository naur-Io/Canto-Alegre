export const APP_UPDATES = [
  {
    id: 'v1.3.1',
    version: 'v1.3.1',
    date: '25 de Setembro de 2026',
    title: 'Canto Alegre - Temas Pastéis & Super Contraste de Leitura',
    isMajor: false,
    badges: ['Novo', 'Design System', 'Acessibilidade'],
    summary: 'Aprimoramento completo de contraste na barra de navegação, paleta botânica com tons pastéis para temas claro e escuro, e legibilidade de textos.',
    items: [
      {
        type: 'contrast',
        title: 'Super Contraste na Navbar',
        desc: 'Todos os botões e rótulos da barra superior agora possuem textos brilhantes e nítidos em qualquer modo visual.'
      },
      {
        type: 'pastel',
        title: 'Paleta Botânica Pastéis',
        desc: 'Novos fundos e cartões pastéis suaves em verde pistache/sálvia para o modo claro e sálvia profundo no modo escuro.'
      },
      {
        type: 'readability',
        title: 'Texto Adaptativo Inteligente',
        desc: 'Regra de leitura nítida: texto do corpo em branco puro no modo escuro e preto nítido no modo claro.'
      }
    ]
  },
  {
    id: 'v1.3.0',
    version: 'v1.3.0',
    date: '25 de Setembro de 2026',
    title: 'Canto Alegre - Tela de Apresentação & Suporte Bilíngue',
    isMajor: true,
    badges: ['Novo', 'Landing Page', 'i18n PT/EN', 'Feedbacks'],
    summary: 'Nova Tela de Apresentação do produto para compartilhamento, suporte a idiomas Português/Inglês, instruções PWA para Android e iOS e modal de feedbacks.',
    items: [
      {
        type: 'landing',
        title: 'Tela de Apresentação do Produto',
        desc: 'Porta de entrada do app perfeita para compartilhar links, apresentando o propósito, botão para usar o app e créditos.'
      },
      {
        type: 'i18n',
        title: 'Suporte Bilíngue (PT-BR & EN)',
        desc: 'Alternador de idiomas instantâneo na Navbar permitindo alternar a interface entre Português do Brasil e Inglês.'
      },
      {
        type: 'pwa',
        title: 'Guia de Instalação PWA Ilustrado',
        desc: 'Instruções passo a passo para instalar o aplicativo no Android (Chrome/Edge/Samsung) e iOS (Safari).'
      },
      {
        type: 'feedback',
        title: 'Central de Feedbacks & Suporte',
        desc: 'Modal interativo para envio de sugestões, bugs e dúvidas diretamente pela plataforma.'
      }
    ]
  },
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
