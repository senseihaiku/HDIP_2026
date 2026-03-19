import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
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

const DATA_TYPE_OPTIONS = [
  'Clinical/Journal',
  'Genomics/Bioinformatics',
  'Imaging',
  'Biobank/Samples',
  'Physiological',
];

const FILE_FORMAT_OPTIONS = [
  'CSV', 'TSV', 'JSON', 'Parquet', 'Excel', 'DICOM',
  'FHIR/JSON', 'HL7', 'VCF', 'BAM/CRAM', 'PDF', 'XML', 'HDF5', 'SQLite',
];

const SENSITIVITY_LEVELS = [
  { value: '', label: 'Select sensitivity level...' },
  { value: 'Special Category', label: 'Special Category' },
  { value: 'Pseudonymized', label: 'Pseudonymized' },
  { value: 'Anonymized', label: 'Anonymized' },
  { value: 'Aggregated', label: 'Aggregated' },
];

const LICENSE_OPTIONS = [
  { value: '', label: 'Select license...' },
  { value: 'CC BY 4.0', label: 'CC BY 4.0' },
  { value: 'CC BY-NC 4.0', label: 'CC BY-NC 4.0' },
  { value: 'Research Only', label: 'Research Only' },
  { value: 'Custom DUA Required', label: 'Custom DUA Required' },
];

