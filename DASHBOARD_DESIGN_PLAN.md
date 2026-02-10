# Dashboard Design Improvement — Implementation Plan

## Context
The current dashboards (HolderDashboard + UserDashboard) are functional but minimal —
plain tables and lists. This plan covers adding statistics, charts, visual polish,
and a cohesive design system across both dashboards.

---

## Design Principles (Design Agent Guidelines)

These principles apply to ALL agents working on dashboard components:

1. **Consistent spacing**: 24px section gaps, 16px card padding, 8px element gaps
2. **Color system**:
   - Primary: teal-600/700 (actions, highlights)
   - Success: green-500/600 (approved, positive metrics)
   - Warning: amber-500 (pending, attention)
   - Danger: red-500 (denied, critical)
   - Neutral: gray-50 background, gray-900 headings, gray-500 secondary text
3. **Card-based layout**: Every section in a rounded-lg bordered card with subtle shadow
4. **Charts**: Use lightweight SVG-based charts (no heavy libraries). Implement as React components.
5. **Responsive**: 1-column mobile, 2-column tablet, 3-4 column desktop for stat grids
6. **Animations**: Subtle transitions only — hover states, number count-ups are OK. No flashy effects.
7. **Typography**: Bold section headers (text-xl), medium card titles (text-sm font-semibold), regular body (text-sm)

---

## Shared Components to Create

### 1. StatCard (`src/components/dashboard/StatCard.jsx`)
A metric card showing:
- Icon (SVG, passed as prop or selected by type)
- Label (e.g. "Total Datasets")
- Value (large number)
- Trend indicator (optional: +12% or -3%, with green/red coloring)
- Compact size, used in a grid row of 3-4

### 2. MiniBarChart (`src/components/dashboard/MiniBarChart.jsx`)
A lightweight horizontal bar chart built with plain divs/SVG:
- Takes `data` array of `{ label, value, color? }`
- Renders horizontal bars with labels and values
- Used for: FAIR score distribution, category breakdown, access model distribution

### 3. DonutChart (`src/components/dashboard/DonutChart.jsx`)
A simple SVG donut/ring chart:
- Takes `segments` array of `{ label, value, color }`
- Center shows total or percentage
- Used for: request status breakdown, dataset status distribution

### 4. ActivityFeed (`src/components/dashboard/ActivityFeed.jsx`)
A timeline/feed of recent events:
- Each item: icon, text, timestamp
- Types: "New request received", "Request approved", "Dataset published"
- Shows last 5-10 events
- Computed from existing data (requests + datasets sorted by date)

### 5. FairScoreRadar (`src/components/dashboard/FairScoreRadar.jsx`)
A radar/spider chart showing F/A/I/R dimensions:
- SVG-based, 4 axes
- Fill area with semi-transparent teal
- Used on dataset detail and as aggregate on holder dashboard

---

## Data Holder Dashboard Redesign

### Layout (top to bottom):

```
┌─────────────────────────────────────────────────────────┐
│  Welcome header + org name                               │
├──────────┬──────────┬──────────┬──────────┐             │
│ StatCard │ StatCard │ StatCard │ StatCard │              │
│ Total DS │ Published│ Pending  │ Avg FAIR │              │
├──────────┴──────────┴──────────┴──────────┘             │
│                                                          │
├─────────────────────────┬────────────────────────────────┤
│ FAIR Score Distribution │ Datasets by Category           │
│ (MiniBarChart)          │ (DonutChart)                   │
├─────────────────────────┴────────────────────────────────┤
│                                                          │
│ My Datasets (existing table, enhanced with hover & sort) │
│                                                          │
├────────────────────────────┬─────────────────────────────┤
│ Access Requests            │ Recent Activity             │
│ (existing list, enhanced)  │ (ActivityFeed)              │
└────────────────────────────┴─────────────────────────────┘
```

### Stats to compute:
- **Total Datasets**: count of holder's datasets
- **Published**: count where status === 'published'
- **Pending Requests**: count of pending requests for holder's datasets
- **Average FAIR Score**: mean of fairScore.total across holder's datasets

### Charts:
- **FAIR Score Distribution**: MiniBarChart showing how many datasets fall in each
  FAIR bracket (Excellent/Good/Fair/Needs Improvement)
- **Datasets by Category**: DonutChart breaking down the holder's datasets by category
- **Access Model Usage**: Optional MiniBarChart showing which access models are offered

---

## Data User Dashboard Redesign

### Layout (top to bottom):

```
┌─────────────────────────────────────────────────────────┐
│  Welcome header + org name                               │
├──────────┬──────────┬──────────┬──────────┐             │
│ StatCard │ StatCard │ StatCard │ StatCard │              │
│ Total    │ Approved │ Pending  │ Catalog  │              │
│ Requests │          │          │ Size     │              │
├──────────┴──────────┴──────────┴──────────┘             │
│                                                          │
├─────────────────────────┬────────────────────────────────┤
│ Request Status Overview │ Recent Activity                │
│ (DonutChart)            │ (ActivityFeed)                 │
├─────────────────────────┴────────────────────────────────┤
│                                                          │
│ My Access Requests (enhanced table with better status)   │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ Recommended Datasets (existing, enhanced card design)    │
└──────────────────────────────────────────────────────────┘
```

### Stats to compute:
- **Total Requests**: count of user's access requests
- **Approved**: count where status === 'approved'
- **Pending**: count where status === 'pending'
- **Catalog Size**: total published datasets in the platform

### Charts:
- **Request Status**: DonutChart with pending/approved/denied segments
- **Recent Activity**: Timeline of the user's request status changes

---

## Subagent Strategy

### Agent 1: Design System Agent (research only)
- Reviews current component styling across the app
- Produces a design token reference (colors, spacing, typography)
- Creates guidelines document for other agents
- Does NOT write code — only produces the design spec

### Agent 2: Shared Dashboard Components
- Implements: StatCard, MiniBarChart, DonutChart, ActivityFeed, FairScoreRadar
- All pure presentational components with props
- Uses Tailwind + inline SVG only (no npm chart libraries)
- Tests each component renders without errors

### Agent 3: Holder Dashboard Redesign
- Rewrites HolderDashboard.jsx with the new layout
- Computes all statistics from existing data context
- Integrates shared components from Agent 2
- Preserves all existing functionality (table, approve/deny)

### Agent 4: User Dashboard Redesign
- Rewrites UserDashboard.jsx with the new layout
- Computes all statistics from existing data context
- Integrates shared components from Agent 2
- Preserves all existing functionality (requests table, recommendations)

### Execution order:
1. Agent 1 runs first (design spec)
2. Agent 2 runs after Agent 1 (uses design spec)
3. Agents 3 + 4 run in parallel after Agent 2 (both use shared components)
4. Final integration pass: build check, consistency review

---

## Branch Strategy

- New branch: `claude/dashboard-design-<session-suffix>` off current `claude/plan-react-page-tPbJd`
- All dashboard work committed there
- PR created when complete, targeting the main feature branch

---

## Out of Scope (for this iteration)
- Real-time data / WebSocket updates
- Dark mode
- Drag-and-drop dashboard customization
- Export to PDF/CSV
- Notification system

---

## Dependencies
- No new npm packages required
- All charts built with SVG + Tailwind
- All data from existing DataContext + mock JSON

---

*This plan is ready for execution. Awaiting approval to proceed.*
