# Guia de Contribuição - Canto Alegre 🌿

Seja muito bem-vindo(a)! Ficamos muito felizes pelo seu interesse em contribuir com o **Canto Alegre**. Este é um projeto de código aberto dedicado a conectar a paixão por plantas, jardinagem sustentável e tecnologia acessível com inteligência artificial.

Se você tem uma ideia de nova funcionalidade, correção de bug, melhoria de design ou documentação, este guia detalha o passo a passo para colaborar.

---

## 🧭 Sumário

1. [Como Começar](#-como-começar)
2. [Fluxo de Trabalho com Fork & Pull Request](#-fluxo-de-trabalho-com-fork--pull-request)
3. [Estrutura do Projeto](#-estrutura-do-projeto)
4. [Padrões de Código e Commits](#-padrões-de-código-e-commits)
5. [Como Reportar Bugs ou Sugerir Ideias](#-como-reportar-bugs-ou-sugerir-ideias)
6. [Reconhecimento](#-reconhecimento)

---

## 🚀 Como Começar

### Pré-requisitos
- **Node.js**: Versão 18 ou superior.
- **Git**: Instalado e configurado no seu sistema.
- Navegador moderno com suporte a Service Workers e IndexedDB (Chrome, Edge, Firefox, Safari).

### Clonando seu Fork

1. No topo desta página no GitHub, clique no botão **Fork** no canto superior direito para criar uma cópia do repositório na sua conta.
2. No seu terminal, clone o seu fork:
   ```bash
   git clone https://github.com/SEU-USUARIO/FloraCare.git
   cd FloraCare
   ```
3. Adicione o repositório original como `upstream`:
   ```bash
   git remote add upstream https://github.com/naur-Io/FloraCare.git
   ```
4. Instale as dependências:
   ```bash
   npm install
   ```
5. Inicie o servidor local de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse no navegador: `http://localhost:3000` (ou a porta indicada no terminal).

---

## 🌿 Fluxo de Trabalho com Fork & Pull Request

Para manter o histórico organizado e facilitar a revisão, siga este fluxo:

### 1. Crie uma branch específica para sua tarefa
Evite fazer alterações diretamente na branch `main`. Crie uma branch com um nome descritivo:
```bash
# Para novas funcionalidades
git checkout -b feature/minha-nova-funcionalidade

# Para correções de bugs
git checkout -b fix/correcao-do-bug
```

### 2. Faça suas alterações e teste localmente
- Mantenha o código limpo, comentado quando necessário e legível.
- Verifique se o build de produção compila sem erros:
  ```bash
  npm run build
  ```

### 3. Faça o commit das alterações
Escreva mensagens de commit claras e objetivas. Recomendamos o padrão **Conventional Commits**:
- `feat:` Nova funcionalidade (ex: `feat: adicionar filtro de plantas por rega`)
- `fix:` Correção de bug (ex: `fix: ajustar responsividade no safari ios`)
- `docs:` Alterações em documentação (ex: `docs: atualizar guia de instalacao`)
- `style:` Formatação visual sem alteração de lógica
- `refactor:` Refatoração de código

Exemplo:
```bash
git add .
git commit -m "feat: adicionar historico fotografico de mudas"
```

### 4. Sincronize com o repositório principal (Upstream)
Antes de enviar seu Pull Request, garanta que sua branch está atualizada com a `main` do repositório oficial:
```bash
git fetch upstream
git rebase upstream/main
```

### 5. Envie para o seu Fork no GitHub
```bash
git push origin feature/minha-nova-funcionalidade
```

### 6. Abra o Pull Request (PR)
1. Acesse o repositório oficial: [naur-Io/FloraCare](https://github.com/naur-Io/FloraCare).
2. O GitHub exibirá uma notificação sugerindo a criação do Pull Request a partir da sua branch recém-enviada. Clique em **Compare & pull request**.
3. Preencha a descrição do PR explicando:
   - Qual problema foi resolvido ou qual funcionalidade foi criada.
   - Como testar a alteração.
   - Screenshots ou gifs (se houver alterações visuais na interface).
4. Clique em **Create pull request**!

---

## 📁 Estrutura do Projeto

Para ajudar você a se localizar rapidamente no código:

```text
FloraCare/
├── public/                  # Arquivos estáticos servidos na raiz
│   ├── icons/               # Ícones PWA (192px, 512px, SVG, Apple Touch)
│   ├── about.html           # Página web independente de apresentação
│   ├── manifest.json        # Manifesto do Progressive Web App (PWA)
│   └── sw.js                # Service Worker para cache 100% offline
├── src/
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── AddPlantModal.jsx            # Cadastro de plantas e foto IA
│   │   ├── ApiKeyModal.jsx              # Configuração da chave Google Gemini
│   │   ├── CameraCapture.jsx            # Câmera web/mobile nativa
│   │   ├── IntroGuideModal.jsx          # Tour de introdução & onboarding
│   │   ├── Navbar.jsx                   # Cabeçalho com status e navegação
│   │   ├── PlantCard.jsx                # Cartão de exibição da planta
│   │   ├── PlantDetailModal.jsx         # Detalhes, mudas e edição
│   │   └── UpdatesNotificationModal.jsx # Central de novidades & releases
│   ├── services/            # Serviços de integração e dados
│   │   ├── geminiService.js             # Chamadas à API Google Gemini Flash
│   │   ├── mockData.js                  # Plantas iniciais de demonstração
│   │   ├── storageService.js            # Armazenamento IndexedDB e LocalStorage
│   │   └── updatesData.js               # Histórico de versões e changelog in-app
│   ├── styles/
│   │   └── index.css                    # Design System Botânico com variáveis CSS
│   ├── App.jsx              # Componente raiz da aplicação
│   └── main.jsx             # Ponto de entrada com registro do Service Worker
├── CHANGELOG.md             # Histórico formal de mudanças de versão
├── CONTRIBUTING.md          # Este guia de contribuição
├── package.json             # Dependências e scripts npm
└── README.md                # Apresentação do projeto e guia geral
```

---

## 💡 Ideias do Backlog para Contribuir

Se você quer ajudar mas não sabe por onde começar, veja algumas ideias abertas:
- [ ] **Lembretes Locais com Notificações do Navegador**: Usar a API nativa `Notification` para alertar quando uma planta estiver com sede.
- [ ] **Caderno do Voluntário Worldpackers**: Aba para registrar plantas catalogadas por viagem/fazenda/hostel.
- [ ] **Exportação em PDF do Guia de Cultivo**: Gerar fichas botânicas para impressão ou compartilhamento.
- [ ] **Galeria de Histórico Fotográfico**: Salvar fotos em datas diferentes para acompanhar o crescimento da muda.

---

## 🐞 Como Reportar Bugs ou Sugerir Ideias

Encontrou um erro ou tem uma sugestão?
1. Acesse a aba **[Issues](https://github.com/naur-Io/FloraCare/issues)** do repositório.
2. Antes de abrir uma nova issue, pesquise se outra pessoa já não relatou o mesmo assunto.
3. Se for um novo bug, informe:
   - Passos para reproduzir o problema.
   - Navegador e sistema operacional (ex: Chrome no Android 14, Safari no iOS 17).
   - Comportamento esperado vs. Comportamento observado.

---

## 💚 Obrigado!

Toda contribuição — seja uma vírgula na documentação, uma ideia de design ou uma grande funcionalidade — faz o **Canto Alegre** florescer. Muito obrigado por cultivar este projeto conosco!
