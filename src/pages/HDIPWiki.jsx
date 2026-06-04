import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Palette — aligned with the HDIP platform (teal + slate neutrals)   */
/* ------------------------------------------------------------------ */
const C = {
  font: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  ink: "#0f172a", // slate-900 headings
  body: "#334155", // slate-700 body
  muted: "#64748b", // slate-500 labels
  border: "#e2e8f0", // slate-200
  pageBg: "#f8fafc", // slate-50
  card: "#ffffff",
  teal: "#0d9488", // teal-600 primary
  tealDark: "#0f766e", // teal-700
  tealDeep: "#134e4a", // teal-900 header / dark surfaces
  tealTint: "#f0fdfa", // teal-50 light surfaces
  tealTintBorder: "#99f6e4", // teal-200
  tealOnDark: "#5eead4", // teal-300 accent on dark
  tealSoftOnDark: "rgba(204, 251, 241, 0.85)", // teal-100-ish on dark
};

const wikiData = {
  project: {
    title: "Health Data Innovation Platform (HDIP)",
    tagline: "Enabling safe, secondary use of health data for innovation",
    overview: `HDIP is a data-driven lab for the Swedish healthcare community, funded by Vinnova and running from October 2023 to October 2026. The project establishes processes, methods, and tools for sharing health data from healthcare providers, national registries, and life science companies — safely and accessibly — to drive innovation and improve health outcomes.

The core deliverable is the HDIP Operating Model: a structured framework defining how the data lab functions in practice, covering governance, policy compliance, and privacy-preserving technologies.`,
    keyFacts: [
      { label: "Duration", value: "October 2023 – October 2026" },
      { label: "Coordinator", value: "Chalmers Industriteknik (CIT)", link: "https://chalmersindustriteknik.se" },
      { label: "Funder", value: "Vinnova", link: "https://www.vinnova.se/en/" },
      { label: "Main deliverable", value: "HDIP Operating Model" },
      { label: "Work packages", value: "5 (WP1–WP5)" },
    ],
  },

  workPackages: [
    {
      id: "WP1",
      name: "Project Coordination",
      lead: "Chalmers Industriteknik",
      status: "Completed",
      description:
        "Coordinates all project management including governance, administration, risk management, and reporting to Vinnova. Manages WP Leader Meetings (every four weeks) and Workshop Meetings when WPs complete deliverables.",
      deliverables: ["MS1.1 – Project Start – Completed", "MS1.2 – Mid-project report – Completed", "MS1.3 – Final Report – Completed"],
    },
    {
      id: "WP2",
      name: "Governance & Operations",
      lead: "Anders Segerlund, Chalmers Industriteknik",
      status: "Completed",
      description:
        "Sets up governance processes for the HDIP data catalog, data sourcing, and data requests. Operationalizes the FAIR principles for health data management. Leads the compilation of the final Operating Model by integrating outputs from WP3 and WP4.",
      deliverables: [
        "Landscape Report (FAIR Framework) – Completed",
        "Handbook Version 1 – Completed",
        "Proposed Operating Model structure – Completed",
        "Handbook Version 2 – Completed",
        "Final HDIP Operating Model – Completed",
      ],
    },
    {
      id: "WP3",
      name: "Policy & Regulations",
      lead: "Susanne Stenberg, RISE",
      status: "Completed",
      description:
        "Defines legal, ethical, and policy requirements for HDIP. Focuses on the European Health Data Space (EHDS), GDPR compliance, data access governance, and the role of Health Data Access Bodies. Provides the regulatory framework that informs WP2 and WP4.",
      deliverables: [
        "Landscape Report (EHDS focus) – Completed",
        "Handbook Version 1 – Completed",
        "Handbook Version 2 – Completed",
      ],
    },
    {
      id: "WP4",
      name: "Privacy-Protecting, Privacy-Enhancing & Synthetic Data (PP/PE/SYN)",
      lead: "Magnus Kjellberg, VGR",
      status: "Completed",
      description:
        "Defines, develops, and tests AI techniques for privacy protection, privacy enhancement, privacy risk identification, and synthetic data generation. Enables safe, secondary access to health data using techniques such as federated learning, differential privacy, and synthetic data.",
      deliverables: [
        "Academic use case collaboration with Chalmers – Completed",
        "Landscape Report – Completed",
        "Handbook Version 1 – Completed",
        "Handbook Version 2 – Completed",
      ],
    },
    {
      id: "WP5",
      name: "Communication & Dissemination",
      lead: "Chalmers Industriteknik",
      status: "Completed",
      description:
        "Coordinates external communication and dissemination of project results. Manages the project LinkedIn page, events, and publications. Aims to connect HDIP outcomes with the Digital Health Arena (DHA) and broader national/international audiences.",
      deliverables: [
        "DHA Pre-Launch event – Completed",
        "Dagar om Lagar event – Completed",
        "Public Event – Completed",
      ],
    },
  ],

  partners: [
    {
      name: "Chalmers Industriteknik (CIT)",
      role: "Coordinator",
      type: "core",
      url: "https://chalmersindustriteknik.se",
      description:
        "Research organisation coordinating the project. Leads WP1, WP2, and WP5. Contributes expertise in Data Science, AI, innovation management, and data-driven lab development.",
      keyPeople: ["Jonathan Converse (Content Lead)", "Henrik Mindedal (Incoming Coordinator, WP1 & WP5 Lead)", "Anders Segerlund (WP2 Lead)"],
    },
    {
      name: "Västra Götalandsregionen (VGR)",
      role: "Data Provider & WP4 Lead",
      type: "core",
      url: "https://www.vgregion.se",
      description:
        "Large regional healthcare provider and holder of clinical and patient data. Leads WP4 and contributes expertise in data governance, privacy-preserving techniques, and secure research environments.",
      keyPeople: ["Magnus Kjellberg (WP4 Lead)"],
    },
    {
      name: "RISE Research Institutes of Sweden",
      role: "Policy Expert & WP3 Lead",
      type: "core",
      url: "https://www.ri.se/en",
      description:
        "Leads WP3, providing expertise in EU legislation, GDPR, EHDS, and data privacy regulations. Also contributes technical expertise in privacy-preserving techniques for health data.",
      keyPeople: ["Susanne Stenberg (WP3 Lead)", "Rickard Brännvall (WP4 Contributor)"],
    },
    {
      name: "AstraZeneca",
      role: "Data Provider & Reference Group",
      type: "core",
      url: "https://www.astrazeneca.com",
      description:
        "Global life science company providing access to proprietary data assets and the industrial use case. Critical partner for validating the governance and policy frameworks from an industry perspective.",
      keyPeople: ["Per Hillertz (Reference Group)"],
    },
    {
      name: "AI Sweden (Lindholmen Science Park)",
      role: "Technical Expert",
      type: "supporting",
      url: "https://www.ai.se/en",
      description:
        "Provides expertise in privacy-preserving AI techniques and access to networks related to health data usage. Contributes to WP4.",
      keyPeople: ["Fazeleh Hoseini (WP4 Contributor)"],
    },
    {
      name: "Chalmers University of Technology",
      role: "Reference Group & Use Case Owner",
      type: "supporting",
      url: "https://www.chalmers.se/en/",
      description:
        "Owns the academic use case: developing AI-based image analysis for early detection and treatment monitoring of lung cancer, led by Ida Häggström.",
      keyPeople: ["Ida Häggström (Use Case 1 Owner)"],
    },
    {
      name: "Göteborgs Universitet / SND",
      role: "Reference Group",
      type: "supporting",
      url: "https://snd.se/en",
      description:
        "Swedish National Data Service. Contributes expertise on FAIR use of research data and data discovery, including metadata cataloging and DOI registration.",
      keyPeople: ["Elisabeth Strandhagen", "Johan Fihn Malmberg", "Sara Svensson"],
    },
    {
      name: "GoCo Development AB & Vectura Fastigheter",
      role: "Cluster Development",
      type: "supporting",
      url: "https://www.gocohealth.com",
      description:
        "Property and innovation cluster development partner for GoCo Health Innovation City. Supports dissemination and community development activities.",
      keyPeople: ["Britta Stensson (Reference Group)"],
    },
    {
      name: "SafeSpring",
      role: "Secure Infrastructure Partner (WP2 & WP5)",
      type: "supporting",
      url: "https://www.safespring.com",
      description:
        "Swedish provider of secure, GDPR-compliant cloud infrastructure. As the technology partner supplying data infrastructure for AI use and for research and educational organisations, SafeSpring joins WP2 (Governance & Operations) so the project can understand how a provider of this kind would operate and maintain the platform together with a partner over time, and how it fits their existing pricing and business model. Through WP5 (Communication & Dissemination), SafeSpring helps provide, document, and disseminate these results to other organisations via articles, seminars, and related activities.",
    },
  ],

  useCases: [
    {
      name: "Academic Use Case – Lung Cancer AI",
      owner: "Chalmers University of Technology / VGR",
      status: "In progress",
      description:
        "Develops AI-based image analysis methods for early detection, prognosis, and treatment monitoring of lung cancer. Led by Ida Häggström. Represents the academic and public healthcare perspective and is being used to validate and iterate the WP2, WP3, and WP4 handbooks.",
    },
    {
      name: "Industrial Use Case – AstraZeneca",
      owner: "AstraZeneca",
      status: "Pending",
      description:
        "Expected to provide the industrial perspective on health data sharing and governance. Critical dependency for completing Handbook Version 2 across all WPs, especially WP3 (policy) and WP4 (privacy). Will enable the HDIP Operating Model to function as a model for both public and industrial use.",
    },
  ],

  concepts: [
    {
      term: "FAIR Principles",
      short: "Findable, Accessible, Interoperable, Reusable",
      description:
        "The foundational framework for HDIP's approach to data management. FAIR data can be found by humans and machines, accessed under clear conditions, combined with other datasets, and reused for future research. A FAIR Score (0–100%) measures compliance and can influence data pricing and licensing.",
      link: "https://www.go-fair.org/fair-principles/",
      subprinciples: [
        "F: Globally unique & persistent identifiers; rich metadata; indexed in searchable resources",
        "A: Standard communication protocols; metadata persists even if data is unavailable",
        "I: Formal, machine-readable knowledge representation; FAIR vocabularies; qualified references",
        "R: Rich attributes; clear license; detailed provenance; domain-relevant standards",
      ],
    },
    {
      term: "HDIP Operating Model",
      short: "The main project deliverable",
      description:
        "A structured set of practices and principles for collaboration, communication, and automation of data processes to support the secondary use of health data. The Operating Model integrates governance (WP2), policy (WP3), and privacy-preserving technologies (WP4) into a single operational framework. It is compiled by WP2 from all three workstreams.",
    },
    {
      term: "Algorithm-to-Data (A2D)",
      short: "Bring the analysis to the data, not the data to the analyst",
      description:
        "Instead of moving sensitive health data to an analyst, the algorithm is sent to the data environment where it runs locally. Only aggregated or anonymised results are returned. This preserves data sovereignty and reduces leakage risk. A2D can be implemented via Docker containers, Jupyter Notebooks, API endpoints, or sandboxed environments.",
    },
    {
      term: "Data Behind Glass",
      short: "Controlled access without data leaving its environment",
      description:
        "A design pattern where sensitive data is isolated in a secure infrastructure. Only approved algorithms or analysis modules may enter the environment, and all computation runs inside it. Results — never raw data — leave the environment. Can be combined with Zero-Knowledge Validation for added cryptographic assurance.",
    },
    {
      term: "Federated Validation",
      short: "Distributed quality checks without centralising data",
      description:
        "Multiple data owners each run the same validation algorithm locally on their own data. Only aggregated results are shared. This builds a collective picture of data quality and structure across organisations without centralising raw data. Enables iterative FAIRification through repeated cycles of validation and improvement.",
    },
    {
      term: "Zero-Knowledge Validation (ZKV)",
      short: "Prove data quality without revealing the data",
      description:
        "A cryptographic method allowing a data owner to prove that their dataset meets specific criteria — such as correct coding standards or absence of null values — without revealing the underlying data. Replaces manual assurances with mathematical guarantees, enabling scalable trust in federated health data ecosystems.",
    },
    {
      term: "Trusted Research Environment (TRE)",
      short: "Secure workspace for sensitive data analysis",
      description:
        "A controlled IT environment where analysts are granted time-limited, monitored access to work with sensitive data without being able to download raw data. All activity is logged. VGR's Secure Research Environment (SFM) and synergies with TRE4HealthAI are key infrastructure references for HDIP.",
    },
    {
      term: "European Health Data Space (EHDS)",
      short: "EU framework for cross-border health data access",
      description:
        "An EU initiative enabling cross-border access to and use of health data for care, research, and policy. EHDS is the primary regulatory and standards context for WP3. HDIP is designed to be EHDS-compatible, using HDCAT-AP metadata standards and aligning with EHDS ontologies wherever possible.",
      link: "https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space_en",
    },
    {
      term: "FAIR4Health",
      short: "FAIR principles adapted for health data",
      description:
        "An extension of the GO FAIR process tailored to the specific constraints of healthcare data — including GDPR, HIPAA, pseudonymisation requirements, and clinical coding standards (HL7 FHIR, OMOP CDM, SNOMED CT). Adds steps for data curation, de-identification, versioning, and staged publishing to the standard FAIRification workflow.",
    },
    {
      term: "Metadata & Data Catalogue",
      short: "Making data findable without sharing it",
      description:
        "Metadata is the primary enabler of FAIR compliance when raw data cannot be freely shared. HDIP uses a two-level approach: preliminary metadata (lightweight overview) and FAIR-specific metadata (detailed, structured, standards-aligned). The HDIP Data Catalogue is a demonstrator mock-up showing how datasets would be described and discovered on the platform.",
    },
  ],

  dataCatalogue: {
    description:
      "HDIP is developing a Data Catalogue demonstrator to illustrate how datasets would be registered, described, and discovered on the platform. It uses a Knowledge Graph layer on top of catalog infrastructure to enable semantic discovery, lineage tracing, and schema harmonisation.",
    dataTypes: [
      "Clinical data (EHRs) — VGR, AZ",
      "Genomic data — VGR, AZ",
      "Medical imaging (X-ray, MRI, CT) — VGR, AZ",
      "Wearable device data — VGR, AZ",
      "Patient-reported outcomes — VGR",
      "Omics data — VGR, AZ",
      "Social & environmental data — SND",
      "Drug & treatment data — VGR, AZ",
      "Population & demographic data — SND",
      "Ethical & consent data — VGR, AZ",
    ],
  },
};