const UPDATE_FREQUENCY_OPTIONS = [
  { value: '', label: 'Select frequency...' },
  { value: 'One-time', label: 'One-time' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Quarterly', label: 'Quarterly' },
  { value: 'Annual', label: 'Annual' },
  { value: 'Ongoing', label: 'Ongoing' },
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
  dataTypes: [],
  fileFormats: [],
  customFileFormat: '',
  sensitivityLevel: '',
  dataSize: '',
  cohortAgeRange: '',
  cohortSexMale: '',
  cohortSexFemale: '',
  cohortGeographicArea: '',
  cohortSampleSize: '',
  cohortDescription: '',
  license: '',
  methodology: '',
  limitations: '',
  updateFrequency: '',
  useCases: [],
  publications: [],
  faq: [],
};

/* ── Chevron icon ──────────────────────────────────────────────── */
function ChevronIcon({ open }) {
  return (
    <svg
      className={`h-4 w-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

/* ── Section wrapper ───────────────────────────────────────────── */
function Section({ title, open, onToggle, alwaysOpen, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <button
        type="button"
        onClick={alwaysOpen ? undefined : onToggle}
        className={`flex items-center justify-between w-full px-6 py-3 text-left text-sm font-semibold text-gray-900 ${alwaysOpen ? 'cursor-default' : 'cursor-pointer'}`}
      >
        {title}
        {!alwaysOpen && <ChevronIcon open={open} />}
      </button>
      {open && <div className="px-6 pb-6 space-y-5">{children}</div>}
    </div>
  );
}

export default function NewDataset() {
  const { currentUser } = useAuth();
  const { addDataset } = useData();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [openSections, setOpenSections] = useState(
    new Set(['basic', 'data-char', 'records', 'cohort', 'access', 'enrichment', 'methodology'])
  );

  const toggleSection = (id) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /* ── Field helpers ─────────────────────────────────────────── */
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

  const toggleMulti = (field, value) => {
    setForm((prev) => {
      const current = prev[field];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: next };
    });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  /* ── Dynamic list helpers ──────────────────────────────────── */
  const addUseCase = () =>
    setForm((prev) => ({
      ...prev,
      useCases: [...prev.useCases, { title: '', description: '' }],
    }));
  const removeUseCase = (idx) =>
    setForm((prev) => ({
      ...prev,
      useCases: prev.useCases.filter((_, i) => i !== idx),
    }));
  const updateUseCase = (idx, field, value) =>
    setForm((prev) => ({
      ...prev,
      useCases: prev.useCases.map((uc, i) =>
        i === idx ? { ...uc, [field]: value } : uc
      ),
    }));

  const addPublication = () =>
    setForm((prev) => ({
      ...prev,
      publications: [
        ...prev.publications,
        { title: '', authors: '', journal: '', year: '', doi: '', url: '' },
      ],
    }));
  const removePublication = (idx) =>
    setForm((prev) => ({
      ...prev,
      publications: prev.publications.filter((_, i) => i !== idx),
    }));
  const updatePublication = (idx, field, value) =>
    setForm((prev) => ({
      ...prev,
      publications: prev.publications.map((pub, i) =>
        i === idx ? { ...pub, [field]: value } : pub
      ),
    }));

  const addFaq = () =>
    setForm((prev) => ({
      ...prev,
      faq: [...prev.faq, { question: '', answer: '' }],
    }));
  const removeFaq = (idx) =>
    setForm((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== idx),
    }));
  const updateFaq = (idx, field, value) =>
    setForm((prev) => ({
      ...prev,
      faq: prev.faq.map((f, i) => (i === idx ? { ...f, [field]: value } : f)),
    }));

  /* ── FAIR preview ──────────────────────────────────────────── */
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
      license: form.license,
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

  /* ── Validation ────────────────────────────────────────────── */
  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (form.accessModels.length === 0)
      newErrors.accessModels = 'Select at least one access model';
    return newErrors;
  };

  /* ── Submit ────────────────────────────────────────────────── */
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

    // Build fileFormats — append custom if provided
    const fileFormats = form.customFileFormat.trim()
      ? [...form.fileFormats, form.customFileFormat.trim()]
      : [...form.fileFormats];

    // Build cohort object
    const cohort = {
      ageRange: form.cohortAgeRange.trim(),
      sexDistribution: {
        male: Number(form.cohortSexMale) || 0,
        female: Number(form.cohortSexFemale) || 0,
      },
      geographicArea: form.cohortGeographicArea.trim(),
      sampleSize: Number(form.cohortSampleSize) || 0,
      description: form.cohortDescription.trim(),
    };

    // Filter empty dynamic entries
    const useCases = form.useCases.filter(
      (uc) => uc.title.trim() || uc.description.trim()
    );
    const publications = form.publications.filter(
      (pub) => pub.title.trim() || pub.authors.trim()
    );
    const faq = form.faq.filter(
      (f) => f.question.trim() || f.answer.trim()
    );

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
      dataTypes: form.dataTypes,
      fileFormats,
      sensitivityLevel: form.sensitivityLevel,
      dataSize: form.dataSize.trim(),
      cohort,
      license: form.license,
      methodology: form.methodology.trim(),
      limitations: form.limitations.trim(),
      updateFrequency: form.updateFrequency,
      useCases,
      publications,
      faq,
      holder: {
        id: currentUser?.id ?? 'unknown',
        name: currentUser?.organization ?? 'Unknown',
        type:
          currentUser?.membershipTier === 'strategic' ? 'private' : 'public',
      },
      status: 'draft',
    });

    navigate('/dashboard/holder');
  };

  /* ── Style helpers ─────────────────────────────────────────── */
  const inputBase =
    'rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none';
  const inputError =
    'rounded-lg border border-red-400 px-3 py-2 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none';

  const inputClass = (field) =>
    `block w-full ${errors[field] ? inputError : inputBase}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Register New Dataset</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to register a dataset for{' '}
          {currentUser?.organization}.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left column: form sections ─────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* ═══ 1. Basic Information ═══════════════════════════ */}
            <Section
              id="basic"
              title="Basic Information"
              open={true}
              alwaysOpen
            >
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  className={inputClass('title')}
                  placeholder="e.g. Regional Patient Flow Data 2019-2023"
                />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
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
                  <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Category + Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
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
                    <p className="mt-1 text-xs text-red-600">{errors.category}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
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
            </Section>

            {/* ═══ 2. Data Characteristics ════════════════════════ */}
            <Section
              id="data-char"
              title="Data Characteristics"
              open={openSections.has('data-char')}
              onToggle={() => toggleSection('data-char')}
            >
              {/* Data Types */}
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">Data Types</span>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {DATA_TYPE_OPTIONS.map((dt) => (
                    <label key={dt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.dataTypes.includes(dt)}
                        onChange={() => toggleMulti('dataTypes', dt)}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700">{dt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* File Formats */}
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">File Formats</span>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {FILE_FORMAT_OPTIONS.map((ff) => (
                    <label key={ff} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.fileFormats.includes(ff)}
                        onChange={() => toggleMulti('fileFormats', ff)}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700">{ff}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-3">
                  <label htmlFor="customFileFormat" className="block text-xs font-medium text-gray-500 mb-1">
                    Other format
                  </label>
                  <input
                    id="customFileFormat"
                    type="text"
                    value={form.customFileFormat}
                    onChange={(e) => update('customFileFormat', e.target.value)}
                    className={`${inputBase} w-full sm:w-56`}
                    placeholder="e.g. NIFTI, FASTQ"
                  />
                </div>
              </div>

              {/* Sensitivity Level + Dataset Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="sensitivityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                    Sensitivity Level
                  </label>
                  <select
                    id="sensitivityLevel"
                    value={form.sensitivityLevel}
                    onChange={(e) => update('sensitivityLevel', e.target.value)}
                    className={`${inputBase} bg-white w-full`}
                  >
                    {SENSITIVITY_LEVELS.map((sl) => (
                      <option key={sl.value} value={sl.value}>
                        {sl.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="dataSize" className="block text-sm font-medium text-gray-700 mb-1">
                    Dataset Size
                  </label>
                  <input
                    id="dataSize"
                    type="text"
                    value={form.dataSize}
                    onChange={(e) => update('dataSize', e.target.value)}
                    className={`${inputBase} w-full`}
                    placeholder="e.g., 2.3 GB"
                  />
                </div>
              </div>
            </Section>

            {/* ═══ 3. Records & Schema ════════════════════════════ */}
            <Section
              id="records"
              title="Records & Schema"
              open={openSections.has('records')}
              onToggle={() => toggleSection('records')}
            >
              {/* Record Count + Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="recordCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Record Count
                  </label>
                  <input
                    id="recordCount"
                    type="number"
                    min="0"
                    value={form.recordCount}
                    onChange={(e) => update('recordCount', e.target.value)}
                    className={`${inputBase} w-full`}
                    placeholder="e.g. 245000"
                  />
                </div>
                <div>
                  <label htmlFor="columns" className="block text-sm font-medium text-gray-700 mb-1">
                    Columns / Fields
                  </label>
                  <input
                    id="columns"
                    type="text"
                    value={form.columns}
                    onChange={(e) => update('columns', e.target.value)}
                    className={`${inputBase} w-full`}
                    placeholder="comma-separated, e.g. patient_id, date, diagnosis"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range From
                  </label>
                  <input
                    id="dateFrom"
                    type="date"
                    value={form.dateFrom}
                    onChange={(e) => update('dateFrom', e.target.value)}
                    className={`${inputBase} w-full`}
                  />
                </div>
                <div>
                  <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range To
                  </label>
                  <input
                    id="dateTo"
                    type="date"
                    value={form.dateTo}
                    onChange={(e) => update('dateTo', e.target.value)}
                    className={`${inputBase} w-full`}
                  />
                </div>
              </div>
            </Section>

            {/* ═══ 4. Cohort Description ═════════════════════════ */}
            <Section
              id="cohort"
              title="Cohort Description"
              open={openSections.has('cohort')}
              onToggle={() => toggleSection('cohort')}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="cohortAgeRange" className="block text-sm font-medium text-gray-700 mb-1">
                    Age Range
                  </label>
                  <input
                    id="cohortAgeRange"
                    type="text"
                    value={form.cohortAgeRange}
                    onChange={(e) => update('cohortAgeRange', e.target.value)}
                    className={`${inputBase} w-full`}
                    placeholder="e.g., 18-85"
                  />
                </div>
                <div>
                  <label htmlFor="cohortGeographicArea" className="block text-sm font-medium text-gray-700 mb-1">
                    Geographic Area
                  </label>
                  <input
                    id="cohortGeographicArea"
                    type="text"
                    value={form.cohortGeographicArea}
                    onChange={(e) => update('cohortGeographicArea', e.target.value)}
                    className={`${inputBase} w-full`}
                    placeholder="e.g., Western Sweden"
                  />
                </div>
              </div>

              {/* Sex Distribution */}
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">Sex Distribution (%)</span>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="cohortSexMale" className="block text-xs text-gray-500 mb-1">
                      Male %
                    </label>
                    <input
                      id="cohortSexMale"
                      type="number"
                      min="0"
                      max="100"
                      value={form.cohortSexMale}
                      onChange={(e) => update('cohortSexMale', e.target.value)}
                      className={`${inputBase} w-full`}
                      placeholder="0-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="cohortSexFemale" className="block text-xs text-gray-500 mb-1">
                      Female %
                    </label>
                    <input
                      id="cohortSexFemale"
                      type="number"
                      min="0"
                      max="100"
                      value={form.cohortSexFemale}
                      onChange={(e) => update('cohortSexFemale', e.target.value)}
                      className={`${inputBase} w-full`}
                      placeholder="0-100"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="cohortSampleSize" className="block text-sm font-medium text-gray-700 mb-1">
                    Sample Size
                  </label>
                  <input
                    id="cohortSampleSize"
                    type="number"
                    min="0"
                    value={form.cohortSampleSize}
                    onChange={(e) => update('cohortSampleSize', e.target.value)}
                    className={`${inputBase} w-full`}
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cohortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="cohortDescription"
                  rows={3}
                  value={form.cohortDescription}
                  onChange={(e) => update('cohortDescription', e.target.value)}
                  className={`${inputBase} w-full`}
                  placeholder="Describe conditions, biomarkers, inclusion/exclusion criteria..."
                />
              </div>
            </Section>

            {/* ═══ 5. Access & Compliance ═════════════════════════ */}
            <Section
              id="access"
              title="Access & Compliance"
              open={openSections.has('access')}
              onToggle={() => toggleSection('access')}
            >
              {/* Access Models */}
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Access Models <span className="text-red-500">*</span>
                </span>
                <div className="space-y-2">
                  {ACCESS_MODEL_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.accessModels.includes(opt.value)}
                        onChange={() => toggleMulti('accessModels', opt.value)}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
                {errors.accessModels && (
                  <p className="mt-1 text-xs text-red-600">{errors.accessModels}</p>
                )}
              </div>

              {/* License */}
              <div>
                <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">
                  License
                </label>
                <select
                  id="license"
                  value={form.license}
                  onChange={(e) => update('license', e.target.value)}
                  className={`${inputBase} bg-white w-full`}
                >
                  {LICENSE_OPTIONS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </Section>

            {/* ═══ 6. Enrichment ══════════════════════════════════ */}
            <Section
              id="enrichment"
              title="Enrichment (optional)"
              open={openSections.has('enrichment')}
              onToggle={() => toggleSection('enrichment')}
            >
              {/* Use Cases */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Use Cases</span>
                  <button
                    type="button"
                    onClick={addUseCase}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Use Case
                  </button>
                </div>
                {form.useCases.length === 0 && (
                  <p className="text-xs text-gray-400">No use cases added yet.</p>
                )}
                <div className="space-y-3">
                  {form.useCases.map((uc, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Use Case {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeUseCase(idx)}
                          className="text-sm text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        value={uc.title}
                        onChange={(e) => updateUseCase(idx, 'title', e.target.value)}
                        className={`${inputBase} w-full`}
                        placeholder="Title"
                      />
                      <textarea
                        rows={2}
                        value={uc.description}
                        onChange={(e) => updateUseCase(idx, 'description', e.target.value)}
                        className={`${inputBase} w-full`}
                        placeholder="Description"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Publications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Publications</span>
                  <button
                    type="button"
                    onClick={addPublication}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Publication
                  </button>
                </div>
                {form.publications.length === 0 && (
                  <p className="text-xs text-gray-400">No publications added yet.</p>
                )}
                <div className="space-y-3">
                  {form.publications.map((pub, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Publication {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removePublication(idx)}
                          className="text-sm text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        value={pub.title}
                        onChange={(e) => updatePublication(idx, 'title', e.target.value)}
                        className={`${inputBase} w-full`}
                        placeholder="Title"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={pub.authors}
                          onChange={(e) => updatePublication(idx, 'authors', e.target.value)}
                          className={`${inputBase} w-full`}
                          placeholder="Authors"
                        />
                        <input
                          type="text"
                          value={pub.journal}
                          onChange={(e) => updatePublication(idx, 'journal', e.target.value)}
                          className={`${inputBase} w-full`}
                          placeholder="Journal"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={pub.year}
                          onChange={(e) => updatePublication(idx, 'year', e.target.value)}
                          className={`${inputBase} w-full`}
                          placeholder="Year"
                        />
                        <input
                          type="text"
                          value={pub.doi}
                          onChange={(e) => updatePublication(idx, 'doi', e.target.value)}
                          className={`${inputBase} w-full`}
                          placeholder="DOI"
                        />
                        <input
                          type="text"
                          value={pub.url}
                          onChange={(e) => updatePublication(idx, 'url', e.target.value)}
                          className={`${inputBase} w-full`}
                          placeholder="URL"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">FAQ</span>
                  <button
                    type="button"
                    onClick={addFaq}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add FAQ
                  </button>
                </div>
                {form.faq.length === 0 && (
                  <p className="text-xs text-gray-400">No FAQ entries added yet.</p>
                )}
                <div className="space-y-3">
                  {form.faq.map((f, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">FAQ {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeFaq(idx)}
                          className="text-sm text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        value={f.question}
                        onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                        className={`${inputBase} w-full`}
                        placeholder="Question"
                      />
                      <textarea
                        rows={2}
                        value={f.answer}
                        onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                        className={`${inputBase} w-full`}
                        placeholder="Answer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* ═══ 7. Methodology & Limitations ══════════════════ */}
            <Section
              id="methodology"
              title="Methodology & Limitations (optional)"
              open={openSections.has('methodology')}
              onToggle={() => toggleSection('methodology')}
            >
              <div>
                <label htmlFor="methodology" className="block text-sm font-medium text-gray-700 mb-1">
                  Methodology
                </label>
                <textarea
                  id="methodology"
                  rows={4}
                  value={form.methodology}
                  onChange={(e) => update('methodology', e.target.value)}
                  className={`${inputBase} w-full`}
                  placeholder="Describe data collection methods, study design, instruments used..."
                />
              </div>

              <div>
                <label htmlFor="limitations" className="block text-sm font-medium text-gray-700 mb-1">
                  Limitations
                </label>
                <textarea
                  id="limitations"
                  rows={3}
                  value={form.limitations}
                  onChange={(e) => update('limitations', e.target.value)}
                  className={`${inputBase} w-full`}
                  placeholder="Known limitations, biases, or caveats..."
                />
              </div>

              <div>
                <label htmlFor="updateFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Update Frequency
                </label>
                <select
                  id="updateFrequency"
                  value={form.updateFrequency}
                  onChange={(e) => update('updateFrequency', e.target.value)}
                  className={`${inputBase} bg-white w-full`}
                >
                  {UPDATE_FREQUENCY_OPTIONS.map((uf) => (
                    <option key={uf.value} value={uf.value}>
                      {uf.label}
                    </option>
                  ))}
                </select>
              </div>
            </Section>

            {/* Submit buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Registering...' : 'Register Dataset'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/holder')}
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* ── Right column: live FAIR score preview ──────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  FAIR Score Preview
                </h3>
                <FairBadge score={fairScore} detailed />
                <div className="mt-3 text-center">
                  <span className={`text-sm font-semibold ${getFairColor(fairScore.total)}`}>
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
                  <li>Write a description longer than 100 characters</li>
                  <li>Add at least 3 tags</li>
                  <li>List 5 or more columns/fields</li>
                  <li>Enable multiple access models</li>
                  <li>Specify both date range start and end</li>
                  <li>Select a license for reusability</li>
                  <li>Add cohort and methodology details</li>
                  <li>Include use cases and publications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
