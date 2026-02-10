# HDIP — Health Data Innovation Platform
## Specification & Build Plan

---

### Overview

HDIP is a functional prototype of a metadata catalog platform for health data sharing.
The platform enables **data holders** (regions, pharma, hospitals) to publish dataset metadata
and **data users** (researchers, innovators) to search, evaluate, and request access — without
ever exposing raw data.

The platform is built as a **skeleton first** — structure and navigation before polish.

---

### Target Users

| Role | Description | Key Actions |
|------|-------------|-------------|
| **Data Holder** | Owns health datasets (e.g. VGR, AstraZeneca) | Register datasets, manage metadata, review access requests |
| **Data User** | Researchers, innovators, SMEs | Search catalog, evaluate datasets, request access |
| **Admin** | HDIP platform operator | Manage users, oversee catalog quality, pricing |

---

### Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **React 18 + Vite** | Fastest setup, no SSR complexity needed for prototype |
| Routing | **React Router v6** | Multi-page with nested layouts |
| Styling | **Tailwind CSS** | Fast prototyping, easily replaceable later |
| State | **React Context + useReducer** | Simple, no external deps. Swap for Zustand/Redux later if needed |
| Mock Backend | **JSON files + localStorage** | No server needed for prototype. Structure ready for real API later |
| Auth | **Simulated auth (Context-based)** | Login/role switching without a real backend |
| Language | **English** | All UI text in English |

---

### Site Structure (Pages & Routes)

```
/                         → Landing page (what is HDIP, value proposition)
/login                    → Login page (select role: data holder / data user)
/register                 → Registration page

/catalog                  → Searchable metadata catalog (public, filterable)
/catalog/:id              → Dataset detail page (metadata, FAIR score, access info)

/dashboard                → Role-based dashboard (redirects based on user role)
  /dashboard/holder       → Data Holder: my datasets, access requests received
  /dashboard/user         → Data User: my requests, saved datasets
  /dashboard/holder/new   → Data Holder: register a new dataset

/pricing                  → Dynamic pricing page (membership + services)
/about                    → About HDIP, FAIR principles, team/partners
/access-models            → Explains A2D, Data Behind Glass, Metadata-light
```

---

### Page Specifications

#### 1. Landing Page (`/`)
- Hero section: one-liner + CTA buttons ("Explore Catalog" / "Share Your Data")
- Three value pillars: FAIR, Security, Collaboration
- How it works: 3-step flow diagram
- Quick stats (number of datasets, partners — from mock data)

#### 2. Login (`/login`)
- Email + password fields
- Role indicator (data holder / data user)
- Demo accounts pre-filled for easy testing

#### 3. Catalog (`/catalog`)
- **Search bar** with text search across dataset titles, descriptions, tags
- **Filter sidebar**: category, data holder, FAIR score range, access model
- **Results list**: card-based layout showing title, holder, description snippet, FAIR badge, access model tag
- **Sorting**: by relevance, date added, FAIR score
- Data loaded from a structured JSON mock file

#### 4. Dataset Detail (`/catalog/:id`)
- Full metadata display: title, description, holder, date range, record count, columns/fields
- FAIR score breakdown (F/A/I/R individually scored)
- Access model available (A2D / Data Behind Glass / Metadata-light)
- "Request Access" button (for logged-in data users)
- Contact info for data holder

#### 5. Data Holder Dashboard (`/dashboard/holder`)
- List of my published datasets with status
- Incoming access requests (approve/deny)
- Button to register new dataset

#### 6. Register New Dataset (`/dashboard/holder/new`)
- Form: title, description, category, tags, record count, column names
- Access model selection (A2D / Data Behind Glass / Metadata-light)
- Auto-calculated preliminary FAIR score based on completeness

#### 7. Data User Dashboard (`/dashboard/user`)
- My access requests with status (pending/approved/denied)
- Saved/bookmarked datasets
- Search history

