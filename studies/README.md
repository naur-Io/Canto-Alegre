# Guia de Estudos Arquiteturais - Canto Alegre API

Este diretório contem o material de estudo detalhado sobre a evolucao arquitetural, integracao de modulos e mapeamento completo das anotações ("decoradores") Java do projeto **Canto Alegre API**.

---

## Indice de Documentos de Estudo

| Documento | Descricao e Conteudo |
| :--- | :--- |
| [01-ROADMAP_E_ARQUITETURA.md](./01-ROADMAP_E_ARQUITETURA.md) | Roadmap do desenvolvimento, transicao de escopo (PWA IndexedDB para Spring Boot 3 + PostgreSQL + Gemini LLM), fluxo de comunicacao entre modulos e sincronizacao hibrida offline-first. |
| [02-GUIA_DE_ANOTACOES_JAVA_SPRING.md](./02-GUIA_DE_ANOTACOES_JAVA_SPRING.md) | Manual exaustivo de todas as anotações Java (Spring, JPA/Hibernate, Lombok, Validation, JUnit 5, Mockito e Testcontainers), detalhando utilidade, localizacao no codigo, dependencias Maven e impacto no software/banco de dados. |

---

## Estrutura Geral do Ecossistema

```
Canto-Alegre/
├── api/                                # Backend Spring Boot 3 / Java 21
│   ├── docker-compose.yml              # Container PostgreSQL 16
│   ├── pom.xml                         # Dependencias Maven (Spring, JPA, Flyway, Testcontainers)
│   └── src/
│       ├── main/java/com/cantoalegre/api/
│       │   ├── config/                 # SecurityConfig & JacksonConfig
│       │   ├── controller/             # PlantController & BotanicalSpeciesController
│       │   ├── domain/model/           # User, Plant, BotanicalSpecies, WateringLog
│       │   ├── dto/                    # Java Records (Request & Response)
│       │   ├── exception/              # GlobalExceptionHandler (RFC 7807)
│       │   ├── repository/             # Spring Data JPA Repositories
│       │   └── service/                # PlantService, BotanicalSpeciesService, UserService, GeminiService
│       └── test/java/com/cantoalegre/api/
│           ├── integration/            # Testes de integracao com Testcontainers
│           └── service/                # Testes unitarios com JUnit 5 + Mockito
├── src/                                # Frontend React 18 / Vite PWA
│   ├── services/
│   │   ├── apiService.js               # Cliente REST com cabeçalho X-Guest-Id
│   │   ├── syncService.js              # Fila offline e reconciliacao em background
│   │   └── storageService.js           # Gerenciador hibrido IndexedDB + Cloud Sync
│   └── App.jsx                         # Interface de usuario do Jardim
├── studies/                            # Documentos de Estudo Arquitetural (Voce esta aqui)
│   ├── README.md
│   ├── 01-ROADMAP_E_ARQUITETURA.md
│   └── 02-GUIA_DE_ANOTACOES_JAVA_SPRING.md
└── CHANGELOG.md                        # Histórico de versoes e alteracoes
```