const NAV_ITEMS = [
  { id: "project", label: "Project Overview" },
  { id: "workPackages", label: "Work Packages" },
  { id: "partners", label: "Partners" },
  { id: "useCases", label: "Use Cases" },
  { id: "concepts", label: "Key Concepts" },
  { id: "dataCatalogue", label: "Data Catalogue" },
];

const StatusBadge = ({ status }) => {
  const colors = {
    Completed: "bg-emerald-100 text-emerald-800",
    "In progress": "bg-teal-100 text-teal-800",
    "Not started": "bg-gray-100 text-gray-500",
    Ongoing: "bg-teal-200 text-teal-900",
    Pending: "bg-amber-100 text-amber-800",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

/* Small ↗ glyph for external links */
const ExtArrow = () => (
  <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "inline", verticalAlign: "baseline", marginLeft: 3, opacity: 0.7 }}>
    <path d="M7 17L17 7M17 7H8M17 7v9" />
  </svg>
);

/* External link styled with Tailwind so it gets a proper hover state */
const ExtLink = ({ href, children, className = "" }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => e.stopPropagation()}
    className={`text-teal-700 hover:text-teal-900 underline decoration-teal-300 hover:decoration-teal-500 decoration-1 underline-offset-2 transition-colors ${className}`}
  >
    {children}
    <ExtArrow />
  </a>
);

