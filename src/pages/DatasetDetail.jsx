import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { getFairLabel, getFairColor } from '../utils/fairScore';

const ACCESS_MODEL_INFO = {
  a2d: {
    label: 'Algorithm to Data (A2D)',
    description:
      'Your analysis algorithm is sent to and executed on the data inside a secure compute environment. Raw data never leaves the holder.',
  },
  'data-behind-glass': {
    label: 'Data Behind Glass',
    description:
      'Access and explore the data interactively within a monitored sandbox environment. Results are reviewed before export.',
  },
  'metadata-light': {
    label: 'Metadata Light',
    description:
      'Access aggregated statistics, column descriptions, and metadata without direct access to individual-level records.',
  },
};

const FAIR_DIMENSIONS = [
  { key: 'findable', label: 'Findable', color: 'bg-teal-500' },
  { key: 'accessible', label: 'Accessible', color: 'bg-sky-500' },
  { key: 'interoperable', label: 'Interoperable', color: 'bg-violet-500' },
  { key: 'reusable', label: 'Reusable', color: 'bg-amber-500' },
];

function formatCategory(cat) {
  return cat
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatNumber(num) {
  return num.toLocaleString();
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-SE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/* ===== Request Access Modal ===== */
function RequestAccessModal({ dataset, onClose, onSubmit }) {
  const [accessModel, setAccessModel] = useState(
    dataset.accessModels[0] || ''
  );
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accessModel || !purpose.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ accessModel, purpose: purpose.trim() });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
              <svg
                className="h-7 w-7 text-teal-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Request Submitted
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Your access request for{' '}
              <span className="font-medium">{dataset.title}</span> has been
              submitted successfully. The data holder will review your request.
            </p>
            <button
              onClick={onClose}
              className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Request Access
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-5">
          Requesting access to{' '}
          <span className="font-semibold text-gray-900">{dataset.title}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Access Model */}
          <div>
            <label
              htmlFor="req-access-model"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Access Model
            </label>
            <select
              id="req-access-model"
              value={accessModel}
              onChange={(e) => setAccessModel(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
            >
              {dataset.accessModels.map((model) => (
                <option key={model} value={model}>
                  {ACCESS_MODEL_INFO[model]?.label || model}
                </option>
              ))}
            </select>
            {accessModel && ACCESS_MODEL_INFO[accessModel] && (
              <p className="mt-1.5 text-xs text-gray-500">
                {ACCESS_MODEL_INFO[accessModel].description}
              </p>
            )}
          </div>

          {/* Purpose */}
          <div>
            <label
              htmlFor="req-purpose"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Purpose of Access
            </label>
            <textarea
              id="req-purpose"
              rows={4}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Describe your research purpose and how you intend to use this dataset..."
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!purpose.trim() || submitting}
              className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===== FAIR Score Bar Chart ===== */
function FairBarChart({ fairScore }) {
  const maxPerDimension = 5;

  return (
    <div className="space-y-3">
      {FAIR_DIMENSIONS.map(({ key, label, color }) => {
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
                className={`h-2.5 rounded-full ${color} transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ===== Main DatasetDetail Component ===== */
export default function DatasetDetail() {
  const { id } = useParams();
  const { getDataset, createRequest } = useData();
  const { currentUser, isAuthenticated } = useAuth();
  const [showRequestModal, setShowRequestModal] = useState(false);

  const dataset = getDataset(id);

  /* ---- 404 State ---- */
  if (!dataset) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-8 w-8 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Dataset Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The dataset you are looking for does not exist or may have been
            removed.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isDataUser =
    isAuthenticated && currentUser?.role === 'data-user';

  const orgTypeBadgeClass =
    dataset.holder.type === 'public'
      ? 'bg-sky-50 text-sky-700 ring-sky-600/20'
      : 'bg-amber-50 text-amber-700 ring-amber-600/20';

  const handleRequestSubmit = async ({ accessModel, purpose }) => {
    await createRequest({
      datasetId: dataset.id,
      requesterId: currentUser.id,
      accessModel,
      purpose,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        to="/catalog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 mb-6 group"
      >
        <svg
          className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Back to Catalog
      </Link>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {dataset.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-600">
                Held by{' '}
                <span className="font-semibold text-gray-800">
                  {dataset.holder.name}
                </span>
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${orgTypeBadgeClass}`}
              >
                {dataset.holder.type === 'public' ? 'Public' : 'Private'}
              </span>
            </div>
          </div>

          {/* Request Access button */}
          {!isAuthenticated && (
            <Link
              to="/login"
              className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-teal-600 px-5 py-2.5 text-sm font-semibold text-teal-700 hover:bg-teal-50 transition-colors"
            >
              Log in to request access
            </Link>
          )}
          {isDataUser && (
            <button
              onClick={() => setShowRequestModal(true)}
              className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              Request Access
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left column: Description + Metadata + Columns + Tags */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {dataset.description}
            </p>
          </section>

          {/* Metadata Grid */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Metadata
            </h2>
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Record Count
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {formatNumber(dataset.recordCount)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Range
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {formatDate(dataset.dateRange.from)} &ndash;{' '}
                  {formatDate(dataset.dateRange.to)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {formatCategory(dataset.category)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      dataset.status === 'published'
                        ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                        : 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20'
                    }`}
                  >
                    {dataset.status.charAt(0).toUpperCase() +
                      dataset.status.slice(1)}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Added
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {formatDate(dataset.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Holder Type
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {dataset.holder.type === 'public'
                    ? 'Public Organisation'
                    : 'Private Organisation'}
                </dd>
              </div>
            </dl>
          </section>

          {/* Columns / Fields */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Fields / Columns
              <span className="ml-2 text-gray-400 font-normal normal-case tracking-normal">
                ({dataset.columns.length})
              </span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {dataset.columns.map((col) => (
                <span
                  key={col}
                  className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-mono font-medium text-gray-700 ring-1 ring-inset ring-gray-200"
                >
                  {col}
                </span>
              ))}
            </div>
          </section>

          {/* Tags */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {dataset.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Access Models */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Available Access Models
            </h2>
            <div className="space-y-4">
              {dataset.accessModels.map((model) => {
                const info = ACCESS_MODEL_INFO[model];
                return (
                  <div
                    key={model}
                    className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="shrink-0 mt-0.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
                        <svg
                          className="h-4 w-4 text-teal-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {info?.label || model}
                      </h3>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {info?.description || 'No description available.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right column: FAIR Score + Quick actions */}
        <div className="space-y-6">
          {/* FAIR Score Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sticky top-24">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              FAIR Score
            </h2>

            {/* Total score circle */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative flex items-center justify-center">
                <svg className="h-28 w-28" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke={
                      dataset.fairScore.total >= 16
                        ? '#0d9488'
                        : dataset.fairScore.total >= 12
                          ? '#0284c7'
                          : dataset.fairScore.total >= 8
                            ? '#d97706'
                            : '#dc2626'
                    }
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(dataset.fairScore.total / 20) * 327} 327`}
                    transform="rotate(-90 60 60)"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {dataset.fairScore.total}
                  </span>
                  <span className="text-xs text-gray-500">/ 20</span>
                </div>
              </div>
            </div>

            {/* Label */}
            <div className="text-center mb-6">
              <span
                className={`text-sm font-semibold ${getFairColor(dataset.fairScore.total)}`}
              >
                {getFairLabel(dataset.fairScore.total)}
              </span>
            </div>

            {/* Dimension Breakdown */}
            <FairBarChart fairScore={dataset.fairScore} />

            {/* Request button (repeated for sticky sidebar visibility) */}
            {isDataUser && (
              <button
                onClick={() => setShowRequestModal(true)}
                className="mt-6 w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
              >
                Request Access
              </button>
            )}
          </div>

          {/* Quick Info Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Info
            </h2>
            <dl className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <dt className="text-gray-500">Records</dt>
                <dd className="font-medium text-gray-900">
                  {formatNumber(dataset.recordCount)}
                </dd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <dt className="text-gray-500">Fields</dt>
                <dd className="font-medium text-gray-900">
                  {dataset.columns.length}
                </dd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <dt className="text-gray-500">Access Models</dt>
                <dd className="font-medium text-gray-900">
                  {dataset.accessModels.length}
                </dd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <dt className="text-gray-500">Category</dt>
                <dd className="font-medium text-gray-900">
                  {formatCategory(dataset.category)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Request Access Modal */}
      {showRequestModal && (
        <RequestAccessModal
          dataset={dataset}
          onClose={() => setShowRequestModal(false)}
          onSubmit={handleRequestSubmit}
        />
      )}
    </div>
  );
}
