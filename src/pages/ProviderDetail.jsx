import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import DatasetCard from '../components/DatasetCard';

function formatDomain(slug) {
  if (!slug) return '';
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function getFairBadgeClasses(score) {
  if (score >= 16) return 'bg-green-100 text-green-700 border-green-300';
  if (score >= 12) return 'bg-teal-200 text-teal-800 border-teal-400';
  if (score >= 8) return 'bg-teal-100 text-teal-700 border-teal-300';
  return 'bg-red-100 text-red-700 border-red-300';
}

export default function ProviderDetail() {
  const { id } = useParams();
  const { datasets } = useData();

  const provider = useMemo(() => {
    const published = datasets.filter((ds) => ds.status === 'published');
    const providerDatasets = published.filter((ds) => ds.holder?.id === id);
    if (providerDatasets.length === 0) return null;

    const holder = providerDatasets[0].holder;
    const domains = new Set();
    providerDatasets.forEach((ds) => {
      if (ds.domain) domains.add(ds.domain);
    });

    const avgFairScore = Math.round(
      providerDatasets.reduce(
        (sum, ds) => sum + (ds.fairScore?.total ?? 0),
        0
      ) / providerDatasets.length
    );

    return {
      ...holder,
      datasets: providerDatasets,
      datasetCount: providerDatasets.length,
      avgFairScore,
      domains: [...domains],
    };
  }, [datasets, id]);

  /* ---- 404 State ---- */
  if (!provider) {
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
            Provider Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The data provider you are looking for does not exist or has no
            published datasets.
          </p>
          <Link
            to="/providers"
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
            Back to Providers
          </Link>
        </div>
      </div>
    );
  }

  const typeBadgeClass =
    provider.type === 'public'
      ? 'bg-sky-50 text-sky-700 ring-sky-600/20'
      : 'bg-teal-50 text-teal-700 ring-teal-600/20';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        to="/providers"
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
        Back to Providers
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{provider.name}</h1>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${typeBadgeClass}`}
          >
            {provider.type === 'public' ? 'Public' : 'Private'}
          </span>
        </div>
      </div>

      {/* Contact Info */}
      {(provider.contactEmail || provider.contactPhone) && (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-8">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Contact Information
          </h2>
          <dl className="flex flex-col sm:flex-row sm:gap-10 gap-3">
            {provider.contactEmail && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${provider.contactEmail}`}
                    className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    {provider.contactEmail}
                  </a>
                </dd>
              </div>
            )}
            {provider.contactPhone && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {provider.contactPhone}
                </dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center">
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Total Datasets
          </dt>
          <dd className="text-2xl font-bold text-gray-900">
            {provider.datasetCount}
          </dd>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center">
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Avg FAIR Score
          </dt>
          <dd className="flex items-center justify-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {provider.avgFairScore}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getFairBadgeClasses(provider.avgFairScore)}`}
            >
              / 20
            </span>
          </dd>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center">
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Domains Covered
          </dt>
          <dd className="text-2xl font-bold text-gray-900">
            {provider.domains.length}
          </dd>
          {provider.domains.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-2">
              {provider.domains.map((domain) => (
                <span
                  key={domain}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
                >
                  {formatDomain(domain)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Datasets Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-5">
          Datasets by {provider.name}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {provider.datasets.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>
      </section>
    </div>
  );
}
