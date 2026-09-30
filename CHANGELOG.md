# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- User Authentication & Cloud Sync: Multi-user account support to sync gardens across multiple devices.
- Worldpackers Volunteer Portfolio: Dedicated logbook to record plants cultivated during volunteering stays across eco-lodges and farms.
- Gardener Profiles & Skill Levels: Experience progression tailored for beginners up to advanced permaculture practitioners.
- Push Notifications & Care Reminders: Browser-based notifications for watering and fertilizing schedules.
- Growth Journal & History Log: Timeline tracking plant growth with historic photo check-ins.

## [1.7.0] - 2026-09-30

### Added & Changed
- **Painel de Métricas & Telemetria (`analyticsService.js` & `AnalyticsStatsModal.jsx`)**:
  - Novo serviço de telemetria offline-first para contagem de acessos globais e ranking dos botões mais clicados (hotspots: Nova Planta, Identificação IA, Troca de Tema, Instalar PWA).
  - Modal visual discreto de estatísticas acessível diretamente pela barra de navegação ("Métricas").
- **Meta Tags de Compartilhamento Social (Open Graph & Twitter Cards)**:
  - Adicionadas tags `og:title`, `og:description`, `og:image`, `og:type` e `twitter:card` em `index.html` para exibição de pré-cards ao compartilhar o link do aplicativo no WhatsApp, Instagram e Telegram.
- **Guia de Deploy & Lançamento na Pasta de Estudos (`studies/05-GUIA_DE_LANCAMENTO_E_TELEMETRIA.md`)**:
  - Manual exaustivo detalhando o deploy do frontend PWA na Vercel e Netlify, configuração de variáveis de ambiente (`VITE_API_URL`) e integração GA4.

## [1.6.0] - 2026-09-27

### Added & Changed
- **Deploy Nuvem AWS RDS & Render.com**:
  - API REST Spring Boot 3 no ar 24/7 hospedada no Render (`https://canto-alegre.onrender.com/api/v1`).
  - Banco de Dados PostgreSQL 16.9 gerenciado no AWS RDS (`canto-alegre-db.czisisu4ueck.sa-east-1.rds.amazonaws.com`).
  - Armazenamento de fotos no bucket AWS S3 (`canto-alegre-fotos-prod`) e suporte a CORS global (`SecurityConfig.java`).
- **Redesign Compacto do Painel "Meu Jardim Inteligente"**:
  - Redução da altura e padding do painel hero da home (`.hero-header-compact`), eliminando blocos de texto redundantes e aumentando a área útil visível para a galeria de plantas em mais de 60%.
- **Ampliação Ergonomica do Botão Flutuante (+)**:
  - Botão FAB verde no canto inferior direito expandido para 68px de diâmetro com ícone ampliado de 32px (`<Plus size={32} />`), facilitando o toque em smartphones e computadores.
- **Guia Completo de Nuvem na Pasta de Estudos**:
  - Atualização do `studies/04-GUIA_PASSO_A_PASSO_AWS_CLOUD.md` e `studies/03-RASTREABILIDADE_E_ETAPA2_STORAGE.md` detalhando cada serviço AWS (RDS, S3, IAM), variáveis de ambiente e dockerization.

## [1.5.1] - 2026-09-27

### Added & Updated
- **Ambiente Ideal / Onde Fica a Planta**:
  - Novo campo de especificação do ambiente ideal (ex: *"Dentro de casa (Sala, Quarto ou Escritório)"*, *"Fora de casa / Quintal"*, *"Terraço / Sacada"*, *"Banheiro / Área Úmida"*).
  - Classificação e preenchimento automático via IA Gemini ao cadastrar ou auto-completar a planta.
  - Exibição de badge com ícone de casa no cartão da planta (`PlantCard.jsx`), modal de detalhes (`PlantDetailModal.jsx`) e modal de adição (`AddPlantModal.jsx`).
  - Suporte à busca dinâmica por ambiente no campo de pesquisa da página inicial.
  - Migração de banco de dados PostgreSQL `V2__add_ideal_environment.sql` e suporte REST na API backend Java.

## [1.5.0] - 2026-09-27

### Added & Changed
- **Novo Fluxo de Adição de Plantas (Pergunta Inicial & Auto-complete)**:
  - Pergunta interativa inicial: *"Você já conhece o nome da planta?"*
  - Opção **Sim**: Digitação do nome popular com recurso de **Auto-completar com IA Gemini**, preenchendo automaticamente a ficha técnica completa e o guia de mudas.
  - Opção **Não**: Envio/captura de foto para identificação botânica e preenchimento da ficha.
- **Tour Guiado com Spotlight Highlight**:
  - Atualização do `GardenTourWalkthrough.jsx` com destaque visual (*spotlight ring*) ao redor dos botões e áreas da interface em cada etapa do tutorial.
