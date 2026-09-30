export const APP_UPDATES = [
  {
    id: 'v1.7.0',
    version: 'v1.7.0',
    date: '30 de Setembro de 2026',
    title: 'Canto Alegre - Métricas, Telemetria & Preparação para Lançamento Público',
    isMajor: true,
    badges: ['Telemetria', 'Analytics', 'Social Meta Tags', 'Vercel / Netlify'],
    summary: 'Novo módulo de telemetria e analytics de uso, painel de estatísticas dos recursos mais clicados, meta tags Open Graph e Twitter Cards para redes sociais e guia de hospedagem do frontend.',
    items: [
      {
        type: 'analytics',
        title: 'Painel de Métricas & Telemetria',
        desc: 'Acompanhe em tempo real o total de acessos do app e o ranking dos botões mais clicados (hotspots) com total privacidade offline.'
      },
      {
        type: 'social',
        title: 'Meta Tags de Compartilhamento Social',
        desc: 'Suporte a Open Graph e Twitter Cards para exibição de cards visuais com capa e resumo ao compartilhar o link do aplicativo no WhatsApp ou redes sociais.'
      },
      {
        type: 'guide',
        title: 'Guia de Lançamento & Hospedagem Web',
        desc: 'Documentação completa com o passo a passo para deploy do frontend PWA na Vercel e Netlify conectando com a API em nuvem.'
      }
    ]
  },
  {
    id: 'v1.6.0',
    version: 'v1.6.0',
    date: '27 de Setembro de 2026',
    title: 'Canto Alegre - Deploy em Nuvem (AWS RDS + Render) & Interface Slim',
    isMajor: true,
    badges: ['Nuvem AWS', 'Render API', 'UI Slim', 'Botão FAB +'],
    summary: 'Infraestrutura no ar 24/7 com banco AWS RDS PostgreSQL e API no Render, além do painel principal compacto para liberar mais espaço vertical e botão flutuante (+) ampliado para melhor toque.',
    items: [
      {
        type: 'cloud',
        title: 'Backend em Nuvem (Render + AWS RDS)',
        desc: 'API REST online e sincronizada com banco relacional AWS RDS PostgreSQL e armazenamento de fotos em bucket AWS S3.'
      },
      {
        type: 'ui',
        title: 'Painel do Jardim Compacto (Slim UI)',
        desc: 'Header do jardim enxuto com contadores numéricos, liberando mais de 60% do espaço da tela para visualização dos cartões de plantas.'
      },
      {
        type: 'fab',
        title: 'Botão Flutuante (+) Ampliado',
        desc: 'Novo tamanho do botão verde de adição rápida no canto inferior direito para acesso instantâneo em qualquer tela.'
      }
    ]
  },
  {
    id: 'v1.5.1',
    version: 'v1.5.1',
    date: '27 de Setembro de 2026',
    title: 'Canto Alegre - Campo "Ambiente Ideal / Onde Fica a Planta"',
    isMajor: false,
    badges: ['Novo', 'Ambiente Ideal', 'IA Gemini', 'Backend API'],
    summary: 'Adicionado campo de ambiente ideal em toda a aplicação (frontend, IA Gemini auto-complete e banco de dados PostgreSQL backend), permitindo especificar se a planta fica dentro de casa, quintal, sacada ou banheiro.',
    items: [
      {
        type: 'environment',
        title: 'Ambiente Ideal da Planta',
        desc: 'Identifique facilmente onde posicionar cada espécie (sala, quarto, terraço, banheiro ou quintal).'
      },
      {
        type: 'ai',
        title: 'Sugestão Automática por IA',
        desc: 'A IA Gemini sugere e preenche o ambiente ideal automaticamente ao cadastrar ou pesquisar uma muda.'
      },
      {
        type: 'search',
        title: 'Filtro & Busca por Cômodo/Ambiente',
        desc: 'Pesquise diretamente por "quarto", "sala" ou "varanda" no campo de busca do jardim.'
      }
    ]
  },
  {
    id: 'v1.5.0',
    version: 'v1.5.0',
    date: '27 de Setembro de 2026',
    title: 'Canto Alegre - Novo Fluxo de Adição de Plantas, Tour Spotlight & Tema Botânico Único',
    isMajor: true,
    badges: ['Novo', 'IA Auto-Complete', 'Spotlight Tour', 'Design System'],
    summary: 'Novo fluxo inteligente de adição de plantas com pergunta "Você já conhece o nome da planta?", auto-complete de ficha completa com IA Gemini, tour com destaque spotlight nos botões e tema botânico único claro de alto contraste.',
    items: [
      {
        type: 'flow',
        title: 'Novo Fluxo de Adição com Pergunta Inicial',
        desc: 'Pergunta interativa se você já conhece o nome da planta. Se sim, a IA dá auto-complete instantâneo em todos os cuidados e guia de mudas; se não, permite foto para identificação.'
      },
      {
        type: 'tour',
        title: 'Tour Guiado com Spotlight Highlight',
        desc: 'Passo a passo interativo que destaca visualmente com efeito spotlight cada botão e seção principal do aplicativo.'
      },
      {
        type: 'theme',
        title: 'Tema Botânico Único Claro',
        desc: 'Interface unificada em tema claro botânico (pistache/sálvia) de alto contraste e legibilidade perfeita sem distrações.'
      }
    ]
  },
  {
    id: 'v1.4.0',
    version: 'v1.4.0',
    date: '26 de Setembro de 2026',
    title: 'Canto Alegre - Tour Guiado no Jardim, Botão Flutuante (+) & Tema Escuro Reformulado',
    isMajor: true,
    badges: ['Novo', 'Tour Onboarding', 'Botão FAB +', 'UI/UX'],
    summary: 'Novo guia interativo passo a passo ao entrar no jardim, botão flutuante (+) no canto inferior direito para adicionar plantas, modal de suporte 100% opaco e tema escuro totalmente reformulado com alto contraste.',
    items: [
      {
        type: 'tour',
        title: 'Tour Guiado Interativo no Jardim',
        desc: 'Novo guia passo a passo em popovers para apresentar os recursos do painel, filtros de sol/água, botão + e IA Gemini.'
      },
      {
        type: 'fab',
        title: 'Botão Flutuante FAB (+)',
        desc: 'Botão fixo verde no canto inferior direito da tela para cadastrar novas plantas rapidamente de qualquer dispositivo.'
      },
      {
        type: 'support',
        title: 'Modal de Suporte Opaco',
        desc: 'Eliminadas transparências no modal de feedbacks e suporte com fundos sólidos e inputs de alta legibilidade.'
      },
      {
        type: 'theme',
        title: 'Tema Escuro Botânico de Alto Contraste',
        desc: 'Novo tema escuro com verde botânico profundo, superfícies sólidas e textos brancos cristalinos para leitura agradável sem cansaço visual.'
      }
    ]
  },
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
