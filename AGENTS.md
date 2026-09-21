# Canto Alegre - Guia para Agentes de Codigo

Orientacoes e padroes de arquitetura para agentes e assistentes de IA que operam neste repositorio.

## Diretrizes Gerais
- **Zero Emojis**: Nao utilize emojis em textos de interface, titulos, codigo ou documentacao. Utilize icones vetoriais da biblioteca `lucide-react` ou tipografia limpa.
- **Arquitetura Offline-First**: O aplicativo e um PWA com persistencia local via IndexedDB (`idb-keyval`) e Service Worker nativo (`public/sw.js`). Qualquer nova funcionalidade deve respeitar a resiliencia offline.
- **Design System & Temas**: O sistema possui dois modos visuais (Escuro e Claro) configurados atraves de variaveis CSS sob `[data-theme="dark"]` e `[data-theme="light"]` no arquivo `src/styles/index.css`.
- **Integridade da Build**: Qualquer alteracao deve compilar perfeitamente com `npm run build` antes de ser concluida.

## Agent skills

### Issue tracker

Issues e especificacoes locais em markdown sob `.scratch/<feature>/`. Veja `docs/agents/issue-tracker.md`.

### Domain docs

Estrutura de contexto unico (`CONTEXT.md` na raiz e ADRs em `docs/adr/`). Veja `docs/agents/domain.md`.