- **Tema Botânico Único**:
  - Consolidação do aplicativo em um único tema claro botânico (pistache/sálvia) de alto contraste e excelente legibilidade, removendo a alternância de tema e simplificando a interface.

---

## [1.4.0] - 2026-09-26

### Added & Fixed
- **Guia Interativo Onboarding (Tour no Jardim)**:
  - Novo componente `GardenTourWalkthrough.jsx` com tour guiado em popovers (5 passos) para orientar o usuário ao acessar o painel "Meu Jardim".
- **Botão Flutuante FAB (+)**:
  - Botão flutuante fixo no canto inferior direito (`.fab-add-plant`) para adição rápida de novas plantas em qualquer dispositivo.
- **Suporte Opaco & Tema Escuro Reformulado**:
  - Reformulação completa do modal de suporte (`FeedbackSupportModal.jsx`) eliminando transparências indesejadas e garantindo legibilidade nítida.
  - Reestruturação do Tema Escuro (`[data-theme="dark"]`) com verde botânico profundo opaco e textos brancos de alto contraste (`#ffffff`).

---

## [1.3.1] - 2026-09-25

### Added & Fixed
- **Melhoria de Contraste e Paleta Botânica Pastéis**:
  - Ajustados os contrastes de todos os elementos da barra de navegação (`Canto Alegre`, `IA Botânica & Mudas`, `PT-BR`, `Meu Jardim`, `Feedback & Suporte`, `Novidades`, `Guia & PWA`, `Instalar App`, `Modo Simulado`), tornando os textos nítidos e altamente legíveis.
  - Implementada nova paleta botânica com tons pastéis para o Tema Claro (pistache e sálvia suave) e Tema Escuro (gradiente sálvia profundo).
  - Regra de legibilidade de texto: no **Tema Escuro**, o texto do corpo fica **branco** (`#ffffff`), e no **Tema Claro**, o texto do corpo fica **preto** (`#111827`), mantendo a hierarquia e destaque dos títulos botânicos.
  - Alinhamento visual e suporte de contraste dinâmico nas seções da Landing Page (`PresentationLanding.jsx`), modal de guia PWA (`IntroGuideModal.jsx`) e página estática `public/about.html`.

---

## [1.3.0] - 2026-09-25

### Added
- Tela de Apresentacao do Produto (Landing Page) & Suporte Bilingue:
  - Nova Tela de Apresentacao do Produto integrada com o proposito do aplicativo, botao de acao "Adquirir e Usar Agora" / "Abrir o Aplicativo" e secao de creditos no rodape.
  - Guia ilustrado de instalacao PWA passo a passo para dispositivos Android (Chrome / Edge / Samsung) e iOS (Safari Compartilhar -> Adicionar a Tela de Inicio).
  - Suporte Bilingue completo (Português PT-BR e Inglês EN) com alternador dinamico de idiomas na barra de navegacao (`Navbar.jsx`).
  - Central de Feedbacks & Suporte com modal interativo (`FeedbackSupportModal.jsx`) para envio de sugestoes, relatorio de bugs e duvidas.
  - Componente `PresentationLanding.jsx` responsivo com suporte a temas visuais Claro e Escuro.

---

## [1.2.0] - 2026-09-25

### Added
- Canto Alegre REST API Backend (Spring Boot 3 + Java 21):
  - Camada de excecoes globais `@RestControllerAdvice` formatada conforme RFC 7807 (`ProblemDetail`).
  - DTOs imutaveis em Java Records com validacoes declarativas Jakarta Bean Validation.
  - Multi-tenancy anonomo baseado no modelo Guest UUID via cabeçalho HTTP `X-Guest-Id`.
  - Servico `PlantService` com integridade transacional ACID, mitigacao N+1 via `JOIN FETCH` e calculo automatico de proximas regas.
  - Servico `GeminiService` e `BotanicalSpeciesService.getOrCreateSpeciesByName` para enriquecimento automatico via Gemini e persistencia de cache canonico em PostgreSQL.
  - Endpoints REST para `/api/v1/plants`, `/api/v1/plants/{id}/water`, `/api/v1/plants/thirsty` e catalogo canonico `/api/v1/species` (incluindo `/by-name`).
  - Suites de testes unitarios com JUnit 5 e Mockito para validacao completa da camada de servicos (`UserServiceTest`, `BotanicalSpeciesServiceTest`, `PlantServiceTest` e `GeminiServiceTest`).
  - Suite de testes de integracao ponta a ponta com **Testcontainers** (`BotanicalSpeciesControllerIntegrationTest` e `PlantControllerIntegrationTest`) subindo container PostgreSQL `16-alpine` real.



