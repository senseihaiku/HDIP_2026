import { Link } from 'react-router-dom';
import FairBadge from './FairBadge';

const ACCESS_MODEL_STYLES = {
  'a2d': { label: 'Algorithm to Data (A2D)', short: 'A2D', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  'data-behind-glass': { label: 'Data Behind Glass', short: 'Data Behind Glass', bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
  'metadata-light': { label: 'Metadata Light', short: 'Metadata Light', bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
};

function truncate(text, maxLength = 120) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

function formatCategory(cat) {
  if (!cat) return '';
  return cat
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function DatasetCard({ dataset }) {
  const {
    id,
    title,
    holder,
    description,
    category,
    domain,
    fairScore,
    accessModels,
  } = dataset;

  return (
    <Link
      to={`/catalog/${id}`}
      className="block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
          {title}
        </h3>
        {fairScore && <FairBadge score={fairScore} />}
      </div>

      {/* Holder */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <p className="text-sm text-gray-500">{holder?.name}</p>
        {domain && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            {formatCategory(domain)}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {truncate(description)}
      </p>

      {/* Tags row */}
      <div className="flex flex-wrap items-center gap-2">
        {category && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
            {formatCategory(category)}
          </span>
        )}
        {accessModels?.map((model) => {
          const style = ACCESS_MODEL_STYLES[model] || { short: model, bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
          return (
            <span key={model} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} border ${style.border}`}>
              {style.short}
            </span>
          );
        })}
      </div>
    </Link>
  );
}
