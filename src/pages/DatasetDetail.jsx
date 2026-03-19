import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import DatasetHeader from '../components/dataset-detail/DatasetHeader';
import DatasetSidebar from '../components/dataset-detail/DatasetSidebar';
import OverviewTab from '../components/dataset-detail/OverviewTab';
import DetailsTab from '../components/dataset-detail/DetailsTab';
import DictionaryTab from '../components/dataset-detail/DictionaryTab';
import SampleTab from '../components/dataset-detail/SampleTab';
import AccessTab from '../components/dataset-detail/AccessTab';
import UseCasesTab from '../components/dataset-detail/UseCasesTab';
import PublicationsTab from '../components/dataset-detail/PublicationsTab';
import FaqTab from '../components/dataset-detail/FaqTab';

const ACCESS_MODEL_INFO = {
  a2d: {
    label: 'Algorithm to Data (A2D)',
    description:
      'Your analysis algorithm is sent to and executed on the data inside a secure compute environment. Raw data never leaves the holder.',
  },
  'data-behind-glass': {
    label: 'Data Behind Glass',
    description:
      'Access and explore the data interactively within a monitored Glass Sandbox environment. Results are reviewed before export.',
  },
  'metadata-light': {
    label: 'Metadata Light',
    description:
      'Access aggregated statistics, column descriptions, and metadata without direct access to individual-level records.',
  },
};

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'dictionary', label: 'Dictionary' },
  { id: 'sample', label: 'Sample' },
  { id: 'access', label: 'Access' },
  { id: 'use-cases', label: 'Use Cases' },
  { id: 'publications', label: 'Publications' },
  { id: 'faq', label: 'FAQ' },
];

/* ===== Request Access Modal — 3-Step Wizard ===== */
const RESEARCH_TYPES = [
  'Clinical Study',
  'Epidemiology',
  'AI/ML Development',
  'Registry Study',
  'Quality Improvement',
  'Other',
];

const INTENDED_USES = [
  'Statistical Analysis',
  'Data Linking',
  'Training ML Model',
  'Visualization',
  'Quality Improvement',
  'Other',
];

