export function searchDatasets(datasets, query = '', filters = {}) {
  let results = [...datasets];

  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(
      (ds) =>
        ds.title.toLowerCase().includes(q) ||
        ds.description.toLowerCase().includes(q) ||
        ds.tags.some((t) => t.toLowerCase().includes(q)) ||
        ds.holder.name.toLowerCase().includes(q) ||
        ds.category.toLowerCase().includes(q)
    );
  }

  if (filters.category) {
    results = results.filter((ds) => ds.category === filters.category);
  }

  if (filters.holder) {
    results = results.filter((ds) => ds.holder.id === filters.holder);
  }

  if (filters.accessModel) {
    results = results.filter((ds) => ds.accessModels.includes(filters.accessModel));
  }

  if (filters.minFairScore) {
    results = results.filter((ds) => ds.fairScore.total >= filters.minFairScore);
  }

  if (filters.status) {
    results = results.filter((ds) => ds.status === filters.status);
  }

  // Sorting
  if (filters.sortBy === 'fair') {
    results.sort((a, b) => b.fairScore.total - a.fairScore.total);
  } else if (filters.sortBy === 'date') {
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (filters.sortBy === 'records') {
    results.sort((a, b) => b.recordCount - a.recordCount);
  }

  return results;
}
