# Publicacao para o LinkedIn - Canto Alegre

Este documento contem dois modelos de postagem completos (em Portugues e em Ingles) prontos para publicar no **LinkedIn**, apresentando o projeto **Canto Alegre**, sua historia de origem nos voluntariados ambientais, arquitetura de software, stack tecnologica e links de producao.

---

## Opcao 1: Post em Portugues (PT-BR)

**[LINKEDIN POST - PT-BR]**

Com muita satisfacao, apresento o **Canto Alegre**, um assistente botanico inteligente e PWA completo desenvolvido para tornar o cultivo de plantas e a jardinagem acessiveis a todos!

**A Historia por Tras do Projeto:**
A ideia do Canto Alegre nasceu da minha vivencia pratica durante voluntariados no **Worldpackers**, cuidando de hortas, jardins e espacos verdes em eco-pousadas e fazendas agroecologicas. No dia a dia da terra, identificar especies nativas, entender necessidades de rega e aprender o momento certo de tirar mudas eram desafios constantes. Resolvi unir esse aprendizado pratico com o que ha de mais moderno em Engenharia de Software, Inteligencia Artificial e Nuvem.

**O que o Canto Alegre faz:**
- **Identificacao Botanica por Foto (IA Gemini)**: Tire uma foto da folha ou vaso e a IA reconhece o nome popular, nome cientifico, origem e requisitos de cultivo.
- **Ambiente Ideal ("Onde Fica a Planta")**: Classificacao automatica do melhor local (sala, quarto, varanda, banheiro ou quintal) com filtros na busca do jardim.
- **Guia Completo de Mudas & Estaquia**: Passo a passo botanico para multiplicar plantas com seguranca (estaquia de caule, folha e divisao de touceiras).
- **Arquitetura Offline-First (PWA)**: Funciona 100% sem internet na horta ou no campo via IndexedDB local e Service Worker, enfileirando alteracoes para sincronizar com a nuvem quando online.

**Engenharia de Software & Cloud Infrastructure:**
- **Frontend**: React 18, Vite 5, PWA (IndexedDB + Service Worker) com Design System em Tema Botanico Claro. Hospedado na **Vercel**.
- **Backend REST API**: Java 21, Spring Boot 3, Spring Data JPA, tratamento global de erros seguindo a **RFC 7807 (ProblemDetail)** e migracao de schema via **Flyway**.
- **Nuvem AWS & Render**: Banco de dados relacional gerenciado **AWS RDS PostgreSQL 16.9**, armazenamento de fotos em bucket **AWS S3** e servidor de aplicacao Spring Boot compilado via Docker multi-stage hospedado 24/7 no **Render.com**.
- **Qualidade & Testes**: Suite com 20 testes automatizados (unitarios com JUnit 5 + Mockito e integracao com **Testcontainers** subindo container PostgreSQL real).

**Links de Acesso ao Projeto:**
- **Aplicativo no Ar (PWA Web App)**: https://canto-alegre-nine.vercel.app
- **Repositorio no GitHub**: https://github.com/naur-Io/FloraCare
- **API REST em Nuvem (Render/AWS)**: https://canto-alegre.onrender.com/api/v1

Fiquem a vontade para testar, instalar o PWA no celular e enviar feedbacks!

#Java21 #SpringBoot3 #ReactJS #AWS #PostgreSQL #PWA #GoogleGemini #SoftwareEngineering #CleanCode #OpenSource #Worldpackers #WebDevelopment #Fullstack

---

## Opcao 2: Post em Ingles (EN)

**[LINKEDIN POST - EN]**

I am excited to announce **Canto Alegre**, a smart botanical assistant and Offline-First PWA designed to make plant care and urban gardening accessible to everyone!

**Project Origin & Inspiration:**
The idea for Canto Alegre came directly from my hands-on environmental volunteering stays through **Worldpackers**, working as a gardener caring for organic crops and green spaces across eco-lodges and farms. Facing daily questions about native species, microclimate watering routines, and cutting propagation inspired me to bridge practical soil wisdom with modern Software Engineering, Artificial Intelligence, and Cloud Infrastructure.

**Key Features:**
- **Multimodal AI Photo Identification**: Take a leaf or pot photo, and Google Gemini AI identifies the botanical species, family, origin, and tailored care routines.
- **Ideal Environment Classification**: Automatically classifies whether a plant thrives indoors (living room, bedroom, bathroom) or outdoors (balcony, garden), featuring dynamic search filters.
- **Plant Propagation & Cutting Guide**: Step-by-step instructions for stem cuttings, leaf propagation, and clump division with expert tips.
- **100% Offline-First PWA Architecture**: Works seamlessly without internet in remote fields using local IndexedDB storage and Service Workers, auto-syncing with the cloud upon network reconnection.

**Software Engineering & Cloud Architecture:**
- **Frontend**: React 18, Vite 5, PWA (IndexedDB + Service Worker) featuring a high-contrast Botanical Theme. Hosted on **Vercel**.
- **Backend REST API**: Java 21, Spring Boot 3, Spring Data JPA, global RFC 7807 (ProblemDetail) error handling, and **Flyway** database migrations.
- **AWS Cloud Infrastructure**: Managed relational database on **AWS RDS PostgreSQL 16.9**, image storage in **AWS S3 Buckets**, and 24/7 Spring Boot API execution via multi-stage Docker containers on **Render.com**.
- **Quality & Automated Testing**: 20 automated tests combining JUnit 5, Mockito unit tests, and real PostgreSQL integration tests using **Testcontainers**.

**Useful Links:**
- **Live PWA Web App**: https://canto-alegre-nine.vercel.app
- **GitHub Repository**: https://github.com/naur-Io/FloraCare
- **Cloud REST API Endpoint**: https://canto-alegre.onrender.com/api/v1

Feel free to test the app, install it on your mobile device, and share your feedback!

#Java21 #SpringBoot3 #ReactJS #AWS #PostgreSQL #PWA #GoogleGemini #SoftwareEngineering #CleanCode #OpenSource #Worldpackers #WebDevelopment #Fullstack
