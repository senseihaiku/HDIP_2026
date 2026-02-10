import { Link } from 'react-router-dom';

const models = [
  {
    id: 'a2d',
    title: 'Algorithm-to-Data (A2D)',
    tagline: 'Your code travels to the data, not the other way around.',
    description:
      'In the A2D model, the researcher writes and submits an analysis script or algorithm. That code is executed inside the data holder\'s secure compute environment where the dataset resides. Only the approved results are returned. The raw data never leaves its origin.',
    diagram: 'Your Code  \u2192  Secure Environment  \u2190  Data  \u2192  Results Returned',
    steps: [
      'Prepare your analysis code locally and define expected inputs/outputs.',
      'Submit the code package through HDIP with your access request.',
      'The data holder reviews and approves the execution plan.',
      'Your code runs inside the secure environment alongside the data.',
      'Aggregated or approved results are returned to you.',
    ],
    whenToUse: [
      'You have a well-defined, reproducible analysis pipeline.',
      'The dataset is highly sensitive (e.g., genomic, identifiable patient data).',
      'You do not need interactive exploration of the data.',
    ],
    security: 'Maximum',
    securityColor: 'bg-green-100 text-green-800 border-green-200',
    icon: (
      <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: 'data-behind-glass',
    title: 'Data Behind Glass',
    tagline: 'See and analyze the data, but never download it.',
    description:
      'Data Behind Glass provides a secure, isolated sandbox environment where analysts can interactively explore and work with datasets through a browser-based interface. The data is visible and queryable, but it cannot be copied, downloaded, or transferred outside the sandbox.',
    diagram: 'Analyst  \u2192  Secure Sandbox (Browser)  \u2190  Data  |  No Download Possible',
    steps: [
      'Request sandbox access for a specific dataset through HDIP.',
      'Once approved, receive credentials for the isolated environment.',
      'Log in to the browser-based workspace (e.g., JupyterLab, RStudio).',
      'Explore, query, and analyze the data interactively.',
      'Export only approved summary outputs; raw data stays in the sandbox.',
    ],
    whenToUse: [
      'You need interactive, exploratory analysis.',
      'The research question is not yet fully defined and requires iteration.',
      'You want to visually inspect data quality before committing to a pipeline.',
    ],
    security: 'High',
    securityColor: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: (
      <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'metadata-light',
    title: 'Metadata-Light',
    tagline: 'Preview basic statistics to evaluate relevance before formal access.',
    description:
      'Metadata-Light is a preliminary analysis level that provides basic descriptive information about a dataset without granting access to the actual records. You can review column headers, record counts, value distributions, and simple summary statistics to determine whether a dataset is relevant to your research before investing in a full access request.',
    diagram: 'Researcher  \u2192  HDIP Catalog  \u2192  Summary Stats (counts, headers, distributions)',
    steps: [
      'Browse the HDIP catalog and identify a dataset of interest.',
      'Request a metadata-light preview through the dataset detail page.',
      'Receive a summary report: column names, record counts, value ranges, and basic distributions.',
      'Evaluate whether the dataset fits your research needs.',
      'If suitable, proceed with a formal access request for A2D or Data Behind Glass.',
    ],
    whenToUse: [
      'You are in the early scoping phase of a project.',
      'You need to evaluate dataset relevance before committing resources.',
      'You want to compare multiple datasets quickly.',
    ],
    security: 'Standard',
    securityColor: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: (
      <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function AccessModels() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Access Models</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            HDIP provides three distinct models for working with health data, each designed to
            balance analytical flexibility with data security.
          </p>
        </div>
      </section>

      {/* Overview comparison */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {models.map((model) => (
              <a
                key={model.id}
                href={`#${model.id}`}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-50 mb-4">
                  {model.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{model.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{model.tagline}</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${model.securityColor}`}
                >
                  {model.security} Security
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed sections */}
      {models.map((model) => (
        <section
          key={model.id}
          id={model.id}
          className="bg-white border-b border-gray-200 last:border-b-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto">
              {/* Title & security badge */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{model.title}</h2>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${model.securityColor}`}
                >
                  {model.security} Security
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-8">{model.description}</p>

              {/* Flow diagram */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Data Flow
                </p>
                <p className="text-sm font-mono text-teal-700">{model.diagram}</p>
              </div>

              {/* Two columns: How it works + When to use */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* How it works */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
                  <ol className="space-y-3">
                    {model.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-gray-600 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* When to use */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">When to Use</h3>
                  <ul className="space-y-3">
                    {model.whenToUse.map((item, idx) => (
                      <li key={idx} className="flex gap-3">
                        <svg className="flex-shrink-0 w-5 h-5 text-teal-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Not sure which model fits your needs?
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto mb-8">
            Browse the catalog to see which access models are available for each dataset, or view
            the pricing for each option.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/catalog"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Browse Catalog
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
