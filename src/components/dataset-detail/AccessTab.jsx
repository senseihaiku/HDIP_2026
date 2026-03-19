const ACCESS_MODEL_INFO = {
  a2d: {
    label: 'Algorithm to Data (A2D)',
    description:
      'Your algorithm is executed on the data within the secure environment. You receive only the results, never the raw data.',
    icon: (
      <svg className="w-6 h-6 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
      </svg>
    ),
  },
  'data-behind-glass': {
    label: 'Data Behind Glass (Glass Sandbox)',
    description:
      'View and analyze data within a secure Glass Sandbox environment. No data can be downloaded or exported.',
    icon: (
      <svg className="w-6 h-6 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z" />
      </svg>
    ),
  },
  'metadata-light': {
    label: 'Metadata Light',
    description:
      'Access to detailed metadata and aggregate statistics. No individual-level data access.',
    icon: (
      <svg className="w-6 h-6 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
};

function formatAccessLevel(model) {
  const info = ACCESS_MODEL_INFO[model];
  return info ? info.label : model;
}

export default function AccessTab({ dataset }) {
  const primaryModel = dataset.accessModels?.[0];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Access & Compliance</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Access to this dataset ({formatAccessLevel(primaryModel)}) is governed by the
          Health Data Innovation Platform (HDIP) framework and relevant Swedish regulations.
          Access typically requires review and approval by a Data Access Committee (DAC) and
          use within a designated Glass Sandbox environment.
        </p>
      </div>

      {/* General Compliance Points */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-4">General Compliance Requirements</h4>
        <ul className="space-y-3">
          {[
            'A formal application and approval by the relevant Data Access Committee (DAC) is required.',
            'Data analysis must be conducted within an approved Glass Sandbox environment.',
            'Strict adherence to GDPR, the Swedish Patient Data Act, and the Ethical Review Act is mandatory.',
            'A Data Use Agreement (DUA) must be signed before access is granted.',
          ].map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-teal-600 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span className="text-gray-600 text-sm">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Access Model Cards */}
      {dataset.accessModels?.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4">Available Access Models</h4>
          <div className="space-y-3">
            {dataset.accessModels.map((model) => {
              const info = ACCESS_MODEL_INFO[model];
              if (!info) return null;
              return (
                <div
                  key={model}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 flex items-start gap-3"
                >
                  {info.icon}
                  <div>
                    <p className="font-bold text-gray-900">{info.label}</p>
                    <p className="text-gray-600 text-sm mt-1">{info.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="flex flex-wrap gap-4">
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          View Platform Ethical Guidelines
        </a>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          Overview of Relevant Regulations
        </a>
      </div>
    </div>
  );
}
