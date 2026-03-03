import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'top', label: 'Top Rated' },
];


export default function Catalog() {
  const { datasets } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read from URL
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const domain = searchParams.get('domain') || '';
  const holderId = searchParams.get('holder') || '';
  const dataStandard = searchParams.get('standard') || '';
  const accessModelsParam = searchParams.get('access') || '';
  const accessModels = accessModelsParam ? accessModelsParam.split(',') : [];
  const minFairScore = Number(searchParams.get('minFair') || '0');
  const sortBy = searchParams.get('sort') || '';
  const tab = searchParams.get('tab') || 'all';

  // UI-only state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Helper to update a single search param
  const setParam = useCallback((key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (!value || value === '0' || (Array.isArray(value) && value.length === 0)) {
        next.delete(key);
      } else {
        next.set(key, Array.isArray(value) ? value.join(',') : value);
      }
      return next;
    });
  }, [setSearchParams]);

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

  const domains = useMemo(
    () => [...new Set(datasets.filter(d => d.status === 'published').map(d => d.domain).filter(Boolean))].sort(),
    [datasets]
  );

  const holders = useMemo(
    () => {
      const map = {};
      datasets.filter(d => d.status === 'published').forEach(d => {
        if (d.holder?.id && !map[d.holder.id]) {
          map[d.holder.id] = d.holder.name;
        }
      });
      return Object.entries(map).sort((a, b) => a[1].localeCompare(b[1]));
    },
    [datasets]
  );

  const standards = useMemo(
    () => [...new Set(datasets.filter(d => d.status === 'published').flatMap(d => d.dataStandards || []))].sort(),
    [datasets]
  );

  const results = useMemo(() => {
    const filters = {};
    if (category) filters.category = category;
    if (domain) filters.domain = domain;
    if (holderId) filters.holderId = holderId;
    if (dataStandard) filters.dataStandard = dataStandard;
    if (minFairScore > 0) filters.minFairScore = minFairScore;
    if (sortBy) filters.sortBy = sortBy;
    // If on tab "recent" and no explicit sort, sort by date
    if (tab === 'recent' && !sortBy) filters.sortBy = 'date';
    if (tab === 'top' && !sortBy) filters.sortBy = 'fair';

    let filtered = searchDatasets(
      datasets.filter((d) => d.status === 'published'),
      query,
      filters
    );

    // Multi-select access model filter (OR logic: show datasets matching ANY checked model)
    if (accessModels.length > 0) {
      filtered = filtered.filter((ds) =>
        accessModels.some((model) => ds.accessModels?.includes(model))
      );
    }

    return filtered;
  }, [datasets, query, category, domain, holderId, dataStandard, accessModels, minFairScore, sortBy, tab]);

  const handleAccessModelToggle = useCallback((model) => {
    const newModels = accessModels.includes(model)
      ? accessModels.filter((m) => m !== model)
      : [...accessModels, model];
    setParam('access', newModels.join(',') || '');
  }, [accessModels, setParam]);

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const hasActiveFilters =
    category || domain || holderId || dataStandard || accessModels.length > 0 || minFairScore > 0 || sortBy || tab !== 'all';

  /* ---- Format category / domain label for display ---- */
  function formatCategory(cat) {
    return cat
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  /* ---- Handle tab click ---- */
  const handleTabClick = useCallback((tabValue) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (tabValue === 'all') {
        next.delete('tab');
        next.delete('sort');
      } else {
        next.set('tab', tabValue);
        // Set default sort for tab, but let user override later
        if (tabValue === 'recent') {
          next.set('sort', 'date');
        } else if (tabValue === 'top') {
          next.set('sort', 'fair');
        }
      }
      return next;
    });
  }, [setSearchParams]);

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
          onChange={(e) => setParam('category', e.target.value)}
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

      {/* Domain */}
      <div>
        <label
          htmlFor="filter-domain"
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Domain
        </label>
        <select
          id="filter-domain"
          value={domain}
          onChange={(e) => setParam('domain', e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
        >
          <option value="">All Domains</option>
          {domains.map((d) => (
            <option key={d} value={d}>
              {formatCategory(d)}
            </option>
          ))}
        </select>
      </div>

      {/* Data Standard */}
      <div>
        <label
          htmlFor="filter-standard"
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Data Standard
        </label>
        <select
          id="filter-standard"
          value={dataStandard}
          onChange={(e) => setParam('standard', e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
        >
          <option value="">All Standards</option>
          {standards.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Data Holder */}
      <div>
        <label
          htmlFor="filter-holder"
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Data Holder
        </label>
        <select
          id="filter-holder"
          value={holderId}
          onChange={(e) => setParam('holder', e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
        >
          <option value="">All Holders</option>
          {holders.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
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
            onChange={(e) => setParam('minFair', String(Number(e.target.value)))}
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
          onChange={(e) => setParam('sort', e.target.value)}
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

      {/* Catalog Tabs */}
      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => handleTabClick(t.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.value
                ? 'bg-teal-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {t.label}
          </button>
        ))}
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
            onChange={(e) => setParam('q', e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setParam('q', '')}
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
                (domain ? 1 : 0) +
                (holderId ? 1 : 0) +
                (dataStandard ? 1 : 0) +
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
