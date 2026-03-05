export function calculateFairScore(dataset) {
  let score = { findable: 0, accessible: 0, interoperable: 0, reusable: 0 };

  // Findable: title, description, tags, category present
  if (dataset.title) score.findable++;
  if (dataset.description && dataset.description.length > 50) score.findable++;
  if (dataset.tags && dataset.tags.length > 0) score.findable++;
  if (dataset.category) score.findable++;
  if (dataset.columns && dataset.columns.length > 0) score.findable++;

  // Accessible: access models defined
  if (dataset.accessModels && dataset.accessModels.length > 0) score.accessible++;
  if (dataset.accessModels && dataset.accessModels.length > 1) score.accessible++;
  if (dataset.holder) score.accessible++;
  if (dataset.dateRange) score.accessible++;
  if (dataset.status === 'published') score.accessible++;

  // Interoperable: structured data indicators
  if (dataset.columns && dataset.columns.length >= 3) score.interoperable++;
  if (dataset.columns && dataset.columns.length >= 5) score.interoperable++;
  if (dataset.category) score.interoperable++;
  if (dataset.tags && dataset.tags.length >= 2) score.interoperable++;
  if (dataset.dataStandards?.length > 0) score.interoperable++;

  // Reusable: documentation quality
  if (dataset.description && dataset.description.length > 100) score.reusable++;
  if (dataset.dateRange && dataset.dateRange.from && dataset.dateRange.to) score.reusable++;
  if (dataset.tags && dataset.tags.length >= 3) score.reusable++;
  if (dataset.license) score.reusable++;
  if (dataset.columns && dataset.columns.length >= 4) score.reusable++;

  score.total = score.findable + score.accessible + score.interoperable + score.reusable;
  return score;
}

export function getFairLabel(total) {
  if (total >= 16) return 'Excellent';
  if (total >= 12) return 'Good';
  if (total >= 8) return 'Fair';
  return 'Needs Improvement';
}

export function getFairColor(total) {
  if (total >= 16) return 'text-emerald-600';
  if (total >= 12) return 'text-teal-700';
  if (total >= 8) return 'text-teal-600';
  return 'text-red-600';
}
