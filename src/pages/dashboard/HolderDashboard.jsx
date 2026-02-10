import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import FairBadge from '../../components/FairBadge';

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  denied: 'bg-red-50 text-red-700 border-red-200',
};

function truncate(text, max = 80) {
  if (!text || text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '...';
}

function formatDate(dateStr) {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('en-SE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function HolderDashboard() {
  const { currentUser } = useAuth();
  const { datasets, accessRequests, updateRequestStatus } = useData();

  // Datasets belonging to the current holder's organization
  const myDatasets = useMemo(
    () =>
      datasets.filter(
        (ds) =>
          ds.holder?.name === currentUser?.organization ||
          ds.holder?.id === currentUser?.id
      ),
    [datasets, currentUser]
  );

  // Dataset IDs owned by this holder
  const myDatasetIds = useMemo(
    () => new Set(myDatasets.map((ds) => ds.id)),
    [myDatasets]
  );

  // Access requests targeting the holder's datasets
  const incomingRequests = useMemo(
    () => accessRequests.filter((req) => myDatasetIds.has(req.datasetId)),
    [accessRequests, myDatasetIds]
  );

  // Resolve dataset title by id
  const datasetTitle = (id) => {
    const ds = datasets.find((d) => d.id === id);
    return ds?.title ?? id;
  };

  // Resolve requester info from the users list via useAuth
  const { users } = useAuth();
  const requesterInfo = (id) => {
    const user = users.find((u) => u.id === id);
    return user
      ? { name: user.name, org: user.organization }
      : { name: id, org: '--' };
  };

  const handleStatusChange = (requestId, newStatus) => {
    updateRequestStatus(requestId, newStatus);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Datasets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage datasets for {currentUser?.organization}
          </p>
        </div>
        <Link
          to="/dashboard/holder/new"
          className="inline-flex items-center justify-center rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Register New Dataset
        </Link>
      </div>

      {/* ── Datasets table ─────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-10">
        {myDatasets.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 text-sm">
              You have not registered any datasets yet.
            </p>
            <Link
              to="/dashboard/holder/new"
              className="mt-3 inline-block text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Register your first dataset
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    FAIR Score
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Records
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myDatasets.map((ds) => (
                  <tr key={ds.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        to={`/catalog/${ds.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-teal-700"
                      >
                        {ds.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${
                          ds.status === 'published'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        {ds.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <FairBadge score={ds.fairScore} />
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700 tabular-nums">
                      {ds.recordCount?.toLocaleString() ?? '--'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(ds.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Access Requests ─────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Access Requests
        </h2>

        {incomingRequests.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-12 text-center">
            <p className="text-gray-500 text-sm">
              No access requests for your datasets yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {incomingRequests.map((req) => {
              const requester = requesterInfo(req.requesterId);
              const statusStyle =
                STATUS_STYLES[req.status] || STATUS_STYLES.pending;

              return (
                <div
                  key={req.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm p-5"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left: request details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {requester.name}
                        </span>
                        <span className="text-xs text-gray-400">|</span>
                        <span className="text-xs text-gray-500">
                          {requester.org}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">Dataset:</span>{' '}
                        {datasetTitle(req.datasetId)}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        <span className="font-medium text-gray-600">
                          Purpose:
                        </span>{' '}
                        {truncate(req.purpose, 120)}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          {req.accessModel}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${statusStyle}`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>

                    {/* Right: action buttons for pending requests */}
                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() =>
                            handleStatusChange(req.id, 'approved')
                          }
                          className="inline-flex items-center rounded-md bg-green-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(req.id, 'denied')}
                          className="inline-flex items-center rounded-md bg-white border border-red-300 px-3.5 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Deny
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
