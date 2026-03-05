# Documentation Restructure & Operations Model Verification — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the broken GitBook documentation page with the HDIP Wiki component, organize internal docs, update CLAUDE.md, and verify the app against the Operations Model — creating GitHub issues for any gaps found.

**Architecture:** Move `HDIP_Wiki.jsx` into `src/pages/`, swap it into the `/documentation` route in `App.jsx`, delete the old placeholder. Internal docs go to `.claude/docs/`. Playwright MCP runs a full verification pass against the Operations Model's feature list.

**Tech Stack:** React 19, React Router v7, Playwright MCP, GitHub CLI (`gh`)

---

### Task 1: Move HDIP Wiki into src/pages

**Files:**
- Move: `HDIP_Wiki.jsx` → `src/pages/HDIPWiki.jsx`
- Delete: `src/pages/Documentation.jsx`

**Step 1: Move the file**

```bash
mv HDIP_Wiki.jsx src/pages/HDIPWiki.jsx
```

**Step 2: Delete the old Documentation placeholder**

```bash
rm src/pages/Documentation.jsx
```

**Step 3: Commit**

```bash
git add -A
git commit -m "refactor: move HDIP Wiki to src/pages, remove GitBook placeholder"
```

---

### Task 2: Wire HDIPWiki into the router

**Files:**
- Modify: `src/App.jsx:16` (change import)
- Modify: `src/App.jsx:47` (change route element)

**Step 1: Update import**

Change line 16 from:
```jsx
import Documentation from './pages/Documentation';
```
to:
```jsx
import HDIPWiki from './pages/HDIPWiki';
```

**Step 2: Update route**

Change line 47 from:
```jsx
<Route path="/documentation" element={<Documentation />} />
```
to:
```jsx
<Route path="/documentation" element={<HDIPWiki />} />
```

**Step 3: Verify the dev server compiles without errors**

```bash
npm run dev
```

Visit `http://localhost:5173/documentation` — should show the full HDIP Wiki with search, sections, partners, etc.

**Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: replace documentation route with HDIP Wiki"
```

---

### Task 3: Move internal docs to .claude/docs/

**Files:**
- Move: `SPECIFICATION.md` → `.claude/docs/SPECIFICATION.md`
- Move: `Operations Model - HDIP.docx` → `.claude/docs/Operations Model - HDIP.docx`
- Move: `HDIP_Wiki.pdf` → `.claude/docs/HDIP_Wiki.pdf`
- Move: `DASHBOARD_DESIGN_PLAN.md` → `.claude/docs/DASHBOARD_DESIGN_PLAN.md`
- Modify: `.gitignore` (add `.claude/docs/`)

**Step 1: Create directory and move files**

```bash
mkdir -p .claude/docs
mv SPECIFICATION.md ".claude/docs/SPECIFICATION.md"
mv "Operations Model - HDIP.docx" ".claude/docs/Operations Model - HDIP.docx"
mv HDIP_Wiki.pdf ".claude/docs/HDIP_Wiki.pdf"
mv DASHBOARD_DESIGN_PLAN.md ".claude/docs/DASHBOARD_DESIGN_PLAN.md"
```

**Step 2: Add .claude/docs/ to .gitignore**

Add to `.gitignore`:
```
# Claude internal docs
.claude/docs/
```

**Step 3: Commit the removals and gitignore update**

Note: The moved files will show as deleted in git (since .claude/docs/ is now ignored). This is correct — these files are internal reference only.

```bash
git add -A
git commit -m "chore: move internal docs to .claude/docs/, gitignore them"
```

---

### Task 4: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add internal docs section and workflow rules**

Append after the "Conventions" section:

```markdown
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
- **Use subagents** for parallel independent work via `superpowers:dispatching-parallel-agents` or `superpowers:subagent-driven-development`.
- **Use frontend-design skill** for all UI/component work.
- **Verify with Playwright MCP** before claiming features work.
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with internal docs references and workflow rules"
```

---

### Task 5: Playwright verification against Operations Model

**Files:** None modified — this is a verification task that creates GitHub issues.

**What to verify** (from Operations Model):

| # | Feature | Where to check | How to verify |
|---|---------|----------------|---------------|
| 1 | Metadata catalog with search | `/catalog` | Type in search, apply filters, verify results update |
| 2 | FAIR scoring display | `/catalog/:id` | Check FAIR badge shows F/A/I/R breakdown |
| 3 | A2D access model | `/access-models`, `/catalog/:id` | Verify A2D is explained and selectable in request flow |
| 4 | Data Behind Glass access model | `/access-models`, `/catalog/:id` | Same |
| 5 | Metadata-light access model | `/access-models`, `/catalog/:id` | Same |
| 6 | Data holder role + dashboard | `/dashboard/holder` | Login as `erik.nordstrom@vgregion.se` / `demo`, check dashboard |
| 7 | Data user role + dashboard | `/dashboard/user` | Login as `anna.lindberg@gu.se` / `demo`, check dashboard |
| 8 | Admin role | Login as `admin@hdip.se` / `admin` | Verify admin can access both dashboards |
| 9 | Publish new dataset | `/dashboard/holder/new` | Fill form, submit, verify it appears in catalog |
| 10 | Access request flow | `/catalog/:id` → request | Submit request as data-user, verify it shows on holder dashboard |
| 11 | Approve/deny requests | `/dashboard/holder` | Approve or deny a pending request |
| 12 | Bookmarks | `/catalog/:id` | Toggle bookmark, verify in user dashboard |
| 13 | Pricing tiers | `/pricing` | Verify 3 membership tiers match Operations Model |
| 14 | Service fees | `/pricing` | Verify 4 service types with academic/commercial prices |
| 15 | FAIR discount | `/pricing` | Verify discount section exists |
| 16 | Documentation/Wiki | `/documentation` | Verify wiki loads with all 6 sections |

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Use Playwright MCP to navigate and verify each feature**

For each row in the table above, use `browser_navigate`, `browser_snapshot`, `browser_click`, `browser_fill_form` etc. to verify the feature exists and works.

**Step 3: For each gap found, create a GitHub issue**

```bash
gh issue create --title "Missing: [feature description]" --body "## From Operations Model\n\n[Description of what should exist]\n\n## Current State\n\n[What is missing or broken]\n\n## Acceptance Criteria\n\n- [ ] [Specific criteria]"
```

**Step 4: Report summary of findings**

List all issues created and all features verified as working.

---

## Execution Order

Tasks 1-2 are sequential (wiki must be moved before wiring).
Task 3 is independent of 1-2.
Task 4 depends on Task 3 (needs to reference .claude/docs/).
Task 5 depends on Tasks 1-2 (wiki must be wired before verifying).

```
Task 1 → Task 2 ──→ Task 5
Task 3 → Task 4      ↑
                      │
         (after 1-2 and 3-4 are done)
```
