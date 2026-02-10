import { useState } from 'react';

function formatSEK(amount) {
  if (amount == null) return '--';
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ------------------------------------------------------------------ */
/*  Membership Cards                                                   */
/* ------------------------------------------------------------------ */
function MembershipCards({ memberships }) {
  if (!memberships || memberships.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Memberships</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {memberships.map((tier) => {
          const highlighted = tier.highlighted ?? false;
          return (
            <div
              key={tier.id ?? tier.name}
              className={`rounded-lg border p-6 flex flex-col ${
                highlighted
                  ? 'border-teal-400 bg-white shadow-md ring-1 ring-teal-400'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {highlighted && (
                <span className="self-start inline-block mb-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                  Recommended
                </span>
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{tier.name}</h3>
              <p className="text-sm text-gray-500 mb-4 flex-1">{tier.description}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {formatSEK(tier.annualFee)}
                <span className="text-sm font-normal text-gray-500">/year</span>
              </p>
              {tier.features && (
                <ul className="mt-4 space-y-2">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 mt-0.5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Services Table                                                     */
/* ------------------------------------------------------------------ */
function ServicesTable({ services, showCommercial }) {
  if (!services || services.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Service</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Unit</th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-right">Academic</th>
              {showCommercial && (
                <th className="px-4 py-3 font-semibold text-gray-700 text-right">Commercial</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.map((svc) => (
              <tr key={svc.id ?? svc.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 font-medium">{svc.name}</td>
                <td className="px-4 py-3 text-gray-500">{svc.unit ?? '--'}</td>
                <td className="px-4 py-3 text-gray-900 text-right font-medium">
                  {formatSEK(svc.academicPrice)}
                </td>
                {showCommercial && (
                  <td className="px-4 py-3 text-gray-900 text-right font-medium">
                    {formatSEK(svc.commercialPrice)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Discounts Section                                                  */
/* ------------------------------------------------------------------ */
function DiscountsSection({ discounts }) {
  if (!discounts || discounts.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Discounts</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {discounts.map((disc) => (
          <div
            key={disc.id ?? disc.name}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-900">{disc.name}</h3>
              <span className="text-sm font-bold text-teal-700">
                {disc.percentage != null ? `${disc.percentage}%` : disc.amount ? formatSEK(disc.amount) : '--'}
              </span>
            </div>
            {disc.description && (
              <p className="text-xs text-gray-500">{disc.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main PricingTable Component                                        */
/* ------------------------------------------------------------------ */
export default function PricingTable({
  memberships,
  services,
  discounts,
  showCommercial: showCommercialProp,
}) {
  const [showCommercial, setShowCommercial] = useState(showCommercialProp ?? false);

  return (
    <div>
      {/* Academic / Commercial toggle */}
      {services && services.some((s) => s.commercialPrice != null) && (
        <div className="flex items-center justify-end mb-6">
          <span className={`text-sm mr-3 ${!showCommercial ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
            Academic
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={showCommercial}
            onClick={() => setShowCommercial(!showCommercial)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
              showCommercial ? 'bg-teal-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                showCommercial ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ml-3 ${showCommercial ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
            Commercial
          </span>
        </div>
      )}

      <MembershipCards memberships={memberships} />
      <ServicesTable services={services} showCommercial={showCommercial} />
      <DiscountsSection discounts={discounts} />
    </div>
  );
}