- Integracao Resiliente de Sincronizacao Frontend PWA (Fase 1 Concluida):
  - Modulo `apiService.js` com geracao e gerencimento de UUID local no IndexedDB.
  - Modulo `syncService.js` com fila offline de operacoes pendentes (`cantoalegre_pending_sync_queue`) e reconciliacao automatica com a API ao reconectar.
  - Atualizacao de `storageService.js` para persistencia simultanea no IndexedDB local e sincronizacao cloud transparente com Spring Boot.


---

## [1.1.0] - 2026-09-21

### Added
- Canto Alegre Rebranding:
  - Renamed application to Canto Alegre, representing botanical care, nature, and practical gardening.
  - Updated `package.json`, `index.html`, `manifest.json`, `Navbar`, modals, and storage services with seamless backward-compatible data migration.
- Visual Theme Switching:
  - Added Settings Modal (`SettingsModal.jsx`) and quick Navbar button allowing instant toggle between Dark Mode and Light Mode.
  - Initial demonstration collection streamlined to start with a single plant (Jiboia).
- Progressive Web App (PWA) & Offline Mode:
  - Native Service Worker (`sw.js`) with smart caching (Cache-First for assets, Network-First for navigation, and offline fallback for Gemini API).
  - High-resolution icons generated from vector SVG: `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, and `favicon-64.png`.
  - Native `beforeinstallprompt` event handler enabling 1-click installation from Navbar, Intro Modal, and About page.
  - 100% offline data resilience powered by IndexedDB (`idb-keyval`).
- Interactive Welcome & Onboarding Guide (`IntroGuideModal.jsx`):
  - Step-by-step onboarding for first-time users explaining Photo AI Identification, Cutting & Propagation, Watering alerts, and Offline capabilities.
  - Immediate Configurations: In-guide Google AI Studio API key validator or 1-click simulation mode selection.
  - Re-accessible at any time directly from the Navbar.
- In-App Updates & Notifications Center (`UpdatesNotificationModal.jsx`):
  - Navbar bell icon with dynamic unread badge indicating new feature releases.
  - Interactive release timeline and changelog accessible directly inside the app.
  - Service Worker update detection banner with 1-click app reload.
- Presentation Landing Page (`about.html`):
  - Standalone, ultra-fast botanical landing page with feature cards, direct app launch, and PWA download actions.
- Open-Source Contribution Guide:
  - Created `CONTRIBUTING.md` with step-by-step Fork & Pull Request instructions, project directory breakdown, and development guidelines.
  - Created `.gitignore` to prevent committing build artifacts and dependencies.
- Responsive Mobile Header & Action Bar:
  - Redesigned top navigation into a two-tier responsive layout on screens <= 768px.
  - Row 1 displays Brand, Quick Theme Toggle, Settings, and Primary "+ Nova Planta" CTA.
  - Row 2 provides a fluid action bar for Updates/Notifications, Guide & PWA, Install, and Gemini AI status.
  - Zero horizontal overflow on any smartphone display (tested down to 320px).

---

## [1.0.0] - 2026-08-13

### Added
- AI-Powered Plant Identification:
  - Multimodal plant recognition using Google Gemini 1.5 Flash Vision.
  - Automated extraction of common names, botanical/scientific names, watering volume (ml), sunlight exposure, fertilization suggestions (NPK, humus, bokashi), and health diagnostics.
  - Realistic botanical fallback simulation when API keys are not provided.
  - Real-time status indicators in Navbar and modals distinguishing between Live Gemini AI and Botanical Simulation Mode.
- Camera & Image Capture:
  - Live in-app camera capture with front/back camera toggle support.
  - File upload picker for existing gallery photos.
  - Dynamic image preview with re-take and replace capabilities.
- Garden Management Dashboard ("My Garden"):
  - Visual plant cards with hydrometer status indicators.
  - "Needs Water Today" dynamic alerting system based on watering intervals and timestamps.
  - 1-click watering action with animated confetti celebrations via `canvas-confetti`.
  - Delete and inspect plant details directly from the dashboard.
- Manual Registration & Full Editing:
  - Complete form override allowing users to adjust or fully register plant data without AI.
  - Editable fields for common name, scientific name, watering schedule, sunlight requirements, and notes.
- Local Storage & Privacy:
  - High-capacity photo and metadata storage using browser IndexedDB (`idb-keyval`).
  - Secure local storage of Gemini API keys directly in the client browser.
- Botanical Design System:
  - Custom responsive UI built with vanilla CSS tokens.
  - Modern iconography provided by `lucide-react`.
  - Accessible modal dialogs and smooth micro-interactions.
- PWA & Deployment Configurations:
  - Web App Manifest (`manifest.json`) for progressive web app compatibility.
  - Production deployment configs for Netlify (`_redirects`) and Vercel (`vercel.json`).
