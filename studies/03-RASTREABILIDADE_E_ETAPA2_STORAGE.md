# Guia de Rastreabilidade, Evolução do Projeto & Transição para Nuvem (AWS)

> **Este documento apresenta a trajetória do Canto Alegre: desde a ideia original até a construção do ecossistema híbrido (PWA + REST API + IA Gemini + Cloud Storage em AWS), detalhando o histórico de desenvolvimento, como fazer e desfazer recursos, e o papel dos serviços em nuvem.**

---

## 1. Contexto & História da Evolução do Projeto

O **Canto Alegre** nasceu de uma necessidade real vivenciada em campos de jardinagem e agroecologia. Conforme o aplicativo evoluiu, a arquitetura foi expandida para atender tanto o uso offline no celular quanto o armazenamento seguro em nuvem.

Abaixo está o mapa contextual de como cada funcionalidade foi idealizada, construída e mantida no projeto:

### 🌿 Identidade Canto Alegre & PWA Offline-First
- **Por que fizemos?** Garantir que o aplicativo funcione em qualquer lugar — mesmo em hortas ou fazendas distantes sem sinal de internet.
- **Como foi construído?** Criamos a marca Canto Alegre, geramos os ícones do aplicativo (`public/icons/`) e implementamos um Service Worker nativo (`public/sw.js`) integrado ao banco local IndexedDB (`src/services/storageService.js`).
- **Como Testar:** Abra o app no navegador, abra as ferramentas de desenvolvedor (F12), desligue a internet (modo Offline) e recarregue a página. O aplicativo continuará funcionando perfeitamente.
- **Como Desfazer:** Basta desativar a linha de registro do Service Worker em `src/main.jsx`.

### 📱 Tela de Apresentação (Landing Page) & Guia de Instalação PWA
- **Por que fizemos?** Permitir o compartilhamento do projeto através de um link público e orientar o usuário a instalar o PWA no celular (Android e iOS) antes de entrar na aplicação.
- **Como foi construído?** Desenvolvemos o componente `PresentationLanding.jsx` e o modal explicativo com o passo a passo ilustrado para Chrome, Edge, Samsung Internet e Safari.
- **Como Testar:** Acesse o link raiz da aplicação e observe a tela de boas-vindas com o botão "Usar o Aplicativo".
- **Como Desfazer:** Altere o estado padrão de navegação em `src/App.jsx` para direcionar diretamente à página "Meu Jardim".

### 💡 Tour Guiado Interativo com Spotlight Ring
- **Por que fizemos?** Garantir uma recepção acolhedora para novos usuários, ensinando a utilizar o app através de pequenas janelas explicativas com botão *Próximo*.
- **Como foi construído?** Criamos o componente `GardenTourWalkthrough.jsx` que aplica um círculo de iluminação visual (*spotlight*) em cada botão do sistema à medida que o usuário avança no tutorial.
- **Como Testar:** Abra o aplicativo no navegador pela primeira vez (ou limpe a chave `cantoalegre_garden_tour_completed_v1` do localStorage).
- **Como Desfazer:** Remova a chamada do componente `<GardenTourWalkthrough>` dentro de `src/App.jsx`.

### 🌸 Pergunta Inicial ("Conhece a Planta?") & Auto-Complete com IA Gemini
- **Por que fizemos?** Agilizar o cadastro de quem já sabe o nome popular da planta (ex: "Jiboia" ou "Espada de São Jorge") sem obrigar tirar foto imediata, preenchendo todos os detalhes botânicos automaticamente via IA.
- **Como foi construído?** Reformulamos o `AddPlantModal.jsx` com um fluxo de duas etapas: pergunta inicial interativa + busca inteligente com auto-complete alimentado pelo modelo `Google Gemini 1.5 Flash`.
- **Como Testar:** Clique no botão "+ Nova Planta", selecione "Sim, já conheço o nome", digite o nome de uma planta e observe a IA preenchendo a ficha técnica completa.
- **Como Desfazer:** Reverta a etapa inicial do `AddPlantModal.jsx` para ir diretamente ao upload de foto.

### 🏡 Ambiente Ideal / Onde Fica a Planta (Fase v1.5.1)
- **Por que fizemos?** Ajudar o usuário a organizar o espaço da casa ou quintal, indicando visualmente onde posicionar cada espécie para que receba a iluminação correta.
- **Como foi construído?** Adicionamos o atributo `idealEnvironment` na interface React, no prompt da IA Gemini, no banco relacional PostgreSQL (`V2__add_ideal_environment.sql`) e nas rotas da REST API Spring Boot.
- **Como Testar:** Adicione ou edite uma planta e defina o ambiente (ex: *"Dentro de casa (Sala/Quarto)"*). Na barra de busca do jardim, digite "quarto" ou "sala" para filtrar instantaneamente.
- **Como Desfazer:** Reverta a migração `V2` no banco de dados e remova o campo nos componentes React.

---

## 2. A transição para a Nuvem: Onde a AWS se Encaixa no Projeto?

