export default function OverviewTab({ dataset }) {
  const cohort = dataset.cohort;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Dataset Overview */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Dataset Overview
        </h3>
        <p className="text-gray-700 leading-relaxed">{dataset.description}</p>
      </div>

      {/* Purpose & Methodology */}
      <div className="border-t border-gray-100 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Purpose &amp; Methodology
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {dataset.methodology || (
            <span className="italic text-gray-400">Not available</span>
          )}
        </p>
      </div>

      {/* Limitations */}
      <div className="border-t border-gray-100 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Limitations
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {dataset.limitations || (
            <span className="italic text-gray-400">Not available</span>
          )}
        </p>
      </div>

      {/* Cohort Description */}
      <div className="border-t border-gray-100 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Cohort Description
        </h3>
        {cohort ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="rounded-lg bg-gray-50 p-3">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age Range
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">
                  {cohort.ageRange || 'N/A'}
                </dd>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sex Distribution
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">
                  {cohort.sexDistribution
                    ? `Male ${cohort.sexDistribution.male}% / Female ${cohort.sexDistribution.female}%`
                    : 'N/A'}
                </dd>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Geographic Area
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">
                  {cohort.geographicArea || 'N/A'}
                </dd>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sample Size
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">
                  {cohort.sampleSize
                    ? cohort.sampleSize.toLocaleString()
                    : 'N/A'}
                </dd>
              </div>
            </div>
            {cohort.description && (
              <p className="text-gray-700 leading-relaxed text-sm">
                {cohort.description}
              </p>
            )}
          </>
        ) : (
          <div className="rounded-lg bg-gray-50 p-6 text-center">
            <svg
              className="mx-auto h-8 w-8 text-gray-300 mb-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
            <p className="text-sm text-gray-400">
              No cohort information available for this dataset.
            </p>
          </div>
        )}
      </div>

      {/* Data Characteristics */}
      {((dataset.dataTypes && dataset.dataTypes.length > 0) ||
        (dataset.fileFormats && dataset.fileFormats.length > 0)) && (
        <div className="border-t border-gray-100 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Data Characteristics
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Data Types */}
            {dataset.dataTypes && dataset.dataTypes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Data Types
                </h4>
                <div className="flex flex-wrap gap-2">
                  {dataset.dataTypes.map((type) => (
                    <span
                      key={type}
                      className="bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-3 py-1 text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* File Formats */}
            {dataset.fileFormats && dataset.fileFormats.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  File Formats
                </h4>
                <div className="flex flex-wrap gap-2">
                  {dataset.fileFormats.map((format) => (
                    <span
                      key={format}
                      className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Key Figures */}
      <div className="border-t border-gray-100 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Key Figures
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-teal-50 p-4 text-center">
            <svg
              className="mx-auto h-5 w-5 text-teal-600 mb-1.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 12c0-.621.504-1.125 1.125-1.125m0 3.75h7.5"
              />
            </svg>
            <p className="text-xs font-medium text-gray-500">Record Count</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">
              {dataset.recordCount
                ? dataset.recordCount.toLocaleString()
                : 'N/A'}
            </p>
          </div>
          <div className="rounded-lg bg-teal-50 p-4 text-center">
            <svg
              className="mx-auto h-5 w-5 text-teal-600 mb-1.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
              />
            </svg>
            <p className="text-xs font-medium text-gray-500">Dataset Size</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">
              {dataset.dataSize || 'N/A'}
            </p>
          </div>
          <div className="rounded-lg bg-teal-50 p-4 text-center">
            <svg
              className="mx-auto h-5 w-5 text-teal-600 mb-1.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
            <p className="text-xs font-medium text-gray-500">Date Range</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">
              {dataset.dateRange
                ? `${new Date(dataset.dateRange.from).getFullYear()} - ${new Date(dataset.dateRange.to).getFullYear()}`
                : 'N/A'}
            </p>
          </div>
          <div className="rounded-lg bg-teal-50 p-4 text-center">
            <svg
              className="mx-auto h-5 w-5 text-teal-600 mb-1.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
              />
            </svg>
            <p className="text-xs font-medium text-gray-500">
              Update Frequency
            </p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">
              {dataset.updateFrequency || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