export default function HDIPWiki() {
  const [activeSection, setActiveSection] = useState("project");
  const [expandedConcept, setExpandedConcept] = useState(null);
  const [expandedWP, setExpandedWP] = useState(null);
  const [expandedPartner, setExpandedPartner] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const allSearchable = [
    ...wikiData.concepts.map((c) => ({ ...c, section: "concepts", label: c.term })),
    ...wikiData.workPackages.map((w) => ({ ...w, section: "workPackages", label: w.id + " – " + w.name })),
    ...wikiData.partners.map((p) => ({ ...p, section: "partners", label: p.name })),
    ...wikiData.useCases.map((u) => ({ ...u, section: "useCases", label: u.name })),
  ];

  const searchResults = searchQuery.trim().length > 1
    ? allSearchable.filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  /* Renders a partner name, linked to the partner's website when available */
  const PartnerHeading = ({ p, fontSize }) => (
    <h3 style={{ margin: "0 0 4px", fontSize, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>
      {p.url ? <ExtLink href={p.url}>{p.name}</ExtLink> : p.name}
    </h3>
  );

  return (
    <div style={{ fontFamily: C.font, background: C.pageBg, minHeight: "100vh", color: C.body }}>
      {/* Header */}
      <header
        style={{
          background: `linear-gradient(135deg, ${C.tealDark} 0%, ${C.tealDeep} 100%)`,
          color: "#ffffff",
          padding: "2.75rem 2rem 1.75rem",
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.tealOnDark, fontWeight: 600 }}>
              HDIP Project Wiki
            </span>
            <span style={{ color: C.tealSoftOnDark, fontSize: 12, padding: "2px 8px", borderRadius: 999, background: "rgba(255,255,255,0.1)" }}>
              v1.0 · 2026
            </span>
          </div>
          <h1 style={{ margin: "0.6rem 0 0.35rem", fontSize: "clamp(1.5rem, 3.2vw, 2.15rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Health Data Innovation Platform
          </h1>
          <p style={{ margin: 0, color: C.tealSoftOnDark, fontSize: 14.5, fontWeight: 500 }}>
            A Vinnova-funded project · October 2023 – October 2026
          </p>
          {/* Search */}
          <div style={{ marginTop: "1.4rem", position: "relative", maxWidth: 420 }}>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the wiki…"
              style={{
                width: "100%",
                padding: "0.6rem 1rem",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.1)",
                color: "#ffffff",
                fontFamily: C.font,
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {searchResults.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
                background: "#ffffff", border: `1px solid ${C.border}`, borderRadius: 8,
                zIndex: 99, boxShadow: "0 12px 32px rgba(15, 23, 42, 0.18)", overflow: "hidden",
              }}>
                {searchResults.map((r, i) => (
                  <button key={i}
                    onClick={() => { setActiveSection(r.section); setSearchQuery(""); }}
                    style={{
                      display: "block", width: "100%", textAlign: "left", padding: "0.65rem 1rem",
                      background: "none", border: "none", cursor: "pointer",
                      fontFamily: C.font, fontSize: 13, borderBottom: `1px solid ${C.border}`,
                    }}>
                    <span style={{ color: C.ink, fontWeight: 600 }}>{r.label}</span>
                    <span style={{ marginLeft: 8, fontSize: 11, color: C.teal, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                      {r.section}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav style={{ background: C.tealDeep, borderBottom: `1px solid rgba(255,255,255,0.08)`, overflowX: "auto", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", gap: 0 }}>
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              style={{
                padding: "0.85rem 1.25rem",
                background: "none",
                border: "none",
                borderBottom: activeSection === item.id ? `2px solid ${C.tealOnDark}` : "2px solid transparent",
                color: activeSection === item.id ? "#ffffff" : "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontFamily: C.font,
                fontSize: 13.5,
                fontWeight: activeSection === item.id ? 600 : 500,
                whiteSpace: "nowrap",
                transition: "color 0.15s",
              }}>
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 980, margin: "0 auto", padding: "2.25rem 1.5rem 3rem" }}>

        {/* PROJECT OVERVIEW */}
        {activeSection === "project" && (
          <div>
            <h2 style={styles.sectionTitle}>Project Overview</h2>
            <div style={styles.prose}>{wikiData.project.overview.split("\n\n").map((p, i) => <p key={i} style={{ marginTop: i === 0 ? 0 : "1rem" }}>{p}</p>)}</div>
            <div style={styles.factBox}>
              {wikiData.project.keyFacts.map((f) => (
                <div key={f.label} style={styles.factRow}>
                  <span style={styles.factLabel}>{f.label}</span>
                  <span style={styles.factValue}>
                    {f.link ? <ExtLink href={f.link}>{f.value}</ExtLink> : f.value}
                  </span>
                </div>
              ))}
            </div>
            <h3 style={styles.subTitle}>Operating Model Compilation Process</h3>
            <p style={styles.body}>
              Each of WP2, WP3, and WP4 works in parallel through four stages: <strong style={{ color: C.ink }}>Landscape Report → Handbook v1 → Use Case Validation → Handbook v2.</strong> WP2 then integrates all three streams into the final HDIP Operating Model. The project uses real-world use cases from Chalmers University (academic) and AstraZeneca (industry) to validate and iterate the handbooks before final compilation.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
              {["WP2: Governance", "WP3: Policy", "WP4: Privacy"].map((wp) => (
                <div key={wp} style={{ flex: "1 1 180px", background: C.tealTint, borderRadius: 10, padding: "1rem 1.1rem", border: `1px solid ${C.tealTintBorder}` }}>
                  <div style={{ fontSize: 11, color: C.teal, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Stream</div>
                  <div style={{ fontWeight: 700, color: C.ink, fontSize: 15 }}>{wp}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Landscape → HB v1 → Use Case → HB v2</div>
                </div>
              ))}
              <div style={{ flex: "1 1 180px", background: `linear-gradient(135deg, ${C.tealDark}, ${C.tealDeep})`, borderRadius: 10, padding: "1rem 1.1rem" }}>
                <div style={{ fontSize: 11, color: C.tealOnDark, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Output</div>
                <div style={{ fontWeight: 700, color: "#ffffff", fontSize: 15 }}>HDIP Operating Model</div>
                <div style={{ fontSize: 12, color: C.tealSoftOnDark, marginTop: 6 }}>Compiled by WP2</div>
              </div>
            </div>
          </div>
        )}

        {/* WORK PACKAGES */}
        {activeSection === "workPackages" && (
          <div>
            <h2 style={styles.sectionTitle}>Work Packages</h2>
            {wikiData.workPackages.map((wp) => (
              <div key={wp.id} style={styles.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}
                  onClick={() => setExpandedWP(expandedWP === wp.id ? null : wp.id)}
                  className="cursor-pointer">
                  <div>
                    <span style={{ fontSize: 11, color: C.teal, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>{wp.id}</span>
                    <h3 style={{ margin: "3px 0 4px", fontSize: 18, fontWeight: 700, color: C.ink }}>{wp.name}</h3>
                    <div style={{ fontSize: 13, color: C.muted }}>Lead: {wp.lead}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <StatusBadge status={wp.status} />
                    <span style={{ color: C.muted, fontSize: 14 }}>{expandedWP === wp.id ? "▲" : "▼"}</span>
                  </div>
                </div>
                <p style={{ ...styles.body, marginTop: 10 }}>{wp.description}</p>
                {expandedWP === wp.id && (
                  <div style={{ marginTop: 14, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                    <div style={styles.kicker}>Deliverables</div>
                    {wp.deliverables.map((d, i) => {
                      const status = d.includes("Completed") ? "Completed" : d.includes("In progress") ? "In progress" : d.includes("Not started") ? "Not started" : d.includes("Planned") ? "Pending" : null;
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, fontSize: 13.5, color: C.body }}>
                          <span style={{ color: status === "Completed" ? C.teal : C.muted }}>{status === "Completed" ? "✓" : status === "In progress" ? "◑" : "○"}</span>
                          <span>{d.replace(/ – (Completed|In progress|Not started|Planned)/, "")}</span>
                          {status && <StatusBadge status={status} />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* PARTNERS */}
        {activeSection === "partners" && (
          <div>
            <h2 style={styles.sectionTitle}>Project Partners</h2>
            <p style={styles.body}>The consortium spans healthcare providers, research institutes, a life science company, and innovation clusters — together covering governance, policy, and technical privacy expertise. Partner names link to each organisation's website.</p>
            <h3 style={styles.subTitle}>Core Partners</h3>
            {wikiData.partners.filter(p => p.type === "core").map((p) => (
              <div key={p.name} style={styles.card} onClick={() => setExpandedPartner(expandedPartner === p.name ? null : p.name)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer", gap: 12 }}>
                  <div>
                    <PartnerHeading p={p} fontSize={17} />
                    <span style={styles.kickerInline}>{p.role}</span>
                  </div>
                  <span style={{ color: C.muted, fontSize: 14, flexShrink: 0 }}>{expandedPartner === p.name ? "▲" : "▼"}</span>
                </div>
                <p style={{ ...styles.body, marginTop: 8 }}>{p.description}</p>
                {expandedPartner === p.name && p.keyPeople?.length > 0 && (
                  <div style={{ marginTop: 12, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                    <div style={styles.kicker}>Key People</div>
                    {p.keyPeople.map((person, i) => (
                      <div key={i} style={{ fontSize: 13.5, color: C.body, marginBottom: 4 }}>· {person}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <h3 style={styles.subTitle}>Supporting Partners</h3>
            {wikiData.partners.filter(p => p.type === "supporting").map((p) => (
              <div key={p.name} style={{ ...styles.card, borderLeft: `3px solid ${C.tealTintBorder}` }} onClick={() => setExpandedPartner(expandedPartner === p.name ? null : p.name)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer", gap: 12 }}>
                  <div>
                    <PartnerHeading p={p} fontSize={16} />
                    <span style={styles.kickerInline}>{p.role}</span>
                  </div>
                  <span style={{ color: C.muted, fontSize: 14, flexShrink: 0 }}>{expandedPartner === p.name ? "▲" : "▼"}</span>
                </div>
                <p style={{ ...styles.body, marginTop: 8 }}>{p.description}</p>
                {expandedPartner === p.name && p.keyPeople?.length > 0 && (
                  <div style={{ marginTop: 12, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                    <div style={styles.kicker}>Key People</div>
                    {p.keyPeople.map((person, i) => (
                      <div key={i} style={{ fontSize: 13.5, color: C.body, marginBottom: 4 }}>· {person}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* USE CASES */}
        {activeSection === "useCases" && (
          <div>
            <h2 style={styles.sectionTitle}>Use Cases</h2>
            <div style={styles.prose}>
              <p style={{ margin: 0 }}>Use cases are the primary validation mechanism in HDIP's final phase. They ground the handbooks in real-world complexity, ensuring the HDIP Operating Model is practically usable rather than purely theoretical.</p>
            </div>
            {wikiData.useCases.map((uc) => (
              <div key={uc.name} style={styles.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: C.ink }}>{uc.name}</h3>
                    <div style={{ fontSize: 13, color: C.muted }}>Owner: {uc.owner}</div>
                  </div>
                  <StatusBadge status={uc.status} />
                </div>
                <p style={{ ...styles.body, marginTop: 10 }}>{uc.description}</p>
              </div>
            ))}
            <div style={{ ...styles.card, background: C.tealTint, borderLeft: `4px solid ${C.teal}` }}>
              <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: C.ink }}>Why use cases matter</h3>
              <p style={styles.body}>Both use cases feed directly into the iteration of all three WP handbooks. The AstraZeneca use case is a critical dependency — without it, the Operating Model cannot achieve its goal of covering both public and industrial health data contexts. The Chalmers use case covers multimodal data, FAIR operationalisation, and synthetic data requirements.</p>
            </div>
          </div>
        )}

        {/* KEY CONCEPTS */}
        {activeSection === "concepts" && (
          <div>
            <h2 style={styles.sectionTitle}>Key Concepts</h2>
            <p style={styles.body}>Core terms, frameworks, and technical concepts referenced across HDIP documentation.</p>
            {wikiData.concepts.map((c) => (
              <div key={c.term} style={styles.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer" }}
                  onClick={() => setExpandedConcept(expandedConcept === c.term ? null : c.term)}>
                  <div>
                    <h3 style={{ margin: "0 0 3px", fontSize: 17, fontWeight: 700, color: C.ink }}>{c.term}</h3>
                    <div style={{ fontSize: 13, color: C.teal, fontWeight: 500 }}>{c.short}</div>
                  </div>
                  <span style={{ color: C.muted, fontSize: 14, marginLeft: 12, flexShrink: 0 }}>{expandedConcept === c.term ? "▲" : "▼"}</span>
                </div>
                {expandedConcept === c.term && (
                  <div style={{ marginTop: 12 }}>
                    <p style={styles.body}>{c.description}</p>
                    {c.subprinciples && (
                      <div style={{ marginTop: 12 }}>
                        <div style={styles.kicker}>Sub-principles</div>
                        {c.subprinciples.map((sp, i) => (
                          <div key={i} style={{ fontSize: 13.5, color: C.body, marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${C.tealTintBorder}` }}>{sp}</div>
                        ))}
                      </div>
                    )}
                    {c.link && (
                      <div style={{ marginTop: 12, fontSize: 13.5 }}>
                        <ExtLink href={c.link}>Learn more</ExtLink>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* DATA CATALOGUE */}
        {activeSection === "dataCatalogue" && (
          <div>
            <h2 style={styles.sectionTitle}>Data Catalogue</h2>
            <p style={styles.body}>{wikiData.dataCatalogue.description}</p>
            <h3 style={styles.subTitle}>Available Data Types</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem", marginTop: "0.5rem" }}>
              {wikiData.dataCatalogue.dataTypes.map((dt, i) => (
                <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "0.8rem 1rem", fontSize: 13.5, color: C.body }}>
                  {dt}
                </div>
              ))}
            </div>
            <div style={{ ...styles.card, marginTop: "2rem", background: `linear-gradient(135deg, ${C.tealDark}, ${C.tealDeep})`, border: "none" }}>
              <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: C.tealOnDark }}>Knowledge Graph Layer</h3>
              <p style={{ fontSize: 13.5, color: C.tealSoftOnDark, lineHeight: 1.75, margin: 0 }}>
                The catalogue integrates a Knowledge Graph (KG) that transforms isolated metadata records into a semantically connected network. This enables intelligent dataset discovery by disease, schema, or ontology term; lineage tracing; schema harmonisation across OMOP, FHIR, and other standards; and cross-dataset joins using SPARQL or Cypher queries.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "1.5rem", textAlign: "center", fontSize: 12.5, color: C.muted, marginTop: "1rem" }}>
        HDIP Project Wiki · Chalmers Industriteknik · For internal use
      </footer>
    </div>
  );
}

const styles = {
  sectionTitle: {
    fontSize: "clamp(1.4rem, 2.6vw, 1.8rem)",
    fontWeight: 800,
    color: C.ink,
    letterSpacing: "-0.02em",
    marginBottom: "0.85rem",
    borderBottom: `2px solid ${C.tealTintBorder}`,
    paddingBottom: "0.6rem",
  },
  subTitle: {
    fontSize: "1.15rem",
    fontWeight: 700,
    color: C.tealDark,
    marginTop: "1.85rem",
    marginBottom: "0.85rem",
  },
  prose: {
    fontSize: 15,
    color: C.body,
    lineHeight: 1.75,
    marginBottom: "1.4rem",
  },
  body: {
    fontSize: 14.5,
    color: C.body,
    lineHeight: 1.75,
    margin: 0,
  },
  kicker: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: C.muted,
    fontWeight: 700,
    marginBottom: 8,
  },
  kickerInline: {
    fontSize: 11,
    color: C.teal,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    fontWeight: 700,
  },
  card: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: "1.3rem 1.5rem",
    marginBottom: "1rem",
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
    cursor: "default",
  },
  factBox: {
    background: C.tealTint,
    border: `1px solid ${C.tealTintBorder}`,
    borderRadius: 12,
    padding: "0.5rem 1.5rem",
    marginBottom: "1.5rem",
  },
  factRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    borderBottom: `1px solid ${C.tealTintBorder}`,
    padding: "0.7rem 0",
    fontSize: 14,
  },
  factLabel: {
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: 11,
    fontWeight: 700,
  },
  factValue: {
    color: C.ink,
    fontWeight: 600,
    textAlign: "right",
  },
};
