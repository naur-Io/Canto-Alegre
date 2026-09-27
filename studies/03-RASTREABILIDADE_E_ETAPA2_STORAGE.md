# Rastreabilidade de Features & Documentação Técnica da Etapa 2: Storage Cloud

Este documento serve como **guia de rastreabilidade** de todas as funcionalidades implementadas no projeto **Canto Alegre**, detalhando o histórico de desenvolvimento (Usuário vs Agente), instruções de **como fazer e desfazer** cada alteração, e o detalhamento arquitetural completo da **Etapa 2 (Storage Cloud de Fotos)**.

---

## 1. Matriz de Rastreabilidade de Features (Histórico do Projeto)

| Funcionalidade / Feature | O que foi feito | Solicitado / Executado Por | Arquivos Principais | Como Fazer / Testar | Como Desfazer / Reverter |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Identidade Canto Alegre** | Renomeação da marca e geração de ícones PWA 192px/512px. | Usuário / Agente | `manifest.json`, `index.html`, `public/icons/` | Acessar o app e verificar título e ícone na aba/instalação PWA. | Reverter arquivos em `manifest.json` e `index.html` via `git checkout`. |
| **PWA & Cache 100% Offline** | Service Worker nativo e persistência local via IndexedDB (`idb-keyval`). | Usuário / Agente | `public/sw.js`, `src/services/storageService.js` | Desconectar a internet no navegador e recarregar a página. | Remover o registro de Service Worker em `main.jsx`. |
| **Tela de Apresentação (Landing Page)** | Página web de entrada com propósito, instruções PWA (Android/iOS) e créditos. | Usuário / Agente | `src/components/PresentationLanding.jsx`, `public/about.html` | Acessar a raiz da aplicação (`currentView === 'landing'`). | Remover a exibição condicional da landing page em `App.jsx`. |
| **Suporte Bilíngue (PT-BR / EN)** | Alternador de idioma instantâneo na barra superior. | Usuário / Agente | `src/services/i18n.js`, `src/components/Navbar.jsx` | Clicar no botão `PT-BR / EN` na Navbar. | Remover o estado `currentLang` e manter apenas strings estáticas em PT-BR. |
| **Botão Flutuante FAB (+)** | Botão verde fixo no canto inferior direito para adicionar planta rápida. | Usuário / Agente | `src/App.jsx`, `src/styles/index.css` | Acessar a tela "Meu Jardim" e observar o botão `+` no canto inferior. | Remover o elemento `<button className="fab-add-plant">` em `App.jsx`. |
| **Tour Guiado com Spotlight Highlight** | Passo a passo com destaque luminoso (*spotlight ring*) nos botões do sistema. | Usuário / Agente | `src/components/GardenTourWalkthrough.jsx` | Acessar o jardim ou limpar `cantoalegre_garden_tour_completed_v1` no localStorage. | Remover o componente `<GardenTourWalkthrough>` em `App.jsx`. |
| **Novo Fluxo de Adição (Pergunta Inicial + Auto-Complete)** | Pergunta *"Você já conhece o nome da planta?"* com auto-complete de cuidados e mudas por IA ou foto. | Usuário / Agente | `src/components/AddPlantModal.jsx`, `src/services/geminiService.js` | Clicar em "Nova Planta", escolher "Sim" e digitar um nome (ex: Jiboia) -> Auto-completar. | Voltar a etapa inicial do `AddPlantModal.jsx` para `'choose_photo'`. |
| **Tema Botânico Único Claro** | Consolidação em um tema claro botânico de alto contraste sem alternância escuro. | Usuário / Agente | `src/styles/index.css`, `src/services/storageService.js` | Navegar pela interface observando paleta sálvia/pistache com texto nítido. | Restaurar o seletor `[data-theme="dark"]` em `index.css` via Git. |
| **Etapa 1 Backend (Spring Boot 3 + PostgreSQL)** | APIs REST para plantas, espécies, rega e enriquecimento Gemini LLM. | Agente | `api/src/main/java/com/cantoalegre/api/` | Executar `./mvnw test` na pasta `api/`. | Desfazer commits do backend em `api/`. |
| **Etapa 2 Storage Cloud de Fotos** | Endpoint Multipart `POST /plants/{id}/photo` e `LocalStorageService`. | Usuário / Agente | `PlantController.java`, `LocalStorageService.java`, `apiService.js` | Enviar requisição POST multipart com arquivo de imagem. | Remover endpoint `/{id}/photo` do `PlantController.java`. |

