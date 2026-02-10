import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { calculateFairScore, getFairLabel, getFairColor } from '../../utils/fairScore';
import FairBadge from '../../components/FairBadge';

const CATEGORIES = [
  { value: '', label: 'Select a category...' },
  { value: 'patient-flow', label: 'Patient Flow' },
  { value: 'genomics', label: 'Genomics' },
  { value: 'pharmaceutical', label: 'Pharmaceutical' },
  { value: 'epidemiology', label: 'Epidemiology' },
  { value: 'clinical-trials', label: 'Clinical Trials' },
  { value: 'imaging', label: 'Imaging' },
  { value: 'registry', label: 'Registry' },
  { value: 'biobank', label: 'Biobank' },
];

const ACCESS_MODEL_OPTIONS = [
  { value: 'a2d', label: 'Algorithm to Data (A2D)' },
  { value: 'data-behind-glass', label: 'Data Behind Glass' },
  { value: 'metadata-light', label: 'Metadata Light' },
];

const INITIAL_FORM = {
  title: '',
  description: '',
  category: '',
  tags: '',
  recordCount: '',
  columns: '',
  dateFrom: '',
  dateTo: '',
  accessModels: [],
};

export default function NewDataset() {
  const { currentUser } = useAuth();
  const { addDataset } = useData();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleAccessModel = (model) => {
    setForm((prev) => {
      const current = prev.accessModels;
      const next = current.includes(model)
        ? current.filter((m) => m !== model)
        : [...current, model];
      return { ...prev, accessModels: next };
    });
    if (errors.accessModels) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.accessModels;
        return next;
      });
    }
  };

  // Build a preview dataset object for live FAIR score calculation
  const previewDataset = useMemo(() => {
    const parsedTags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const parsedColumns = form.columns
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    const recordCount = parseInt(form.recordCount, 10) || 0;

    return {
      title: form.title,
      description: form.description,
      category: form.category,
      tags: parsedTags,
      recordCount,
      columns: parsedColumns,
      dateRange:
        form.dateFrom || form.dateTo
          ? { from: form.dateFrom, to: form.dateTo }
          : null,
      accessModels: form.accessModels,
      holder: currentUser
        ? { id: currentUser.id, name: currentUser.organization }
        : null,
      status: 'draft',
    };
  }, [form, currentUser]);

  const fairScore = useMemo(
    () => calculateFairScore(previewDataset),
    [previewDataset]
  );

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim())
      newErrors.description = 'Description is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (form.accessModels.length === 0)
      newErrors.accessModels = 'Select at least one access model';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    const parsedTags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const parsedColumns = form.columns
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    const recordCount = parseInt(form.recordCount, 10) || 0;

    addDataset({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      tags: parsedTags,
      recordCount,
      columns: parsedColumns,
      dateRange:
        form.dateFrom || form.dateTo
          ? { from: form.dateFrom, to: form.dateTo }
          : null,
      accessModels: form.accessModels,
      holder: {
        id: currentUser?.id ?? 'unknown',
        name: currentUser?.organization ?? 'Unknown',
        type: currentUser?.membershipTier === 'strategic' ? 'private' : 'public',
      },
      status: 'draft',
    });

    navigate('/dashboard/holder');
  };

  const inputClass = (field) =>
    `block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors ${
      errors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
        : 'border-gray-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
    }`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Register New Dataset
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to register a dataset for{' '}
          {currentUser?.organization}.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left column: form fields ────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-5">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  className={inputClass('title')}
                  placeholder="e.g. Regional Patient Flow Data 2019-2023"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  className={inputClass('description')}
                  placeholder="Describe the dataset contents, provenance, and intended use..."
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Category + Tags (two columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => update('category', e.target.value)}
                    className={`${inputClass('category')} bg-white`}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tags
                  </label>
                  <input
                    id="tags"
                    type="text"
                    value={form.tags}
                    onChange={(e) => update('tags', e.target.value)}
                    className={inputClass('tags')}
                    placeholder="comma-separated, e.g. anonymized, longitudinal"
                  />
                </div>
              </div>

              {/* Record count + Columns (two columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="recordCount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Record count
                  </label>
                  <input
                    id="recordCount"
                    type="number"
                    min="0"
                    value={form.recordCount}
                    onChange={(e) => update('recordCount', e.target.value)}
                    className={inputClass('recordCount')}
                    placeholder="e.g. 245000"
                  />
                </div>

                <div>
                  <label
                    htmlFor="columns"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Columns
                  </label>
                  <input
                    id="columns"
                    type="text"
                    value={form.columns}
                    onChange={(e) => update('columns', e.target.value)}
                    className={inputClass('columns')}
                    placeholder="comma-separated, e.g. patient_id, date, diagnosis"
                  />
                </div>
              </div>

              {/* Date range (two columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="dateFrom"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date range from
                  </label>
                  <input
                    id="dateFrom"
                    type="date"
                    value={form.dateFrom}
                    onChange={(e) => update('dateFrom', e.target.value)}
                    className={inputClass('dateFrom')}
                  />
                </div>
                <div>
                  <label
                    htmlFor="dateTo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date range to
                  </label>
                  <input
                    id="dateTo"
                    type="date"
                    value={form.dateTo}
                    onChange={(e) => update('dateTo', e.target.value)}
                    className={inputClass('dateTo')}
                  />
                </div>
              </div>

              {/* Access models (checkboxes) */}
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Access models
                </span>
                <div className="space-y-2">
                  {ACCESS_MODEL_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.accessModels.includes(opt.value)}
                        onChange={() => toggleAccessModel(opt.value)}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
                      />
                      <span className="text-sm text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
                {errors.accessModels && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.accessModels}
                  </p>
                )}
              </div>
            </div>

            {/* Submit button */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center rounded-md bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Registering...' : 'Register Dataset'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/holder')}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* ── Right column: live FAIR score preview ────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  FAIR Score Preview
                </h3>
                <FairBadge score={fairScore} detailed />
                <div className="mt-3 text-center">
                  <span
                    className={`text-sm font-semibold ${getFairColor(fairScore.total)}`}
                  >
                    {getFairLabel(fairScore.total)}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {fairScore.total}/20 points
                  </p>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-teal-800 uppercase tracking-wider mb-2">
                  Tips to improve your score
                </h4>
                <ul className="text-xs text-teal-700 space-y-1.5">
                  <li>
                    Write a description longer than 100 characters
                  </li>
                  <li>
                    Add at least 3 tags
                  </li>
                  <li>
                    List 5 or more columns
                  </li>
                  <li>
                    Enable multiple access models
                  </li>
                  <li>
                    Specify both date range start and end
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
