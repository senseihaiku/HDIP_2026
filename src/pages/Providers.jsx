import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

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

export default function Providers() {
  const { datasets } = useData();

  const providers = useMemo(() => {
    const map = {};
    datasets
      .filter((ds) => ds.status === 'published')
      .forEach((ds) => {
        const h = ds.holder;
        if (!map[h.id]) {
          map[h.id] = { ...h, datasets: [], domains: new Set() };
        }
        map[h.id].datasets.push(ds);
        if (ds.domain) map[h.id].domains.add(ds.domain);
      });
    return Object.values(map)
      .map((p) => ({
        ...p,
        datasetCount: p.datasets.length,
        avgFairScore: Math.round(
          p.datasets.reduce((sum, ds) => sum + (ds.fairScore?.total ?? 0), 0) /
            p.datasets.length
        ),
        domains: [...p.domains],
      }))
      .sort((a, b) => b.datasetCount - a.datasetCount);
  }, [datasets]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Data Providers
        </h1>
        <p className="text-lg text-gray-600">
          Organisations that contribute health datasets to the HDIP platform.
        </p>
      </div>

      {/* Provider Cards Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {providers.map((provider) => {
          const typeBadgeClass =
            provider.type === 'public'
              ? 'bg-sky-50 text-sky-700 ring-sky-600/20'
              : 'bg-teal-50 text-teal-700 ring-teal-600/20';

          return (
            <Link
              key={provider.id}
              to={`/providers/${provider.id}`}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Name + Type badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-base font-semibold text-gray-900 leading-snug">
                  {provider.name}
                </h3>
                <span
                  className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${typeBadgeClass}`}
                >
                  {provider.type === 'public' ? 'Public' : 'Private'}
                </span>
              </div>

              {/* Dataset count + FAIR badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-gray-600">
                  {provider.datasetCount}{' '}
                  {provider.datasetCount === 1 ? 'dataset' : 'datasets'}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getFairBadgeClasses(provider.avgFairScore)}`}
                >
                  FAIR {provider.avgFairScore}/20
                </span>
              </div>

              {/* Domain pills */}
              {provider.domains.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
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
            </Link>
          );
        })}
      </div>

      {/* Empty state */}
      {providers.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">No data providers found.</p>
        </div>
      )}
    </div>
  );
}
