# Guia de Lancamento Publico, Telemetria & Deploy Frontend (Fase 4)

Este documento orienta a preparacao para divulgacao e distribuicao publica do **Canto Alegre**, cobrindo a hospedagem web do PWA, configuracao de meta tags de redes sociais (Open Graph) e o uso do modulo de telemetria e analytics de acessos/cliques.

---

## 1. Visao Geral da Fase de Distribuição

A arquitetura do Canto Alegre opera de forma distribuida:

```
[ Frontend React PWA (Vercel / Netlify) ]
                 │
                 ├── (1) HTTPS REST API Call ──► Render Web Service (Java 21 Spring Boot)
                 │                                Endpoint: https://canto-alegre.onrender.com/api/v1
                 │                                                    │
                 │                                                    ├──► AWS RDS PostgreSQL 16.9
                 │                                                    │
                 └── (2) S3 Photo Upload ─────────────────────────────┼──► AWS S3 Bucket
```

---

## 2. Passo a Passo para Deploy do Frontend PWA

### Opcao A: Deploy na Vercel (Recomendado)
1. Acesse o painel da [Vercel](https://vercel.com) e conecte sua conta do GitHub.
2. Importe o repositorio `canto-alegre` (ou `FloraCare`).
3. Defina as seguintes configuracoes de build:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Adicione a variavel de ambiente em **Environment Variables**:
   - `VITE_API_URL`: `https://canto-alegre.onrender.com/api/v1`
   - `VITE_GA_MEASUREMENT_ID` *(opcional)*: `G-XXXXXXXXXX` (ID do seu Google Analytics GA4)
5. Clique em **Deploy**. O projeto estara no ar em menos de 2 minutos com SSL HTTPS automatico e dominio `https://canto-alegre.vercel.app`.

### Opcao B: Deploy na Netlify
1. Acesse o painel do [Netlify](https://netlify.com) e crie um **New site from Git**.
2. Selecione o repositorio `canto-alegre`.
3. Configure:
   - **Build Command**: `npm run build`
   - **Publish directory**: `dist`
4. Adicione a variavel `VITE_API_URL=https://canto-alegre.onrender.com/api/v1` em **Site configuration > Environment variables**.
5. Dispare o deploy.

---

## 3. Telemetria & Analytics de Acessos e Cliques

O aplicativo conta com o modulo de telemetria `src/services/analyticsService.js` com persistencia offline e suporte nativo a Google Analytics 4 (GA4).

### Como Rastrear Eventos no Codigo
```javascript
import { analyticsService } from '../services/analyticsService';

// Rastrear visualizacao de pagina/tela
analyticsService.trackPageView('Jardim');

// Rastrear clique em botao
analyticsService.trackEvent('Navbar', 'click', 'Nova_Planta');
```

### Visualizacao do Painel de Estatisticas
O usuario ou administrador pode visualizar o total de acessos e os botoes mais clicados diretamente na interface clicando no botao **Métricas** na barra de navegacao superior (`Navbar.jsx`).

---

## 4. Meta Tags de Compartilhamento Social (Open Graph & Twitter Cards)

O arquivo `index.html` inclui tags preparadas para gerar cards visuais ao compartilhar o link do aplicativo:

```html
<!-- Open Graph / WhatsApp / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Canto Alegre - Guia de Plantas & Jardinagem Inteligente" />
<meta property="og:description" content="Seu assistente pessoal de jardinagem inteligente com IA para identificar plantas e diario de cultivo 100% offline." />
<meta property="og:image" content="/icons/icon-512.png" />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Canto Alegre - Guia de Plantas & Jardinagem Inteligente" />
<meta name="twitter:image" content="/icons/icon-512.png" />
```

---

## 5. Checklist Final Antes da Divulgação

- [x] **API REST online**: `https://canto-alegre.onrender.com/api/v1` respondendo com sucesso.
- [x] **AWS RDS PostgreSQL & AWS S3**: Banco e imagens operacionais.
- [x] **Meta Tags Social Media**: Open Graph e Twitter Cards configurados em `index.html`.
- [x] **Telemetria de Acessos**: Analytics offline e modal de estatisticas ativo no app.
- [x] **Compilacao Frontend**: `npm run build` aprovado sem warnings ou erros.
- [x] **Testes Automatizados**: `./mvnw test` 100% aprovados.
