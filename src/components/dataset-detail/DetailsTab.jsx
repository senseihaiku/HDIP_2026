import { getFairLabel, getFairColor } from '../../utils/fairScore';

const FAIR_DIMENSIONS = [
  { key: 'findable', label: 'Findable' },
  { key: 'accessible', label: 'Accessible' },
  { key: 'interoperable', label: 'Interoperable' },
  { key: 'reusable', label: 'Reusable' },
];

const SENSITIVITY_STYLES = {
  'Special Category': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  'Pseudonymized': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Anonymized': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Aggregated': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
};

function formatCategory(cat) {
  if (!cat) return 'N/A';
  return cat
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatAccessModel(model) {
  const labels = {
    a2d: 'Algorithm to Data (A2D)',
    'data-behind-glass': 'Data Behind Glass',
    'metadata-light': 'Metadata Light',
  };
  return labels[model] || formatCategory(model);
}

export default function DetailsTab({ dataset }) {
  const fairScore = dataset.fairScore || {};
  const totalScore = fairScore.total || 0;
  const maxPerDimension = 5;

  const sensitivityStyle = SENSITIVITY_STYLES[dataset.sensitivityLevel] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Core Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Core Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Data Type */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-teal-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6h.008v.008H6V6Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Type
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {formatCategory(dataset.category)}
              </p>
            </div>
          </div>

          {/* Record Count */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-teal-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 12c0-.621.504-1.125 1.125-1.125m0 3.75h7.5"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Record Count
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {dataset.recordCount
                  ? dataset.recordCount.toLocaleString()
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Timespan */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-teal-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timespan
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {dataset.dateRange
                  ? `${new Date(dataset.dateRange.from).getFullYear()} - ${new Date(dataset.dateRange.to).getFullYear()}`
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-teal-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {dataset.createdAt
                  ? new Date(dataset.createdAt).toLocaleDateString('en-SE', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Update Frequency */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-teal-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Update Frequency
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {dataset.updateFrequency || 'Not specified'}
              </p>
            </div>
          </div>

          {/* Geographic Coverage */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-teal-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Geographic Coverage
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {dataset.geographicCoverage || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Governance & Compliance */}
      <div className="border-t border-gray-100 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Governance &amp; Compliance
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Sensitivity Level */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-teal-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sensitivity Level
              </p>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${sensitivityStyle.bg} ${sensitivityStyle.text} ${sensitivityStyle.border}`}
                >
                  {dataset.sensitivityLevel || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          {/* License */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-teal-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                License
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {dataset.license || 'Not specified'}
              </p>
            </div>
          </div>

          {/* Access Level */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-teal-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Access Level
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {dataset.accessModels && dataset.accessModels.length > 0
                  ? formatAccessModel(dataset.accessModels[0])
                  : 'Not specified'}
              </p>
            </div>
          </div>

          {/* Data Standards */}
          {dataset.dataStandards && dataset.dataStandards.length > 0 && (
            <div className="col-span-2 md:col-span-3 flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <svg
                  className="h-5 w-5 text-teal-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.745 3A23.933 23.933 0 0 0 3 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.78 1.5 5.817 1.5 9s-.533 6.22-1.5 9M8.25 8.885l1.444-.89a.75.75 0 0 1 1.105.402l2.402 7.206a.75.75 0 0 0 1.104.401l1.445-.889m-8.25.75.213.09a1.687 1.687 0 0 0 2.062-.617l4.45-6.676a1.688 1.688 0 0 1 2.062-.618l.213.09"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  Data Standards
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {dataset.dataStandards.map((std) => (
                    <span
                      key={std}
                      className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700 border border-teal-200"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quality & Provenance - FAIR Score */}
      <div className="border-t border-gray-100 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quality &amp; Provenance
        </h3>

        {/* Total FAIR Score */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl font-bold text-gray-900">
            {totalScore}
          </span>
          <span className="text-sm text-gray-500">/ 20</span>
          <span
            className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getFairColor(totalScore)} bg-teal-50`}
          >
            {getFairLabel(totalScore)}
          </span>
        </div>

        {/* FAIR Dimension Bars */}
        <div className="space-y-3">
          {FAIR_DIMENSIONS.map(({ key, label }) => {
            const score = fairScore[key] || 0;
            const pct = (score / maxPerDimension) * 100;
            return (
              <div key={key}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{label}</span>
                  <span className="text-gray-500">
                    {score}/{maxPerDimension}
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2.5 rounded-full bg-teal-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Documentation & Links - Columns */}
      {dataset.columns && dataset.columns.length > 0 && (
        <div className="border-t border-gray-100 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Documentation &amp; Links
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            Columns ({dataset.columns.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {dataset.columns.map((col) => (
              <span
                key={col}
                className="bg-gray-100 text-gray-700 rounded px-2 py-1 text-xs font-mono"
              >
                {col}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      {dataset.tags && dataset.tags.length > 0 && (
        <div className="border-t border-gray-100 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {dataset.tags.map((tag) => (
              <span
                key={tag}
                className="bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-3 py-1 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
