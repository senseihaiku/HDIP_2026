export function searchDatasets(datasets, query = '', filters = {}) {
  let results = [...datasets];

  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter((ds) => {
      const title = ds.title?.toLowerCase() || '';
      const description = ds.description?.toLowerCase() || '';
      const category = ds.category?.toLowerCase() || '';
      const domain = ds.domain?.toLowerCase() || '';
      const holderName = ds.holder?.name?.toLowerCase() || '';
      const tags = ds.tags || [];
      return (
        title.includes(q) ||
        description.includes(q) ||
        category.includes(q) ||
        domain.includes(q) ||
        holderName.includes(q) ||
        tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }

  if (filters.category) {
    results = results.filter((ds) => ds.category === filters.category);
  }

  if (filters.domain) {
    results = results.filter((ds) => ds.domain === filters.domain);
  }

  if (filters.dataStandard) {
    results = results.filter((ds) => ds.dataStandards?.includes(filters.dataStandard));
  }

  if (filters.holderId) {
    results = results.filter((ds) => ds.holder?.id === filters.holderId);
  }

  if (filters.holder) {
    results = results.filter((ds) => ds.holder?.id === filters.holder);
  }

  if (filters.accessModel) {
    results = results.filter(
      (ds) => ds.accessModels && ds.accessModels.includes(filters.accessModel)
    );
  }

  if (filters.minFairScore) {
    results = results.filter(
      (ds) => (ds.fairScore?.total ?? 0) >= filters.minFairScore
    );
  }

  if (filters.status) {
    results = results.filter((ds) => ds.status === filters.status);
  }

  // Sorting
  if (filters.sortBy === 'fair') {
    results.sort(
      (a, b) => (b.fairScore?.total ?? 0) - (a.fairScore?.total ?? 0)
    );
  } else if (filters.sortBy === 'date') {
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (filters.sortBy === 'records') {
    results.sort((a, b) => (b.recordCount ?? 0) - (a.recordCount ?? 0));
  }

  return results;
}