#### 8. Pricing (`/pricing`)
- **Dynamic**: membership tiers + service fees rendered from a JSON config
- Toggle between academic/public and commercial pricing
- FAIR discount section
- Membership comparison table
- Service fee table

#### 9. About (`/about`)
- What is HDIP
- FAIR principles explained
- The team/partner ecosystem
- Funding model overview

#### 10. Access Models (`/access-models`)
- Algorithm-to-Data (A2D) — explanation + diagram
- Data Behind Glass — explanation + diagram
- Metadata-light — explanation + diagram

---

### Data Model (Mock JSON)

#### Dataset
```json
{
  "id": "ds-001",
  "title": "Regional Patient Flow Data 2019-2023",
  "description": "Anonymized patient flow statistics...",
  "holder": {
    "id": "org-vgr",
    "name": "Västra Götalandsregionen",
    "type": "public"
  },
  "category": "patient-flow",
  "tags": ["anonymized", "regional", "longitudinal"],
  "recordCount": 245000,
  "columns": ["patient_id_hash", "admission_date", "discharge_date", "department", "diagnosis_code"],
  "dateRange": { "from": "2019-01-01", "to": "2023-12-31" },
  "accessModels": ["a2d", "data-behind-glass"],
  "fairScore": { "findable": 4, "accessible": 3, "interoperable": 3, "reusable": 2, "total": 12 },
  "createdAt": "2025-06-15",
  "status": "published"
}
```

#### User
```json
{
  "id": "user-001",
  "email": "researcher@gu.se",
  "name": "Dr. Anna Lindberg",
  "role": "data-user",
  "organization": "Göteborgs Universitet",
  "membershipTier": "public"
}
```

#### Access Request
```json
{
  "id": "req-001",
  "datasetId": "ds-001",
  "requesterId": "user-001",
  "status": "pending",
  "purpose": "Longitudinal study on patient flow optimization",
  "accessModel": "a2d",
  "createdAt": "2025-09-01"
}
```

#### Pricing Config
```json
{
  "memberships": [
    { "tier": "public-partner", "label": "Public Partner (Region/University)", "price": 150000, "currency": "SEK", "includes": "Full metadata tools, 20h expert support" },
    { "tier": "strategic-partner", "label": "Strategic Partner (Large Corp)", "price": 350000, "currency": "SEK", "includes": "Steering group seat, priority Data Behind Glass queue" },
    { "tier": "sme-startup", "label": "SME / Start-up", "price": 25000, "currency": "SEK", "includes": "Ecosystem access, pay-per-use IT" }
  ],
  "services": [
    { "name": "Sandbox (Data Behind Glass)", "priceAcademic": 5000, "priceCommercial": 15000, "unit": "per month/environment" },
    { "name": "A2D Run (Standard)", "priceAcademic": 2000, "priceCommercial": 8000, "unit": "per batch/run" },
    { "name": "Legal/Ethical Validation", "priceAcademic": 1100, "priceCommercial": 1800, "unit": "per hour" },
    { "name": "Data Curation / FAIRification", "priceAcademic": 900, "priceCommercial": 1600, "unit": "per hour" }
  ],
  "discounts": [
    { "name": "Code Contribution", "percentage": 15, "condition": "Analysis algorithm made Open Source in HDIP library" },
    { "name": "Metadata Enrichment", "percentage": 10, "condition": "Project significantly improves dataset searchability" }
  ]
}
```

---

### Build Plan — Step by Step

Each step is an independent unit of work suitable for a subagent.

#### Phase 1: Scaffold & Foundation
| Step | Task | Details |
|------|------|---------|
| 1.1 | **Project setup** | Vite + React + React Router + Tailwind. Folder structure. |
| 1.2 | **Layout & navigation** | Shared layout with header/nav menu, footer. Role-aware nav items. |
| 1.3 | **Auth context** | Login/logout, role switching, protected routes. Mock users in JSON. |
| 1.4 | **Mock data files** | datasets.json, users.json, pricing.json, requests.json |

