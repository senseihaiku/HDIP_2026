# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HDIP (Health Data Innovation Platform) is a React-based prototype for a health data metadata catalog. It connects data holders (healthcare institutions) with data users (researchers) while maintaining security via multiple access models. All data is client-side only — no backend, no external APIs. Data persists in localStorage, seeded from JSON files.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build
- `npm run lint` — ESLint (flat config, v9)
- `npm run preview` — Preview production build

No test framework is configured.

## Tech Stack

- **React 19** with JSX (no TypeScript)
- **Vite 7** with `@vitejs/plugin-react`
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (utility-first, no CSS modules)
- **React Router v7** for routing
- **React Context API** for state management (no Redux/Zustand)
- **localStorage** for data persistence

## Architecture

### State Management

Two context providers wrap the app in `App.jsx`:

- **AuthContext** (`src/context/AuthContext.jsx`) — manages `currentUser`, login/logout/register. localStorage keys: `hdip_currentUserId`, `hdip_users`
- **DataContext** (`src/context/DataContext.jsx`) — manages datasets, access requests, bookmarks. Provides `searchDatasets`, `addDataset`, `createRequest`, `updateRequestStatus`, `toggleBookmark`. localStorage keys: `hdip_datasets`, `hdip_requests`, `hdip_bookmarks`

### Routing

Routes are defined in `src/App.jsx`. Public pages use `<Layout>` (Navbar + Footer). Protected routes use `<ProtectedRoute allowedRoles={[...]}>`.

- Public: `/`, `/catalog`, `/catalog/:id`, `/login`, `/register`, `/pricing`, `/about`, `/access-models`, `/documentation`, `/providers`, `/providers/:id`
- Protected: `/dashboard/holder` and `/dashboard/holder/new` (data-holder, admin), `/dashboard/user` (data-user, admin)

### Data Models

Static seed data lives in `src/data/` as JSON files: `datasets.json`, `users.json`, `requests.json`, `pricing.json`. These are loaded into context on first run, then localStorage takes over.

Key entities: **Dataset** (with holder, FAIR score, access models, data standards, columns), **User** (with role: data-user/data-holder/admin, membership tier), **AccessRequest** (with status: pending/approved/denied).

### Utilities

- `src/utils/fairScore.js` — calculates FAIR scores (Findable/Accessible/Interoperable/Reusable, max 20 points) and provides label/color helpers
- `src/utils/search.js` — multi-field search and filtering with sorting support

### Demo Accounts

All passwords are `demo` (admin password is `admin`):
- `anna.lindberg@gu.se` — data-user
- `erik.nordstrom@vgregion.se` — data-holder
- `admin@hdip.se` — admin

## Conventions

- All UI text is in English
- Styling is pure Tailwind utility classes — no custom CSS files beyond the Tailwind import in `src/index.css`
- Catalog search state is URL-param-based for shareable filter states
- ESLint allows unused variables starting with uppercase or underscore
- `/documentation` route renders `src/pages/HDIPWiki.jsx` (inline-styled, not Tailwind) — the full HDIP project wiki

## Internal Reference Documents

Located in `.claude/docs/` (gitignored, for Claude's reference only):

- **SPECIFICATION.md** — Original build plan with page specs, data models, folder structure, and subagent strategy
- **Operations Model - HDIP.docx** — Business/operations model (Swedish) covering pricing, FAIR fund, roles, financing, access fee structure
- **HDIP_Wiki.pdf** — Project wiki PDF (mirrors the in-app wiki) with work packages, partners, use cases, key concepts, data catalogue
- **DASHBOARD_DESIGN_PLAN.md** — Dashboard UI improvement plan

When to consult these:
- **Spec** — when verifying if a feature should exist or understanding the original data model design
- **Operations Model** — when working on pricing, access models, roles, or business logic
- **Wiki** — when working on project content, partner info, work packages, or glossary terms

## Workflow Rules

- **Never fix problems directly.** Identify the issue, create a GitHub issue (`gh issue create`), then implement on user command.
- **Use subagents** for parallel independent work.
- **Use frontend-design skill** for all UI/component work.
- **Verify with Playwright MCP** before claiming features work.
