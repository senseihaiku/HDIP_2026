import { Link } from 'react-router-dom';

const stats = [
  { label: 'Datasets', value: '12+', description: 'Curated health datasets available' },
  { label: 'Partner Organizations', value: '8', description: 'Across public and private sectors' },
  { label: 'Access Models', value: '3', description: 'Flexible and secure options' },
  { label: 'FAIR Score Max', value: '20', description: 'Comprehensive quality metric' },
];

const pillars = [
  {
    title: 'FAIR Principles',
    description:
      'Every dataset is scored on Findability, Accessibility, Interoperability, and Reusability so you always know what you are working with.',
    icon: (
      <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Security First',
    description:
      'Analysis moves to the data, not data to the analyst. Your sensitive health data never leaves its secure environment.',
    icon: (
      <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: 'Collaborative Ecosystem',
    description:
      'Connecting data holders, researchers, and innovators in a trusted network that accelerates health data-driven discoveries.',
    icon: (
      <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const steps = [
  {
    number: '1',
    title: 'Browse the Catalog',
    description:
      'Explore the metadata catalog to discover health datasets relevant to your research or innovation goals.',
  },
  {
    number: '2',
    title: 'Request Access',
    description:
      'Submit a structured access request describing your project, intended use, and required data scope.',
  },
  {
    number: '3',
    title: 'Analyze Securely',
    description:
      'Run your analysis via Algorithm-to-Data, a Data Behind Glass sandbox, or review metadata-light previews.',
  },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            Health Data Innovation Platform
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
            Enabling secure secondary use of health data for research and innovation.
            Discover, request, and analyze datasets without the data ever leaving its
            secure environment.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/catalog"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
            >
              Explore Catalog
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
            >
              Share Your Data
            </Link>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Built on Trust and Transparency</h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              Three pillars that define how HDIP operates and protects every stakeholder.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-white border border-gray-200 rounded-xl p-8 text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-50 mb-5">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{pillar.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              From discovery to secure analysis in three straightforward steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative text-center">
                {/* Connector line (hidden on mobile and after last item) */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-teal-200" />
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-600 text-white text-2xl font-bold mb-5">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Platform at a Glance</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center"
              >
                <p className="text-3xl font-extrabold text-teal-600">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{stat.label}</p>
                <p className="mt-1 text-xs text-gray-500">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-4 text-teal-100 max-w-lg mx-auto">
            Whether you hold valuable health data or need access for research,
            HDIP provides the trusted framework to make it happen.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/catalog"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-teal-700 bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
            >
              Explore Catalog
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white border border-teal-400 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Share Your Data
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