#### Phase 2: Core Pages
| Step | Task | Details |
|------|------|---------|
| 2.1 | **Landing page** | Hero, value props, how-it-works, quick stats |
| 2.2 | **Catalog page** | Search, filters, results grid, sorting. Reads from datasets.json |
| 2.3 | **Dataset detail page** | Full metadata view, FAIR score visualization, request access button |
| 2.4 | **Pricing page** | Dynamic rendering from pricing.json, academic/commercial toggle |

#### Phase 3: Dashboards & Interaction
| Step | Task | Details |
|------|------|---------|
| 3.1 | **Data Holder dashboard** | My datasets list, incoming requests |
| 3.2 | **Register dataset form** | Multi-field form with FAIR score preview |
| 3.3 | **Data User dashboard** | My requests, saved datasets |
| 3.4 | **Access request flow** | Request → pending → approve/deny cycle |

#### Phase 4: Info Pages & Polish
| Step | Task | Details |
|------|------|---------|
| 4.1 | **About page** | HDIP explanation, FAIR principles, ecosystem |
| 4.2 | **Access Models page** | A2D, Data Behind Glass, Metadata-light with visuals |
| 4.3 | **Login & Register pages** | Forms with demo account hints |
| 4.4 | **Responsive check & cleanup** | Ensure menu works on mobile, consistent spacing |

---

### Folder Structure

```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Router setup
├── index.css                 # Tailwind imports
│
├── components/               # Shared/reusable components
│   ├── Layout.jsx            # Header + nav + footer wrapper
│   ├── Navbar.jsx            # Navigation bar (role-aware)
│   ├── Footer.jsx
│   ├── SearchBar.jsx
│   ├── DatasetCard.jsx       # Card for catalog results
│   ├── FairBadge.jsx         # FAIR score visual indicator
│   ├── ProtectedRoute.jsx    # Auth guard
│   └── PricingTable.jsx      # Dynamic pricing renderer
│
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Catalog.jsx
│   ├── DatasetDetail.jsx
│   ├── Pricing.jsx
│   ├── About.jsx
│   ├── AccessModels.jsx
│   └── dashboard/
│       ├── HolderDashboard.jsx
│       ├── UserDashboard.jsx
│       └── NewDataset.jsx
│
├── context/
│   ├── AuthContext.jsx        # Auth state + login/logout
│   └── DataContext.jsx        # Datasets, requests, catalog state
│
├── data/                      # Mock data (JSON)
│   ├── datasets.json
│   ├── users.json
│   ├── pricing.json
│   └── requests.json
│
└── utils/
    ├── fairScore.js           # FAIR score calculation helpers
    └── search.js              # Search/filter logic
```

---

### Subagent Strategy

To build efficiently, we will use **parallel subagents** for independent steps:

**Batch 1** (can run in parallel):
- Agent A: Project scaffold (Vite + React + Router + Tailwind + folder structure)
- Agent B: Create all mock data JSON files

**Batch 2** (can run in parallel after Batch 1):
- Agent C: Layout, Navbar, Footer, ProtectedRoute
- Agent D: Auth context + Login/Register pages

**Batch 3** (can run in parallel after Batch 2):
- Agent E: Catalog page + search/filter + DatasetCard + FairBadge
- Agent F: Pricing page + PricingTable component
- Agent G: Landing page + About page + Access Models page

**Batch 4** (can run in parallel after Batch 3):
- Agent H: Data Holder dashboard + New Dataset form
- Agent I: Data User dashboard + Access Request flow

**Batch 5** (sequential):
- Agent J: Integration pass — wire everything together, fix imports, verify routing

---

### Out of Scope (for now)
- Real backend / database
- Real authentication (OAuth, JWT)
- Sandbox execution environment
- File upload
- Notifications / email
- Internationalization (i18n)
- Accessibility audit (basic a11y will be followed)

---

*This specification is the contract for what we build. Once approved, subagents execute the plan.*
