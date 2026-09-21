# Canto Alegre - Guia de Plantas, Mudas & Jardinagem Inteligente

> **Identifique espécies com IA multimodal, aprenda o passo a passo para tirar mudas e cuide do seu jardim com funcionamento 100% offline.**

Canto Alegre é um aplicativo web progressivo (PWA) e assistente botânico pessoal desenvolvido para praticantes de jardinagem, horticultura urbana e voluntariado ecológico. Utiliza inteligência artificial multimodal (**Google Gemini Flash**) para identificar espécies botânicas a partir de fotos, diagnosticar saúde, sugerir rega/luminosidade ideal e ensinar métodos seguros de propagação e estaquia de mudas.

---

## Inspiração & Origem

Este projeto nasceu da vivência prática durante **voluntariados no Worldpackers** atuando como jardineiro e cuidador de espaços verdes em eco-pousadas, hostels e fazendas agroecológicas. No campo, identificar plantas nativas, entender ciclos de rega sob climas variados e tirar mudas para multiplicar os canteiros eram desafios diários. 

O **Canto Alegre** foi criado para conectar esse aprendizado prático da terra com o que há de mais avançado em IA e tecnologias web modernas.

---

## Funcionalidades Principais

- **Identificação Botânica por Foto**: Use a câmera do celular ou suba fotos da galeria. A IA Google Gemini extrai:
  - Nome popular e nomenclatura científica/botânica.
  - Necessidade de rega (volume em ml e frequência em dias).
  - Exposição solar recomendada (Sol Pleno, Meia-Sombra, Sombra).
  - Recomendações de adubação orgânica (Húmus, Bokashi, NPK) e tipo de solo.
  - Diagnóstico de saúde e notas de cultivo.
- **Guia Completo de Mudas & Estaquia**: Instruções detalhadas de multiplicação por estaca de caule, folha ou divisão de touceira, enraizamento (água vs. substrato) e melhor época do ano.
- **PWA Instalável com Suporte 100% Offline**:
  - Service Worker nativo com cache inteligente de arquivos e casca do app (App Shell).
  - Ícones adaptados em alta resolução (192px e 512px).
  - Suporte à instalação na tela inicial no Android, iOS e Desktop sem precisar de downloads em lojas de aplicativos.
  - Armazenamento local das plantas e fotos no navegador via IndexedDB (`idb-keyval`).
- **Alternância de Temas (Claro e Escuro)**:
  - Sessão de configurações e botão rápido para alternar entre os modos visual claro e escuro a qualquer momento.
- **Guia de Boas-Vindas & Configurações Rápidas**:
  - Modal interativo de onboarding explicando como o app funciona no primeiro acesso.
  - Configuração rápida da chave de API gratuita do Google AI Studio ou uso imediato com dados simulados offline.
  - Página standalone de apresentação e landing page em `/about.html`.
- **Diário & Alerta de Sede**: Dashboard com contadores, filtro de plantas que precisam de água hoje e histórico de regas.
- **Central de Notificações & Atualizações**: Notificações in-app sobre novidades, melhorias do sistema e atualizações de versão em tempo real.

---

## Como Instalar e Usar no Celular (Android & iOS)

O Canto Alegre é um **Progressive Web App (PWA)**, oferecendo a experiência de um aplicativo nativo completo sem ocupar a memória do celular:

### No Android (Google Chrome / Samsung Internet / Edge)
1. Acesse o endereço do aplicativo pelo navegador no seu celular.
2. Toque no botão **"Instalar App"** na barra superior ou no Guia de Introdução.
3. Se preferir fazer pelo menu do navegador: toque nos três pontinhos verticais no canto superior direito e selecione **"Instalar aplicativo"** (ou *"Adicionar à tela inicial"*).
4. O ícone do Canto Alegre será adicionado à sua tela inicial, funcionando mesmo sem conexão com a internet.

### No iPhone / iPad (Apple Safari)
1. Abra o Safari e acesse o endereço do aplicativo.
2. Toque no botão de **Compartilhar** (ícone do quadrado com seta para cima na barra inferior).
3. Role as opções para baixo e toque em **"Adicionar à Tela de Início"**.
4. Toque em **"Adicionar"** no canto superior direito. O aplicativo abrirá em tela cheia diretamente da sua tela inicial.

---

## Como Contribuir (Forks & Pull Requests)

Contribuições da comunidade são muito bem-vindas. Para instruções de como configurar seu ambiente local, criar branches e enviar um Pull Request, consulte o guia dedicado:  
[Guia de Contribuição (CONTRIBUTING.md)](CONTRIBUTING.md)

---

## Tecnologias Utilizadas

- **Frontend**: React 18, Vite 5, HTML5, CSS3 Moderno (Design System com suporte a temas Dark/Light)
- **PWA**: Service Worker nativo (`sw.js`), Web App Manifest, Cache API
- **Ícones**: Lucide-React
- **Banco de Dados Local**: IndexedDB (`idb-keyval`) & LocalStorage
- **IA Multimodal**: Google Gemini 1.5 Flash Vision API (Google AI Studio)

---

## Como Executar Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/naur-Io/FloraCare.git
cd FloraCare

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Build de produção
npm run build
```

---

## Compartilhamento no LinkedIn

Sugestão de texto para postagem de portfólio no LinkedIn:

> **Cultive a vida, planta por planta: conheça o Canto Alegre**
>
> Durante minhas experiências de voluntariado com o Worldpackers em pousadas e fazendas agroecológicas, vivenciei na prática o desafio de identificar espécies nativas, entender as necessidades de cada solo e aprender o momento exato para tirar mudas e multiplicar o jardim.
>
> Unindo essa vivência prática à inteligência artificial, desenvolvi o **Canto Alegre**: um assistente botânico inteligente em PWA (Progressive Web App) que funciona 100% offline.
>
> - **Identificação Multimodal**: tire uma foto da folha ou vaso para a IA (Google Gemini Flash) reconhecer a espécie botânica, rega ideal e luminosidade.  
> - **Guia de Mudas & Estaquia**: passo a passo detalhado de propagação para cada espécie.  
> - **Temas Claro e Escuro**: interface adaptável para leitura em ambientes internos ou sob luz solar.  
> - **PWA Offline**: dados e fotos preservados localmente no aparelho (IndexedDB), sem depender de internet no campo.  
> - **Zero barreira**: gratuito e acessível direto pelo navegador.
>
> Código-fonte: https://github.com/naur-Io/FloraCare  
>
> #React #PWA #ArtificialIntelligence #GoogleGemini #WebDevelopment #OpenSource #Jardinagem #TechForGood

---

## Licença

Distribuído sob a Licença MIT.