---

## 2. Detalhamento Técnico da Etapa 2 (Storage Cloud de Fotos)

### 2.1. O que vai ser feito (What)
Implementação do sistema de **upload e persistência de arquivos de imagem na nuvem/servidor**, permitindo que fotos tiradas pelo usuário ou selecionadas da galeria sejam enviadas via multipart para a API Spring Boot, salvando o arquivo e atualizando o atributo `photoUrl` da planta no PostgreSQL.

### 2.2. Onde vai ser feito (Where)
- **Interface de Storage**: `api/src/main/java/com/cantoalegre/api/service/ImageStorageService.java`
- **Serviço de Armazenamento**: `api/src/main/java/com/cantoalegre/api/service/LocalStorageService.java`
- **Configuração de Recursos Estáticos**: `api/src/main/java/com/cantoalegre/api/config/WebMvcConfig.java`
- **Endpoint REST Multipart**: `api/src/main/java/com/cantoalegre/api/controller/PlantController.java` (`POST /api/v1/plants/{id}/photo`)
- **Regras de Negócio**: `api/src/main/java/com/cantoalegre/api/service/PlantService.java` (`uploadPlantPhoto`)
- **Cliente HTTP Frontend**: `src/services/apiService.js` (`uploadPlantPhoto`)
- **Testes Automáticos**: `api/src/test/java/com/cantoalegre/api/service/PlantServiceTest.java`

### 2.3. Como vai ser feito (How)
1. **Padrão de Projeto Strategy**: A interface `ImageStorageService` define o contrato `storeImage(MultipartFile file)`. A classe `LocalStorageService` implementa o salvamento no diretório `./uploads` com nome único baseado em UUID v4.
2. **Exposição de Recursos**: O `WebMvcConfig` registra `/uploads/**` como manipulador de recursos estáticos, permitindo que as imagens sejam acessadas publicamente via HTTP.
3. **Endpoint Controller**: O `PlantController` expõe a rota `@PostMapping("/{id}/photo")` recebendo `@RequestParam("file") MultipartFile file` e o cabeçalho `@RequestHeader("X-Guest-Id") UUID guestUuid`.
4. **Validação & Higienização**: Validação de arquivos nulos, verificação de tipo MIME (`image/jpeg`, `image/png`, `image/webp`) e tratamento de exceções com a RFC 7807 (`BusinessRuleException`).

### 2.4. Por que vai ser feito (Why)
- **Persistência Nuvem / Multi-dispositivo**: Atualmente as fotos em base64 salvas no IndexedDB ocupam muito espaço local no navegador do celular.
- **Eficiência e Desempenho**: Armazenar arquivos de imagem em um servidor/nuvem otimiza o carregamento da lista de plantas e possibilita o compartilhamento do jardim entre múltiplos dispositivos do mesmo usuário.

---

## 3. Instruções de Como Fazer e Desfazer (Rastreabilidade de Alterações)

### Como Fazer / Testar a Etapa 2:
1. Navegue até a pasta `api/` no terminal.
2. Execute a suíte de testes com `./mvnw test`. Todos os 20 testes devem passar sem erros.
3. No frontend React, chame `apiService.uploadPlantPhoto(plantId, file)` enviando o arquivo recebido pelo input de câmera/galeria.

### Como Desfazer / Reverter a Etapa 2 (Se necessário):
1. Para remover o recurso de upload sem afetar as demais funcionalidades, remova o método `uploadPlantPhoto` em `PlantController.java` e `PlantService.java`.
2. Delete as classes `LocalStorageService.java`, `ImageStorageService.java` e `WebMvcConfig.java`.
3. Execute `git checkout -- src/services/apiService.js` para reverter o cliente frontend.
