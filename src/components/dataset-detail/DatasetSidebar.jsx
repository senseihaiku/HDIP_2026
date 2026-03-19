import { Link } from 'react-router-dom';

export default function DatasetSidebar({ dataset, relatedDatasets }) {
  return (
    <div className="space-y-6">
      {/* Data Provider Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center">
        <div className="bg-gray-100 rounded-full p-3 mx-auto mb-3 w-14 h-14 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
            />
          </svg>
        </div>
        <Link
          to={`/providers/${dataset.holder.id}`}
          className="text-teal-600 font-semibold text-lg hover:underline"
        >
          {dataset.holder.name}
        </Link>
        <p className="text-sm text-gray-500 mt-2">
          Official provider of this dataset. Click to view more datasets from
          them.
        </p>
      </div>

      {/* Related Datasets Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Related Datasets</h3>
        {relatedDatasets && relatedDatasets.length > 0 ? (
          <ul className="space-y-2.5">
            {relatedDatasets.map((ds) => (
              <li key={ds.id}>
                <Link
                  to={`/catalog/${ds.id}`}
                  className="text-teal-600 hover:text-teal-700 text-sm"
                >
                  {ds.title}{' '}
                  <span className="text-gray-400">(ID: {ds.id})</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm italic">
            No related datasets found.
          </p>
        )}
      </div>
    </div>
  );
}
