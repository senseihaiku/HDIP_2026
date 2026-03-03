import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import DatasetCard from '../../components/DatasetCard';

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  denied: 'bg-red-50 text-red-700 border-red-200',
};

function formatDate(dateStr) {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('en-SE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const { datasets, accessRequests, bookmarks, isBookmarked } = useData();

  // Requests made by the current user
  const myRequests = useMemo(
    () =>
      accessRequests.filter((req) => req.requesterId === currentUser?.id),
    [accessRequests, currentUser]
  );

  // Datasets the user has bookmarked
  const bookmarkedDatasets = useMemo(
    () => datasets.filter((ds) => bookmarks.includes(ds.id)),
    [datasets, bookmarks]
  );

  // Resolve dataset info by id
  const getDataset = (id) => datasets.find((ds) => ds.id === id);

  // Recommended datasets: top 4 published datasets by FAIR score
  const recommended = useMemo(() => {
    return datasets
      .filter((ds) => ds.status === 'published')
      .sort((a, b) => (b.fairScore?.total ?? 0) - (a.fairScore?.total ?? 0))
      .slice(0, 4);
  }, [datasets]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {currentUser?.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {currentUser?.organization}
        </p>
      </div>

      {/* ── My Access Requests ──────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          My Access Requests
        </h2>

        {myRequests.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-12 text-center">
            <p className="text-gray-500 text-sm">
              You have not submitted any access requests yet.
            </p>
            <Link
              to="/catalog"
              className="mt-3 inline-block text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Browse the catalog
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Dataset
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Access Model
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Purpose
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myRequests.map((req) => {
                    const ds = getDataset(req.datasetId);
                    const statusStyle =
                      STATUS_STYLES[req.status] || STATUS_STYLES.pending;

                    return (
                      <tr
                        key={req.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <Link
                            to={`/catalog/${req.datasetId}`}
                            className="text-sm font-medium text-teal-700 hover:text-teal-800"
                          >
                            {ds?.title ?? req.datasetId}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            {req.accessModel}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-sm text-gray-600 truncate">
                            {req.purpose}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${statusStyle}`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(req.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ── Bookmarked Datasets ─────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Bookmarked Datasets
          </h2>
          <Link
            to="/catalog"
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            Browse catalog
          </Link>
        </div>

        {bookmarkedDatasets.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-300 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
            <p className="text-gray-500 text-sm">
              No bookmarked datasets yet.
            </p>
            <Link
              to="/catalog"
              className="mt-2 inline-block text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Browse the catalog and bookmark datasets you're interested in
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {bookmarkedDatasets.map((ds) => (
              <DatasetCard key={ds.id} dataset={ds} />
            ))}
          </div>
        )}
      </section>

      {/* ── Recommended Datasets ────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Recommended Datasets
          </h2>
          <Link
            to="/catalog"
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            View all
          </Link>
        </div>

        {recommended.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No published datasets available.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {recommended.map((ds) => (
              <DatasetCard
                key={ds.id}
                dataset={ds}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
