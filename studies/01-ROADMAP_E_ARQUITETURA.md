# Roadmap & Arquitetura de Integracao: Canto Alegre API

Este documento detalha o roadmap de desenvolvimento do ecossistema **Canto Alegre**, a evolucao da arquitetura cliente-servidor e a comunicacao entre os modulos do sistema.

---

## 1. Visao Geral do Produto & Transicao de Escopo

O projeto iniciou-se como um PWA (React 18 + Vite + IndexedDB via `idb-keyval`) com capacidade de funcionamento 100% offline para gerenciamento de jardim e identificacao botânica local.

O escopo evoluiu para a construcao de uma API de microsservicos dedicada em **Java 21 / Spring Boot 3 + PostgreSQL 16**, provendo:
- Sincronizacao na nuvem sem perder a resiliencia offline.
- Catalogo botanico canonico compartilhado no banco de dados.
- Enriquecimento inteligente de especies via Google Gemini LLM.
- Modelo de seguranca anonomo Guest-First por UUID v4 (`X-Guest-Id`).

---

## 2. Roadmap das Fases de Desenvolvimento

```mermaid
flowchart TD
    subgraph E1["Etapa 1: Backend Core & APIs Robustas (CONCLUIDO)"]
        A1["Banco & Flyway V1"] --> A2["Entidades JPA & Repositorios"]
        A2 --> A3["Exception Handler RFC 7807"]
        A3 --> A4["Services & Gemini Enrichment"]
        A4 --> A5["Endpoints REST Plants/Species"]
        A5 --> A6["Sync Hibrido PWA"]
        A6 --> A7["Testes Unitarios (JUnit 5)"]
        A7 --> A8["Testes de Integracao (Testcontainers)"]
    end

    subgraph E2["Etapa 2: Storage Cloud de Fotos"]
        B1["Endpoint Multipart POST /plants/{id}/photo"] --> B2["Integracao AWS S3 / MinIO"]
    end

    subgraph E3["Etapa 3: Autenticacao OAuth2"]
        C1["Spring Security OAuth2 Resource Server"] --> C2["Migracao Guest UUID -> Google Account"]
    end

    subgraph E4["Etapa 4: Busca Semantica & Infra"]
        D1["Redis Cache em Species"] --> D2["Extensao pgvector para Busca Semantica"]
        D2 --> D3["Deploy AWS via Terraform"]
    end

    E1 --> E2 --> E3 --> E4
```

---

## 3. Arquitetura de Comunicacao entre Modulos

### 3.1. Diagrama de Fluxo Ponta a Ponta

```mermaid
sequenceDiagram
    autonumber
    actor Usuario as Usuario PWA
    participant React as React UI (App.jsx)
    participant Storage as storageService / IndexedDB
    participant Sync as syncService.js
    participant APIClient as apiService.js
    participant Controller as Spring REST Controller
    participant Service as Plant / Botanical Service
    participant Gemini as GeminiService (LLM)
    participant DB as PostgreSQL (Docker)

    Usuario->>React: Adiciona / Rega Planta
    React->>Storage: Salva no IndexedDB (Instantaneo / Offline-First)
    
    alt Dispositivo Online
        Storage->>APIClient: Dispara requisicao HTTP (X-Guest-Id)
        APIClient->>Controller: POST /api/v1/plants (JSON)
        Controller->>Service: createPlant(guestUuid, DTO)
        
        opt Especie nao existe no DB
            Service->>Gemini: generateBotanicalSpeciesInfo(nome)
            Gemini-->>Service: JSON Estruturado da Especie
            Service->>DB: Salva nova BotanicalSpecies (Cache Canonico)
        end
        
        Service->>DB: Salva Planta no usuario (WHERE user_id)
        DB-->>Service: Retorna Entity Persistida
        Service-->>Controller: Retorna DTO Response
        Controller-->>APIClient: HTTP 201 Created (ProblemDetail em falhas)
    else Dispositivo Offline
        Storage->>Sync: Enfileira acao em cantoalegre_pending_sync_queue
        Note over Sync: Aguarda evento window.onLine para reconciliar
    end
```

---

## 4. Decisões Arquiteturais Estrategicas

### 4.1. Guest-First Multi-Tenancy via UUID Stateless
- O PWA gera e armazena localmente um `guest_id` (UUID v4) no IndexedDB.
- Cada requisicao enviada ao backend inclui o cabeçalho HTTP `X-Guest-Id: <UUID>`.
- O `UserService` busca ou cria o registro correspondente na tabela `users` do PostgreSQL.
- O isolamento entre usuarios e garantido via SQL estrito (`WHERE user_id = :userId`), sem carregar estado de sessao em memoria na JVM.

### 4.2. Fluxo de Enriquecimento Botanico & Cache Canonico
1. O usuario digita o nome de uma planta (ex.: "Costela-de-Adão").
2. O `BotanicalSpeciesService` pesquisa no PostgreSQL (`botanical_species`) por nome comum ou cientifico (ignorando maiusculas/minusculas).
3. Caso **nao exista**, o `GeminiService` consulta a API de texto do Google Gemini gerando os dados de rega, sol, solo e propagacao.
4. O resultado e salvo no PostgreSQL como **cache canonico**, de forma que as proximas consultas de qualquer usuario sejam instantâneas sem consumo de cota da LLM.

### 4.3. Resiliencia Offline-First no PWA
1. Qualquer acao (criar planta, regar) grava **imediatamente no IndexedDB** do navegador para garantir resposta instantânea da interface.
2. Em segundo plano, a chamada HTTP e enviada à API Spring Boot.
3. Se a conexao falhar, a operacao e registrada na fila `cantoalegre_pending_sync_queue`.
4. Ao restabelecer a conexao (`online`), o `syncService.js` descarrega a fila e reconcilia os dados locais com a nuvem.