Muitos desenvolvedores têm dúvida sobre **quando e onde usam serviços na nuvem (como a AWS)** durante o ciclo de vida de um projeto. Vamos contextualizar exatamente a situação atual do Canto Alegre e os próximos passos.

### 🎯 O que você já está usando em Nuvem HOJE?
1. **Google Gemini LLM Cloud API**: A inteligência artificial que reconhece plantas por foto e gera os guias de cultivo é um serviço 100% em nuvem fornecido pela Google AI Cloud.
2. **PostgreSQL Relacional (Container Docker)**: Atualmente, seu banco de dados roda localmente na sua máquina para agilidade no desenvolvimento.
3. **Armazenamento de Fotos Local (`./uploads`)**: As fotos das plantas enviadas via backend são gravadas no disco local da máquina.

---

### ☁️ Onde e Como Você Vai Mexer na AWS (Próximos Passos de Produção)

Para disponibilizar o **Canto Alegre** para milhares de usuários na internet de forma profissional, você utilizará **três pilares principais da AWS**:

```
+-----------------------------------------------------------------------------------+
|                                 ARQUITETURA AWS CLOUD                             |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Usuário no Smartphone / PWA ]                                                  |
|                 │                                                                 |
|                 ├── (1) Fotos de Plantas ──────► AWS S3 (Simple Storage Service)   |
|                 │                                 (Guardar imagens das mudas)     |
|                 │                                                                 |
|                 └── (2) Requisições REST API ──► AWS EC2 / App Runner             |
|                                                   (Executar API Spring Boot Java) |
|                                                           │                       |
|                                                           ▼                       |
|                                                    AWS RDS (PostgreSQL)           |
|                                                    (Banco de Dados na Nuvem)      |
+-----------------------------------------------------------------------------------+
```

#### 1. AWS S3 (Simple Storage Service) - Armazenamento de Fotos
- **Por quê usar?** Salvar fotos de plantas no próprio disco da máquina local limita o espaço e impede o dimensionamento automático. O AWS S3 é o serviço padrão para guardar imagens de forma rápida, barata e acessível por URL pública.
- **Como implementar no Java?** Graças ao padrão de projeto `Strategy` criado no backend, você só precisará criar uma classe `S3StorageService` implementando a interface `ImageStorageService.java`, alterando uma única linha de configuração no Spring Boot!

#### 2. AWS RDS (Relational Database Service) - Banco PostgreSQL na Nuvem
- **Por quê usar?** Em vez de manter o banco PostgreSQL rodando no Docker do seu computador, o AWS RDS fornece um banco de dados PostgreSQL totalmente gerenciado pela AWS com backups diários automáticos.

#### 3. AWS App Runner / EC2 - Servidor da API Spring Boot
- **Por quê usar?** É onde o arquivo executável da sua API Java (`canto-alegre-api-0.0.1-SNAPSHOT.jar`) ficará rodando 24 horas por dia para responder às requisições do aplicativo.

---

## 3. Resumo Prático de Rastreabilidade das Modificações

| Funcionalidade | Papel do Agente / Usuário | Arquivos Afetados | Como Testar Rapidamente | Como Desfazer com Segurança |
| :--- | :--- | :--- | :--- | :--- |
| **PWA & Offline** | Parceria Usuário + Agente | `sw.js`, `storageService.js` | Desligar Wi-Fi no navegador | Desativar SW em `main.jsx` |
| **Fluxo IA Gemini** | Parceria Usuário + Agente | `geminiService.js`, `AddPlantModal.jsx` | Testar auto-complete com "Jiboia" | Voltar modal para passo único |
| **Backend REST API** | Agente de Código | `api/src/main/java/...` | Executar `./mvnw test` na pasta `api` | Checkout dos commits na pasta `api` |
| **Ambiente Ideal (v1.5.1)** | Solicitado pelo Usuário | `Plant.java`, `V2...sql`, `PlantCard.jsx` | Filtrar por "quarto" na barra de busca | Dropar coluna `ideal_environment` |
| **Cloud Storage AWS S3** | Solicitado pelo Usuário | `S3Config.java`, `S3StorageService.java` | Cadastrar planta enviando foto no S3 | Alterar profile ativo para `default` |
| **Deploy Nuvem Render + RDS (v1.6.0)** | Solicitado pelo Usuário | `api/Dockerfile`, `application-prod.properties` | Acessar `https://canto-alegre.onrender.com/api/v1/species` | Pausar serviço no Render |
| **UI Compacta & Botão FAB + (v1.6.0)** | Solicitado pelo Usuário | `App.jsx`, `src/styles/index.css` | Abrir a home do app e testar botão + no canto inferior | Reverter estilos em `index.css` |

---

## 4. Conclusão

O **Canto Alegre** já possui toda a base arquitetural pronta para a nuvem. O código foi projetado de forma desacoplada para que a transição do armazenamento local para a **AWS** aconteça de maneira simples e transparente, mantendo a experiência do usuário fluida tanto online quanto offline.
