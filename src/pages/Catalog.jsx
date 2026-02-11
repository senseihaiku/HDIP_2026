import { useState, useMemo, useCallback } from 'react';
import { useData } from '../context/DataContext';
import DatasetCard from '../components/DatasetCard';
import { searchDatasets } from '../utils/search';

const ACCESS_MODELS = [
  { value: 'a2d', label: 'Algorithm to Data (A2D)' },
  { value: 'data-behind-glass', label: 'Data Behind Glass' },
  { value: 'metadata-light', label: 'Metadata Light' },
];

const SORT_OPTIONS = [
  { value: '', label: 'Relevance' },
  { value: 'date', label: 'Date Added' },
  { value: 'fair', label: 'FAIR Score' },
  { value: 'records', label: 'Record Count' },
];


export default function Catalog() {
  const { datasets } = useData();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [accessModels, setAccessModels] = useState([]);
  const [minFairScore, setMinFairScore] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categories = useMemo(
    () =>
      [
        ...new Set(
          datasets
            .filter((d) => d.status === 'published')
            .map((d) => d.category)
        ),
      ].sort(),
    [datasets]
  );

  const results = useMemo(() => {
    const filters = {};
    if (category) filters.category = category;
    if (minFairScore > 0) filters.minFairScore = minFairScore;
    if (sortBy) filters.sortBy = sortBy;

    let filtered = searchDatasets(
      datasets.filter((d) => d.status === 'published'),
      query,
      filters
    );

    // Multi-select access model filter (OR logic: show datasets matching ANY checked model)
    if (accessModels.length > 0) {
      filtered = filtered.filter((ds) =>
        accessModels.some((model) => ds.accessModels.includes(model))
      );
    }

    return filtered;
  }, [datasets, query, category, accessModels, minFairScore, sortBy]);

  const handleAccessModelToggle = useCallback((model) => {
    setAccessModels((prev) =>
      prev.includes(model)
        ? prev.filter((m) => m !== model)
        : [...prev, model]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setQuery('');
    setCategory('');
    setAccessModels([]);
    setMinFairScore(0);
    setSortBy('');
  }, []);

  const hasActiveFilters =
    category || accessModels.length > 0 || minFairScore > 0 || sortBy;

  /* ---- Format category label for display ---- */
  function formatCategory(cat) {
    return cat
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  /* ---- Filter panel content (shared between desktop sidebar and mobile drawer) ---- */
  const filterContent = (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <label
          htmlFor="filter-category"
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Category
        </label>
        <select
          id="filter-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {formatCategory(cat)}
            </option>
          ))}
        </select>
      </div>

      {/* Access Models */}
      <div>
        <span className="block text-sm font-semibold text-gray-700 mb-1.5">
          Access Model
        </span>
        <div className="space-y-2">
          {ACCESS_MODELS.map((model) => (
            <label
              key={model.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={accessModels.includes(model.value)}
                onChange={() => handleAccessModelToggle(model.value)}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 accent-teal-600"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {model.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* FAIR Score Minimum */}
      <div>
        <label
          htmlFor="filter-fair"
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Min FAIR Score
        </label>
        <div className="flex items-center gap-3">
          <input
            id="filter-fair"
            type="range"
            min={0}
            max={20}
            step={1}
            value={minFairScore}
            onChange={(e) => setMinFairScore(Number(e.target.value))}
            className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <span className="text-sm font-medium text-teal-700 bg-teal-50 rounded-md px-2 py-0.5 min-w-[2.5rem] text-center">
            {minFairScore}
          </span>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label
          htmlFor="filter-sort"
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Sort By
        </label>
        <select
          id="filter-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full text-sm font-medium text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg px-4 py-2 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dataset Catalog</h1>
        <p className="mt-2 text-gray-600">
          Browse and search health data assets available through the HDIP
          platform.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search datasets by title, description, tags, holder, or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
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
          )}
        </div>
      </div>

      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <svg
            className="h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold">
              {(category ? 1 : 0) +
                accessModels.length +
                (minFairScore > 0 ? 1 : 0) +
                (sortBy ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="lg:hidden mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          {filterContent}
        </div>
      )}

      {/* Main content area with sidebar */}
      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Filters
            </h2>
            {filterContent}
          </div>
        </aside>

        {/* Results area */}
        <div className="flex-1 min-w-0">
          {/* Result count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">
                {results.length}
              </span>{' '}
              {results.length === 1 ? 'dataset' : 'datasets'} found
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="lg:hidden text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Results grid */}
          {results.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <svg
                className="h-12 w-12 text-gray-300 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No datasets match your search criteria
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Try adjusting your search terms or clearing some filters.
              </p>
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
