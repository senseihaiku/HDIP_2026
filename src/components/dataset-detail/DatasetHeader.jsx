import { Link } from 'react-router-dom';

const ACCESS_MODEL_LABELS = {
  a2d: 'Algorithm to Data',
  'data-behind-glass': 'Controlled',
  'metadata-light': 'Metadata Only',
};

const SENSITIVITY_STYLES = {
  'Special Category': {
    wrapper: 'bg-red-100 text-red-700 border border-red-200',
    icon: (
      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.25-8.25-3.286ZM12 15.75h.008v.008H12v-.008Z" />
      </svg>
    ),
  },
  Pseudonymized: {
    wrapper: 'bg-amber-100 text-amber-700 border border-amber-200',
    icon: (
      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
      </svg>
    ),
  },
  Anonymized: {
    wrapper: 'bg-green-100 text-green-700 border border-green-200',
    icon: (
      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
      </svg>
    ),
  },
  Aggregated: {
    wrapper: 'bg-blue-100 text-blue-700 border border-blue-200',
    icon: (
      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
      </svg>
    ),
  },
};

function formatCategory(cat) {
  return cat
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function DatasetHeader({
  dataset,
  isAuthenticated,
  currentUser,
  bookmarked,
  onToggleBookmark,
  onRequestAccess,
}) {
  const firstAccessModel = dataset.accessModels?.[0];
  const accessLabel = ACCESS_MODEL_LABELS[firstAccessModel] || firstAccessModel;
  const sensitivity = dataset.sensitivityLevel
    ? SENSITIVITY_STYLES[dataset.sensitivityLevel]
    : null;

  const canRequestAccess =
    isAuthenticated &&
    (currentUser?.role === 'data-user' || currentUser?.role === 'admin');
  const isHolder = isAuthenticated && currentUser?.role === 'data-holder';
  const canBookmark =
    isAuthenticated &&
    (currentUser?.role === 'data-user' || currentUser?.role === 'admin');

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-700">
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </Link>
        <span>&gt;</span>
        <Link to="/catalog" className="hover:text-gray-700 hover:underline">
          Datasets
        </Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">
          {dataset.title}
        </span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mt-3">{dataset.title}</h1>

      {/* Provider line */}
      <p className="text-sm text-gray-600 mt-2">
        Provided by:{' '}
        <Link
          to={`/providers/${dataset.holder.id}`}
          className="text-teal-600 hover:underline font-medium"
        >
          {dataset.holder.name}
        </Link>
      </p>

      {/* Description */}
      <p className="text-gray-500 mt-1">{dataset.description}</p>

      {/* Metadata badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        {/* ID */}
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm bg-gray-100 text-gray-600">
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
          </svg>
          {dataset.id}
        </span>

        {/* Type / Category */}
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm bg-gray-100 text-gray-600">
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75l-5.571-3m11.142 0L21.75 12l-4.179 2.25m0 0L12 17.25l-5.571-3m11.142 0L21.75 16.5 12 21.75 2.25 16.5l4.179-2.25" />
          </svg>
          {formatCategory(dataset.category)}
        </span>

        {/* Access model */}
        {firstAccessModel && (
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm bg-gray-100 text-gray-600">
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            {accessLabel}
          </span>
        )}

        {/* FAIR Score */}
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm bg-gray-100 text-gray-600">
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          FAIR Score: {dataset.fairScore.total}
        </span>

        {/* Sensitivity */}
        {dataset.sensitivityLevel && sensitivity && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm ${sensitivity.wrapper}`}
          >
            {sensitivity.icon}
            {dataset.sensitivityLevel}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-5">
        {/* Request Access */}
        {!isAuthenticated && (
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-lg border border-teal-600 px-5 py-2.5 text-sm font-medium text-teal-700 hover:bg-teal-50 transition-colors"
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Log in to request access
          </Link>
        )}
        {canRequestAccess && !isHolder && (
          <button
            onClick={onRequestAccess}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            Request Access
          </button>
        )}

        {/* Save for Later / Bookmark */}
        {canBookmark && (
          <button
            onClick={onToggleBookmark}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              bookmarked
                ? 'border border-teal-200 bg-teal-50 text-teal-600'
                : 'border border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={bookmarked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={bookmarked ? 0 : 1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
            {bookmarked ? 'Saved' : 'Save for Later'}
          </button>
        )}
      </div>
    </div>
  );
}
