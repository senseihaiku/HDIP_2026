// eslint-disable-next-line no-unused-vars
export default function DictionaryTab({ dataset }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm text-center">
      <svg
        className="w-12 h-12 mx-auto mb-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
        />
      </svg>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Dictionary</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        A comprehensive data dictionary with detailed column descriptions, data types,
        value ranges, and coding schemas will be available here in a future release.
      </p>
      <button
        disabled
        className="bg-gray-100 text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed"
      >
        View Dictionary (Coming Soon)
      </button>
    </div>
  );
}
