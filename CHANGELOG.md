# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- User Authentication & Cloud Sync: Multi-user account support to sync gardens across multiple devices.
- Worldpackers Volunteer Portfolio: Dedicated logbook to record plants cultivated during volunteering stays across eco-lodges and farms.
- Gardener Profiles & Skill Levels: Experience progression tailored for beginners up to advanced permaculture practitioners.
- Push Notifications & Care Reminders: Browser-based notifications for watering and fertilizing schedules.
- Growth Journal & History Log: Timeline tracking plant growth with historic photo check-ins.

---

## [1.2.0] - 2026-09-25

### Added
- Canto Alegre REST API Backend (Spring Boot 3 + Java 21):
  - Camada de excecoes globais `@RestControllerAdvice` formatada conforme RFC 7807 (`ProblemDetail`).
  - DTOs imutaveis em Java Records com validacoes declarativas Jakarta Bean Validation.
  - Multi-tenancy anonomo baseado no modelo Guest UUID via cabeçalho HTTP `X-Guest-Id`.
  - Servico `PlantService` com integridade transacional ACID, mitigacao N+1 via `JOIN FETCH` e calculo automatico de proximas regas.
  - Servico `GeminiService` e `BotanicalSpeciesService.getOrCreateSpeciesByName` para enriquecimento automatico via Gemini e persistencia de cache canonico em PostgreSQL.
  - Endpoints REST para `/api/v1/plants`, `/api/v1/plants/{id}/water`, `/api/v1/plants/thirsty` e catalogo canonico `/api/v1/species` (incluindo `/by-name`).

- Integracao Resiliente de Sincronizacao Frontend PWA (Fase 1 Concluida):
  - Modulo `apiService.js` com geracao e gerencimento de UUID local no IndexedDB.
  - Modulo `syncService.js` com fila offline de operacoes pendentes (`cantoalegre_pending_sync_queue`) e reconciliacao automatica com a API ao reconectar.
  - Atualizacao de `storageService.js` para persistencia simultanea no IndexedDB local e sincronizacao cloud transparente com Spring Boot.


---

## [1.1.0] - 2026-09-21

### Added
- Canto Alegre Rebranding:
  - Renamed application to Canto Alegre, representing botanical care, nature, and practical gardening.
  - Updated `package.json`, `index.html`, `manifest.json`, `Navbar`, modals, and storage services with seamless backward-compatible data migration.
- Visual Theme Switching:
  - Added Settings Modal (`SettingsModal.jsx`) and quick Navbar button allowing instant toggle between Dark Mode and Light Mode.
  - Initial demonstration collection streamlined to start with a single plant (Jiboia).
- Progressive Web App (PWA) & Offline Mode:
  - Native Service Worker (`sw.js`) with smart caching (Cache-First for assets, Network-First for navigation, and offline fallback for Gemini API).
  - High-resolution icons generated from vector SVG: `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, and `favicon-64.png`.
  - Native `beforeinstallprompt` event handler enabling 1-click installation from Navbar, Intro Modal, and About page.
  - 100% offline data resilience powered by IndexedDB (`idb-keyval`).
- Interactive Welcome & Onboarding Guide (`IntroGuideModal.jsx`):
  - Step-by-step onboarding for first-time users explaining Photo AI Identification, Cutting & Propagation, Watering alerts, and Offline capabilities.
  - Immediate Configurations: In-guide Google AI Studio API key validator or 1-click simulation mode selection.
  - Re-accessible at any time directly from the Navbar.
- In-App Updates & Notifications Center (`UpdatesNotificationModal.jsx`):
  - Navbar bell icon with dynamic unread badge indicating new feature releases.
  - Interactive release timeline and changelog accessible directly inside the app.
  - Service Worker update detection banner with 1-click app reload.
- Presentation Landing Page (`about.html`):
  - Standalone, ultra-fast botanical landing page with feature cards, direct app launch, and PWA download actions.
- Open-Source Contribution Guide:
  - Created `CONTRIBUTING.md` with step-by-step Fork & Pull Request instructions, project directory breakdown, and development guidelines.
  - Created `.gitignore` to prevent committing build artifacts and dependencies.
- Responsive Mobile Header & Action Bar:
  - Redesigned top navigation into a two-tier responsive layout on screens <= 768px.
  - Row 1 displays Brand, Quick Theme Toggle, Settings, and Primary "+ Nova Planta" CTA.
  - Row 2 provides a fluid action bar for Updates/Notifications, Guide & PWA, Install, and Gemini AI status.
  - Zero horizontal overflow on any smartphone display (tested down to 320px).

---

## [1.0.0] - 2026-08-13

### Added
- AI-Powered Plant Identification:
  - Multimodal plant recognition using Google Gemini 1.5 Flash Vision.
  - Automated extraction of common names, botanical/scientific names, watering volume (ml), sunlight exposure, fertilization suggestions (NPK, humus, bokashi), and health diagnostics.
  - Realistic botanical fallback simulation when API keys are not provided.
  - Real-time status indicators in Navbar and modals distinguishing between Live Gemini AI and Botanical Simulation Mode.
- Camera & Image Capture:
  - Live in-app camera capture with front/back camera toggle support.
  - File upload picker for existing gallery photos.
  - Dynamic image preview with re-take and replace capabilities.
- Garden Management Dashboard ("My Garden"):
  - Visual plant cards with hydrometer status indicators.
  - "Needs Water Today" dynamic alerting system based on watering intervals and timestamps.
  - 1-click watering action with animated confetti celebrations via `canvas-confetti`.
  - Delete and inspect plant details directly from the dashboard.
- Manual Registration & Full Editing:
  - Complete form override allowing users to adjust or fully register plant data without AI.
  - Editable fields for common name, scientific name, watering schedule, sunlight requirements, and notes.
- Local Storage & Privacy:
  - High-capacity photo and metadata storage using browser IndexedDB (`idb-keyval`).
  - Secure local storage of Gemini API keys directly in the client browser.
- Botanical Design System:
  - Custom responsive UI built with vanilla CSS tokens.
  - Modern iconography provided by `lucide-react`.
  - Accessible modal dialogs and smooth micro-interactions.
- PWA & Deployment Configurations:
  - Web App Manifest (`manifest.json`) for progressive web app compatibility.
  - Production deployment configs for Netlify (`_redirects`) and Vercel (`vercel.json`).