const STEP_LABELS = ['Research Context', 'Data Use', 'Documentation & Review'];

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function RequestAccessModal({ dataset, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [stepErrors, setStepErrors] = useState({});

  // Step 1 — Research Context
  const [accessModel, setAccessModel] = useState(dataset.accessModels[0] || '');
  const [researchType, setResearchType] = useState('');
  const [organization, setOrganization] = useState('');
  const [ethicsApproval, setEthicsApproval] = useState('');
  const [ethicsDnr, setEthicsDnr] = useState('');
  const [timePeriodFrom, setTimePeriodFrom] = useState('');
  const [timePeriodTo, setTimePeriodTo] = useState('');

  // Step 2 — Data Use
  const [intendedUse, setIntendedUse] = useState([]);
  const [purpose, setPurpose] = useState('');

  // Step 3 — Documentation & Review
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const validateStep = (s) => {
    const errors = {};
    if (s === 1) {
      if (!accessModel) errors.accessModel = 'Access model is required';
      if (!researchType) errors.researchType = 'Research type is required';
    } else if (s === 2) {
      if (intendedUse.length === 0) errors.intendedUse = 'Select at least one intended use';
    }
    // Step 3 has no required fields
    return errors;
  };

  const handleNext = () => {
    const errors = validateStep(step);
    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      return;
    }
    setStepErrors({});
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setStepErrors({});
    setStep((s) => s - 1);
  };

  const toggleIntendedUse = (use) => {
    setIntendedUse((prev) =>
      prev.includes(use) ? prev.filter((u) => u !== use) : [...prev, use]
    );
    if (stepErrors.intendedUse) {
      setStepErrors((prev) => {
        const next = { ...prev };
        delete next.intendedUse;
        return next;
      });
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((f) => ({ name: f.name, size: f.size, type: f.type }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit({
        accessModel,
        researchType,
        organization: organization.trim(),
        ethicsApproval,
        ethicsDnr: ethicsApproval === 'yes' ? ethicsDnr.trim() : '',
        timePeriod: { from: timePeriodFrom, to: timePeriodTo },
        intendedUse,
        purpose: purpose.trim(),
        uploadedFiles,
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none';

  /* ----- Success screen ----- */
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
              <svg className="h-7 w-7 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Request Submitted</h3>
            <p className="text-sm text-gray-600 mb-6">
              Your access request for <span className="font-medium">{dataset.title}</span> has been submitted successfully. The data holder will review your request.
            </p>
            <button onClick={onClose} className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors">
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ----- Step indicator ----- */
  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === step;
        const isCompleted = stepNum < step;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  isCompleted
                    ? 'bg-teal-600 text-white'
                    : isActive
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`mt-1.5 text-xs font-medium whitespace-nowrap ${
                  isActive || isCompleted ? 'text-teal-700' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
            {stepNum < STEP_LABELS.length && (
              <div
                className={`mx-3 mt-[-1rem] h-0.5 flex-1 ${
                  isCompleted ? 'bg-teal-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  /* ----- Step 1: Research Context ----- */
  const renderStep1 = () => (
    <div className="space-y-4">
      {/* Access Model */}
      <div>
        <label htmlFor="req-access-model" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Access Model <span className="text-red-500">*</span>
        </label>
        <select
          id="req-access-model"
          value={accessModel}
          onChange={(e) => { setAccessModel(e.target.value); setStepErrors((p) => { const n = { ...p }; delete n.accessModel; return n; }); }}
          className={`${inputClass} bg-white`}
        >
          <option value="">Select access model...</option>
          {dataset.accessModels.map((model) => (
            <option key={model} value={model}>{ACCESS_MODEL_INFO[model]?.label || model}</option>
          ))}
        </select>
        {accessModel && ACCESS_MODEL_INFO[accessModel] && (
          <p className="mt-1.5 text-xs text-gray-500">{ACCESS_MODEL_INFO[accessModel].description}</p>
        )}
        {stepErrors.accessModel && <p className="mt-1 text-xs text-red-600">{stepErrors.accessModel}</p>}
      </div>

      {/* Research Type */}
      <div>
        <label htmlFor="req-research-type" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Research Type <span className="text-red-500">*</span>
        </label>
        <select
          id="req-research-type"
          value={researchType}
          onChange={(e) => { setResearchType(e.target.value); setStepErrors((p) => { const n = { ...p }; delete n.researchType; return n; }); }}
          className={`${inputClass} bg-white`}
        >
          <option value="">Select research type...</option>
          {RESEARCH_TYPES.map((rt) => (
            <option key={rt} value={rt}>{rt}</option>
          ))}
        </select>
        {stepErrors.researchType && <p className="mt-1 text-xs text-red-600">{stepErrors.researchType}</p>}
      </div>

      {/* Organization */}
      <div>
        <label htmlFor="req-organization" className="block text-sm font-semibold text-gray-700 mb-1.5">Organization</label>
        <input
          id="req-organization"
          type="text"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder="e.g. University of Gothenburg"
          className={inputClass}
        />
      </div>

      {/* Ethics Approval */}
      <div>
        <span className="block text-sm font-semibold text-gray-700 mb-2">Ethics Approval</span>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="ethics-approval"
              value="yes"
              checked={ethicsApproval === 'yes'}
              onChange={() => setEthicsApproval('yes')}
              className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
            />
            Yes
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="ethics-approval"
              value="no"
              checked={ethicsApproval === 'no'}
              onChange={() => { setEthicsApproval('no'); setEthicsDnr(''); }}
              className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
            />
            No
          </label>
        </div>
        {ethicsApproval === 'yes' && (
          <div className="mt-3">
            <label htmlFor="req-ethics-dnr" className="block text-sm font-medium text-gray-600 mb-1">
              Ethics Review Number (DNR)
            </label>
            <input
              id="req-ethics-dnr"
              type="text"
              value={ethicsDnr}
              onChange={(e) => setEthicsDnr(e.target.value)}
              placeholder="e.g. 2024-01234-01"
              className={inputClass}
            />
          </div>
        )}
      </div>

      {/* Time Period */}
      <div>
        <span className="block text-sm font-semibold text-gray-700 mb-1.5">Time Period</span>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="req-time-from" className="block text-xs text-gray-500 mb-1">From</label>
            <input
              id="req-time-from"
              type="date"
              value={timePeriodFrom}
              onChange={(e) => setTimePeriodFrom(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="req-time-to" className="block text-xs text-gray-500 mb-1">To</label>
            <input
              id="req-time-to"
              type="date"
              value={timePeriodTo}
              onChange={(e) => setTimePeriodTo(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );

  /* ----- Step 2: Data Use ----- */
  const renderStep2 = () => (
    <div className="space-y-4">
      {/* Intended Data Use */}
      <div>
        <span className="block text-sm font-semibold text-gray-700 mb-2">
          Intended Data Use <span className="text-red-500">*</span>
        </span>
        <div className="grid grid-cols-2 gap-2">
          {INTENDED_USES.map((use) => (
            <label
              key={use}
              className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                intendedUse.includes(use)
                  ? 'border-teal-500 bg-teal-50 text-teal-800'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={intendedUse.includes(use)}
                onChange={() => toggleIntendedUse(use)}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              {use}
            </label>
          ))}
        </div>
        {stepErrors.intendedUse && <p className="mt-1 text-xs text-red-600">{stepErrors.intendedUse}</p>}
      </div>

      {/* Purpose Description */}
      <div>
        <label htmlFor="req-purpose" className="block text-sm font-semibold text-gray-700 mb-1.5">Purpose Description</label>
        <textarea
          id="req-purpose"
          rows={4}
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Provide additional details about your research purpose and how you intend to use this dataset..."
          className={`${inputClass} resize-none placeholder:text-gray-400`}
        />
      </div>
    </div>
  );

  /* ----- Step 3: Documentation & Review ----- */
  const renderStep3 = () => (
    <div className="space-y-5">
      {/* File Upload */}
      <div>
        <span className="block text-sm font-semibold text-gray-700 mb-2">Supporting Documents</span>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-colors"
        >
          <svg className="h-8 w-8 text-gray-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
          </svg>
          <p className="text-sm font-medium text-gray-600">Click to upload files</p>
          <p className="text-xs text-gray-400 mt-1">PDF, DOCX, DOC, TXT</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        {uploadedFiles.length > 0 && (
          <ul className="mt-3 space-y-2">
            {uploadedFiles.map((file, i) => (
              <li key={`${file.name}-${i}`} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="h-4 w-4 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">{formatFileSize(file.size)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="ml-2 flex-shrink-0 rounded p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Review Summary */}
      <div>
        <span className="block text-sm font-semibold text-gray-700 mb-2">Review Summary</span>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <dt className="text-xs font-medium text-gray-500">Access Model</dt>
              <dd className="text-gray-800">{ACCESS_MODEL_INFO[accessModel]?.label || accessModel || '--'}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Research Type</dt>
              <dd className="text-gray-800">{researchType || '--'}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Organization</dt>
              <dd className="text-gray-800">{organization.trim() || '--'}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Ethics Approval</dt>
              <dd className="text-gray-800">
                {ethicsApproval === 'yes' ? `Yes${ethicsDnr.trim() ? ` (${ethicsDnr.trim()})` : ''}` : ethicsApproval === 'no' ? 'No' : '--'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Time Period</dt>
              <dd className="text-gray-800">
                {timePeriodFrom || timePeriodTo
                  ? `${timePeriodFrom || '...'} to ${timePeriodTo || '...'}`
                  : '--'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Intended Use</dt>
              <dd className="text-gray-800">{intendedUse.length > 0 ? intendedUse.join(', ') : '--'}</dd>
            </div>
            {purpose.trim() && (
              <div className="col-span-2">
                <dt className="text-xs font-medium text-gray-500">Purpose</dt>
                <dd className="text-gray-800 whitespace-pre-line">{purpose.trim()}</dd>
              </div>
            )}
            {uploadedFiles.length > 0 && (
              <div className="col-span-2">
                <dt className="text-xs font-medium text-gray-500">Uploaded Files</dt>
                <dd className="text-gray-800">{uploadedFiles.map((f) => f.name).join(', ')}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Request Access</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {dataset.title}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Close">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-4">
          <StepIndicator />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-2">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Main DatasetDetail Component ===== */
export default function DatasetDetail() {
  const { id } = useParams();
  const { getDataset, searchDatasets, createRequest, toggleBookmark, isBookmarked } = useData();
  const { currentUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showRequestModal, setShowRequestModal] = useState(false);

  const dataset = getDataset(id);

  const relatedDatasets = useMemo(() => {
    if (!dataset) return [];
    return searchDatasets('', {})
      .filter((ds) => ds.holder.id === dataset.holder.id && ds.id !== dataset.id)
      .slice(0, 4);
  }, [dataset, searchDatasets]);

  if (!dataset) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dataset Not Found</h1>
          <p className="text-gray-600 mb-6">The dataset you are looking for does not exist or may have been removed.</p>
          <Link to="/catalog" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const bookmarked = isAuthenticated && isBookmarked(dataset.id);

  const handleRequestSubmit = async ({ accessModel, purpose }) => {
    await createRequest({
      datasetId: dataset.id,
      requesterId: currentUser.id,
      accessModel,
      purpose,
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab dataset={dataset} />;
      case 'details':
        return <DetailsTab dataset={dataset} />;
      case 'dictionary':
        return <DictionaryTab dataset={dataset} />;
      case 'sample':
        return <SampleTab dataset={dataset} />;
      case 'access':
        return <AccessTab dataset={dataset} />;
      case 'use-cases':
        return <UseCasesTab dataset={dataset} />;
      case 'publications':
        return <PublicationsTab dataset={dataset} />;
      case 'faq':
        return <FaqTab dataset={dataset} />;
      default:
        return <OverviewTab dataset={dataset} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <DatasetHeader
        dataset={dataset}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        bookmarked={bookmarked}
        onToggleBookmark={() => toggleBookmark(dataset.id)}
        onRequestAccess={() => setShowRequestModal(true)}
      />

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mt-6 mb-8">
        <nav className="flex gap-0 overflow-x-auto -mb-px" aria-label="Dataset tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content + Sidebar */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {renderTabContent()}
        </div>
        <div>
          <DatasetSidebar dataset={dataset} relatedDatasets={relatedDatasets} />
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
