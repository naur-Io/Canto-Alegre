# Canto Alegre 🌿 - Guia de Plantas, Mudas & Jardinagem Inteligente

> **Identifique espécies com IA multimodal, aprenda o passo a passo para tirar mudas e cuide do seu jardim 100% offline.**

Canto Alegre é um aplicativo web progressivo (PWA) e assistente botânico pessoal desenvolvido para amantes de plantas, horticultores urbanos e voluntários de permacultura e hotelaria. Utiliza inteligência artificial multimodal (**Google Gemini Flash**) para identificar espécies botânicas a partir de fotos, diagnosticar saúde, sugerir rega/luminosidade ideal e ensinar métodos seguros de propagação e estaquia de mudas.

---

## 🌎 Inspiração & Origem

Este projeto nasceu da vivência prática durante **voluntariados no Worldpackers** atuando como jardineiro e cuidador de espaços verdes em eco-pousadas, hostels e fazendas agroecológicas. No campo, identificar plantas nativas, entender ciclos de rega sob climas variados e tirar mudas para multiplicar os canteiros eram desafios diários. 

O **Canto Alegre** foi criado para conectar esse aprendizado prático da terra com o que há de mais avançado em IA e tecnologias web modernas.

---

## ✨ Funcionalidades Principais

- 📸 **Identificação Botânica por Foto**: Use a câmera do celular ou suba fotos da galeria. A IA Google Gemini extrai:
  - Nome popular e nomenclatura científica/botânica.
  - Necessidade de rega (volume em ml e frequência em dias).
  - Exposição solar recomendada (Sol Pleno, Meia-Sombra, Sombra).
  - Recomendações de adubação orgânica (Húmus, Bokashi, NPK) e tipo de solo.
  - Diagnóstico de saúde e notas de cultivo.
- 🌱 **Guia Completo de Mudas & Estaquia**: Instruções detalhadas de multiplicação por estaca de caule, folha ou divisão de touceira, enraizamento (água vs. substrato) e melhor época do ano.
- 📱 **PWA Instalável com Suporte 100% Offline**:
  - Service Worker nativo com cache inteligente de arquivos e casca do app (App Shell).
  - Ícones adaptados em alta resolução (192px e 512px).
  - Suporte à instalação na tela inicial no Android, iOS e Desktop sem precisar baixar de lojas de aplicativos.
  - Armazenamento local das plantas e fotos no navegador via IndexedDB (`idb-keyval`).
- 🌿 **Guia de Boas-Vindas & Configurações Rápidas**:
  - Modal interativo de onboarding explicando como o app funciona no primeiro acesso.
  - Configuração rápida da chave de API gratuita do Google AI Studio ou uso imediato com dados simulados offline.
  - Página standalone de apresentação e landing page em `/about.html`.
- 💧 **Diário & Alerta de Sede**: Dashboard com contadores, filtro de plantas que precisam de água hoje e celebração com confetes ao registrar regas.
- 🔔 **Central de Notificações & Atualizações**: Ícone de sino na barra superior com avisos sobre novidades, melhorias do sistema e atualizações de versão em tempo real.

---

## 📱 Como Instalar e Usar no Celular (Android & iOS)

O Canto Alegre é um **Progressive Web App (PWA)**, o que significa que você tem a experiência de um aplicativo nativo completo sem ocupar a memória do celular nem precisar pagar por downloads em lojas:

### 🤖 No Android (Google Chrome / Samsung Internet / Edge)
1. Acesse o link do aplicativo pelo navegador no seu celular.
2. Você verá um botão **"Instalar App"** na barra superior ou no Guia de Introdução.
3. Se preferir, toque no menu do navegador (**três pontinhos ⋮** no canto superior direito) e selecione **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.
4. O ícone verde do Canto Alegre será adicionado à sua gaveta de aplicativos e tela inicial, abrindo em tela cheia e funcionando mesmo quando estiver offline!

### 🍏 No iPhone / iPad (Apple Safari)
1. Abra o Safari e acesse o link do aplicativo.
2. Toque no botão de **Compartilhar** (ícone do quadrado com seta para cima ⎋ na barra inferior).
3. Role as opções para baixo e toque em **"Adicionar à Tela de Início"**.
4. Toque em **"Adicionar"** no canto superior direito. Pronto! O app agora abre sem barras do navegador com ícone de alta resolução.

---

## 🤝 Como Contribuir (Forks & Pull Requests)

Contribuições são de coração aberto! Adoramos receber melhorias da comunidade de desenvolvedores e jardineiros.

Para instruções completas de como configurar seu ambiente, criar branches e abrir um Pull Request, consulte o nosso guia dedicado:  
👉 **[Guia de Contribuição (CONTRIBUTING.md)](CONTRIBUTING.md)**

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, Vite 5, HTML5, CSS3 Moderno (Sistema de Design Botânico)
- **PWA**: Service Worker nativo (`sw.js`), Web App Manifest, Cache API
- **Ícones**: Lucide-React & Ícones SVG/PNG personalizados
- **Banco de Dados Local**: IndexedDB (`idb-keyval`) & LocalStorage com fallback de migração
- **IA Multimodal**: Google Gemini 1.5 Flash Vision API (Google AI Studio)

---

## 🚀 Como Executar Localmente

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

## 📢 Compartilhamento no LinkedIn

Abaixo está uma sugestão pronta para divulgar o projeto no seu LinkedIn:

> **Cultive a vida, planta por planta: apresento o Canto Alegre 🌿**
>
> Durante minhas experiências de voluntariado com o Worldpackers em pousadas e fazendas agroecológicas, percebi na prática o desafio de identificar espécies nativas, entender as necessidades de cada solo e aprender o momento certo para tirar mudas e multiplicar o jardim.
>
> Unindo essa vivência prática de campo à inteligência artificial, desenvolvi o **Canto Alegre**: um assistente botânico inteligente em PWA (Progressive Web App) que funciona 100% offline no seu bolso.
>
> 🔹 **Identificação Multimodal**: tire uma foto da folha ou vaso para a IA (Google Gemini Flash) reconhecer a espécie botânica, rega ideal e luminosidade.  
> 🔹 **Guia de Mudas & Estaquia**: passo a passo detalhado de propagação para cada planta.  
> 🔹 **PWA Offline**: funciona na roça ou na horta sem sinal de internet, com dados salvos no próprio aparelho (IndexedDB).  
> 🔹 **Zero barreira**: sem mensalidades e sem precisar baixar apps pesados de lojas.
>
> 💻 Código-fonte: https://github.com/naur-Io/FloraCare  
> 🌿 Venha conhecer e cultivar com a gente!  
>
> #React #PWA #ArtificialIntelligence #GoogleGemini #WebDevelopment #OpenSource #Jardinagem #TechForGood

---

## 📄 Licença

Distribuído sob a Licença MIT.

