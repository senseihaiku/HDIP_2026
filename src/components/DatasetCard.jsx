import { Link } from 'react-router-dom';
import FairBadge from './FairBadge';

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
      <p className="text-sm text-gray-500 mb-3">{holder?.name}</p>

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
        {accessModels?.map((model) => (
          <span
            key={model}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200"
          >
            {model}
          </span>
        ))}
      </div>
    </Link>
  );
}
