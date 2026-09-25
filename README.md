# Canto Alegre - Guia de Plantas, Mudas & Jardinagem Inteligente

> **Assistente botânico inteligente com PWA Offline-First no Frontend (React 18 + Vite) e API de Microsserviços no Backend (Java 21 + Spring Boot 3 + PostgreSQL 16 + Google Gemini LLM).**

---

## Guia de Estudos & Documentacao Arquitetural

Para entender detalhadamente a arquitetura do sistema, a comunicacao entre o PWA e a API REST, o fluxo de sincronizacao offline-first e o funcionamento das anotações Java/Spring, consulte a pasta de estudos dedicada:

- **[Indice de Estudos (studies/README.md)](studies/README.md)**
  - **[Roadmap & Arquitetura de Comunicacao (studies/01-ROADMAP_E_ARQUITETURA.md)](studies/01-ROADMAP_E_ARQUITETURA.md)**: Visao geral da evolucao do escopo, diagramas de sequencia e sincronizacao hibrida offline-first.
  - **[Manual de Anotacoes Java/Spring (studies/02-GUIA_DE_ANOTACOES_JAVA_SPRING.md)](studies/02-GUIA_DE_ANOTACOES_JAVA_SPRING.md)**: Guia completo de anotações ("decoradores") Spring Boot, JPA/Hibernate, Validation, Lombok e Testes (JUnit 5, Mockito e Testcontainers).

---

## Inspiração & Origem

Este projeto nasceu da vivência prática durante **voluntariados no Worldpackers** atuando como jardineiro e cuidador de espaços verdes em eco-pousadas, hostels e fazendas agroecológicas. No campo, identificar plantas nativas, entender ciclos de rega sob climas variados e tirar mudas para multiplicar os canteiros eram desafios diários. 

O **Canto Alegre** foi criado para conectar esse aprendizado prático da terra com o que há de mais avançado em IA e tecnologias web/cloud modernas.

---

## Arquitetura do Ecossistema

O sistema adota uma arquitetura descentralizada e resiliente dividida em duas grandes camadas:

```
[ PWA Client (React 18 + IndexedDB) ] <---> [ REST API (Spring Boot 3 + Java 21) ] <---> [ PostgreSQL 16 ]
                                                     |
                                                     +---> [ Google Gemini LLM ]
```

### 1. Backend REST API (`canto-alegre-api`)
- **Linguagem & Framework**: Java 21 e Spring Boot 3.x (Spring Web, Spring Data JPA, Spring Security, Validation).
- **Banco de Dados Relacional**: PostgreSQL 16 (executado via Docker Compose) com controle de versoes de schema via **Flyway Migration** (`V1__create_initial_schema.sql`).
- **Respostas de Erro Padronizadas**: Mapeamento global de exceções via `@RestControllerAdvice` seguindo a **RFC 7807 (ProblemDetail)**.
- **Enriquecimento via IA Botânica**: `GeminiService` realiza a busca e enriquecimento de novas especies com fallback automatico e persistência no banco de dados como **cache canonico**.
- **Multi-Tenancy Anônimo (Guest-First)**: Seguranca stateless isolada por `X-Guest-Id` via cabeçalho HTTP, permitindo que cada usuario tenha seu jardim isolado sem barreiras de login.
- **Suíte de Testes Automatizados**: 17 testes automatizados divididos em testes unitarios com JUnit 5 + Mockito e testes de integracao com **Testcontainers** subindo container PostgreSQL `16-alpine` real.

### 2. Frontend PWA (`Canto Alegre`)
- **Tecnologias**: React 18, Vite 5, CSS3 com tokens de Design System e alternância de Temas (Claro e Escuro).
- **Resiliencia Offline-First**: Persistencia instantânea via IndexedDB (`idb-keyval`) e Service Worker nativo.
- **Sincronizacao Hibrida Cloud**: Cliente HTTP (`apiService.js`) integrado com fila offline de operacoes pendentes (`syncService.js`) que envia as alteracoes para a API assim que a conexao de rede e restabelecida.

---

## Funcionalidades Principais

- **Identificação Botânica por Foto & IA Multimodal**: Use a câmera ou fotos da galeria. A IA Google Gemini extrai nome popular/cientifico, rega, sol, solo e diagnostico de saude.
- **Guia Completo de Mudas & Estaquia**: Passo a passo de multiplicacao por estaca de caule, folha ou divisao de touceiras.
- **Sincronizacao Hibrida Cloud + Offline-First**: Funciona perfeitamente sem internet e sincroniza os dados com o PostgreSQL na nuvem quando online.
- **Dashboard do Jardim & Alerta de Sede**: Gerenciamento de plantas, historico de regas e lembretes diarios.
- **Alternância de Temas (Claro e Escuro)**: Interface adaptativa para uso em ambientes internos ou sob luz solar direta.

---

## Como Executar o Projeto Localmente

### 1. Executando o Backend REST API (`canto-alegre-api`)

```bash
# 1. Navegue para a pasta da API
cd api

# 2. Inicie o container PostgreSQL via Docker Compose
docker-compose up -d

# 3. Compilar e executar os testes unitarios e de integracao (Testcontainers)
./mvnw test

# 4. Iniciar a aplicacao Spring Boot (Porta 8080)
./mvnw spring-boot:run
```

### 2. Executando o Frontend PWA

```bash
# 1. Na raiz do projeto, instale as dependencias
npm install

# 2. Inicie o servidor de desenvolvimento Vite
npm run dev

# 3. Executar o build de producao
npm run build
```

---

## Como Contribuir (Forks & Pull Requests)

Contribuições da comunidade sao muito bem-vindas. Para instruções de como configurar seu ambiente local, criar branches e enviar um Pull Request, consulte os guias dedicados:  
- [Guia de Contribuicao (CONTRIBUTING.md)](CONTRIBUTING.md)
- [Estudos de Arquitetura & Anotacoes (studies/README.md)](studies/README.md)

---

## Licença

Distribuído sob a Licença MIT.
