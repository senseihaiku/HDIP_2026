export default function UseCasesTab({ dataset }) {
  const useCases = dataset.useCases || [];

  if (useCases.length === 0) {
    return (
      <p className="text-gray-400 italic text-sm">
        No use cases have been documented for this dataset yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {useCases.map((useCase, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
        >
          <svg
            className="w-8 h-8 text-teal-500 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
            />
          </svg>
          <h4 className="font-semibold text-gray-900 mb-1">{useCase.title}</h4>
          <p className="text-gray-600 text-sm">{useCase.description}</p>
        </div>
      ))}
    </div>
  );
}
