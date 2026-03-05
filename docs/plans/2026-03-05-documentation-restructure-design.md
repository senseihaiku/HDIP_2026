# Documentation Restructure & Operations Model Verification

## Date: 2026-03-05

## Context

The HDIP prototype has accumulated several documentation files in the repo root (SPECIFICATION.md, Operations Model .docx, HDIP_Wiki.pdf, DASHBOARD_DESIGN_PLAN.md). The `/documentation` route points to a non-functional GitBook link. A complete `HDIP_Wiki.jsx` component exists but is not connected to the app. The Operations Model specifies platform functions that need verification.

## Decision

### 1. Replace `/documentation` with HDIP Wiki
- Import `HDIP_Wiki.jsx` into the app as the `/documentation` route
- Remove the GitBook placeholder `Documentation.jsx`
- Move `HDIP_Wiki.jsx` from repo root to `src/pages/`
- Wiki keeps its own inline styling, wrapped by the app's Layout (navbar + footer)

### 2. Move internal docs to `.claude/docs/`
- Move `SPECIFICATION.md`, `Operations Model - HDIP.docx`, `HDIP_Wiki.pdf`, `DASHBOARD_DESIGN_PLAN.md` to `.claude/docs/`
- These are internal reference files for Claude, not visible in the app
- `.claude/` is gitignored

### 3. Update CLAUDE.md
- Add references to `.claude/docs/` with file descriptions
- Document the workflow: identify problems -> GitHub issue -> subagents
- Note to use frontend-design skill for UI work

### 4. Playwright verification against Operations Model
Verify all functions from the Operations Model exist in the app:
- Metadata catalog with search/filter
- FAIR scoring system
- Access models (A2D, Data Behind Glass, Metadata-light)
- Roles (data-holder, data-user, admin)
- Pricing (membership tiers + service fees + FAIR discount)
- Dashboard functions (publish datasets, manage requests, bookmarks)
- Any gaps found -> create GitHub issues (do not fix directly)

## Workflow
- Problems are never fixed directly
- Issues are created on GitHub first
- Work is done via subagents on user command
