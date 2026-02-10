import { Link } from 'react-router-dom';

const fairCards = [
  {
    letter: 'F',
    title: 'Findable',
    description:
      'Datasets are described with rich, standardized metadata and assigned persistent identifiers so they can be discovered through the HDIP catalog by humans and machines alike.',
  },
  {
    letter: 'A',
    title: 'Accessible',
    description:
      'Clear access conditions are published alongside every dataset. Authentication, authorization, and legal frameworks are defined upfront so you know exactly what is required.',
  },
  {
    letter: 'I',
    title: 'Interoperable',
    description:
      'Metadata and data use formal, shared vocabularies and open standards (e.g., SNOMED CT, ICD-10, OMOP CDM) to enable meaningful integration across datasets.',
  },
  {
    letter: 'R',
    title: 'Reusable',
    description:
      'Datasets carry clear usage licenses, provenance information, and quality metrics so future users can confidently assess fitness for purpose.',
  },
];

const roles = [
  {
    title: 'Data Holders',
    description:
      'Regions, hospitals, universities, and private companies that contribute datasets to the platform. They retain ownership and control over their data at all times.',
    examples: 'Vastra Gotalandsregionen, Karolinska Institutet, AstraZeneca, Sahlgrenska University Hospital',
    icon: (
      <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
  },
  {
    title: 'Data Users',
    description:
      'Researchers, innovators, and analysts who discover and request access to datasets through the catalog. They run analyses securely without ever downloading raw data.',
    examples: 'Academic researchers, life-science startups, public health analysts',
    icon: (
      <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Support Partners',
    description:
      'Organizations that provide infrastructure, expertise, and governance support to the platform. They enable the technical and legal foundations that make HDIP possible.',
    examples: 'AI Sweden, RISE Research Institutes of Sweden, Chalmers University of Technology',
    icon: (
      <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">About HDIP</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Understanding the platform, its principles, and the ecosystem it serves.
          </p>
        </div>
      </section>

      {/* What is HDIP */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What is HDIP?</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                The Health Data Innovation Platform (HDIP) enables the <strong className="text-gray-900">secondary
                use of health data</strong> for research, innovation, and public benefit. Think of it
                as a &ldquo;Blocket for data&rdquo; &mdash; a marketplace where data holders can make their
                datasets discoverable and where researchers can find exactly what they need.
              </p>
              <p>
                A core principle of HDIP is that <strong className="text-gray-900">analysis moves to the
                data, not data to the analyst</strong>. Sensitive health data never leaves its secure
                environment. Instead, researchers submit their algorithms or work within isolated
                sandboxes, ensuring privacy and compliance while unlocking the potential of valuable
                health information.
              </p>
              <p>
                The platform provides standardized metadata, transparent access conditions, and
                multiple security models so that both data holders and data users can collaborate
                with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAIR Principles */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">FAIR Data Principles</h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              Every dataset on HDIP is evaluated against the FAIR framework, scored from 1 to 5 on
              each dimension for a maximum total of 20.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fairCards.map((card) => (
              <div
                key={card.letter}
                className="bg-gray-50 border border-gray-200 rounded-xl p-6"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-teal-600 text-white text-xl font-bold mb-4">
                  {card.letter}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Ecosystem */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">The Ecosystem</h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              HDIP connects three complementary groups into a trusted network for health data
              collaboration.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role) => (
              <div
                key={role.title}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-50 mb-4">
                  {role.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{role.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{role.description}</p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">Examples:</span> {role.examples}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funding Model */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Funding Model</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              HDIP operates on a transparent, three-part funding model designed to keep the platform
              financially sustainable while remaining accessible to public-sector and academic
              participants.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm mb-3">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Base Financing</h3>
                <p className="text-sm text-gray-600">
                  Annual membership fees from partner organizations cover core platform operations
                  and governance.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm mb-3">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Usage Fees</h3>
                <p className="text-sm text-gray-600">
                  Pay-per-use charges for compute environments, sandbox sessions, and expert
                  services scale costs with actual consumption.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm mb-3">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Value-based Reinvestment</h3>
                <p className="text-sm text-gray-600">
                  Any surplus is reinvested into platform development, FAIR tooling, and community
                  initiatives rather than distributed as profit.
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/pricing"
                className="inline-flex items-center text-sm font-medium text-teal-700 hover:text-teal-600 transition-colors"
              >
                View detailed pricing
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Governance</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  HDIP operates as a <strong className="text-gray-900">Shared Service Center</strong> governed
                  collectively by its member organizations. Strategic decisions are made by a steering
                  group composed of representatives from data holders, data users, and support partners.
                </p>
                <p>
                  The platform follows a <strong className="text-gray-900">non-profit logic</strong>: fees
                  are set to cover operational costs plus a modest buffer. Any surplus at the end of a
                  financial period is reinvested into infrastructure improvements, FAIRification tooling,
                  and community capacity building.
                </p>
                <p>
                  This governance model ensures that no single organization controls the platform and
                  that decisions are aligned with the collective interests of the Swedish health data
                  ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
