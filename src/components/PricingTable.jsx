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
        {memberships.map((tier) => (
          <div
            key={tier.tier}
            className="rounded-lg border border-gray-200 bg-white p-6 flex flex-col"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{tier.label}</h3>
            <p className="text-sm text-gray-500 mb-4 flex-1">{tier.includes}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {formatSEK(tier.price)}
              <span className="text-sm font-normal text-gray-500">/year</span>
            </p>
          </div>
        ))}
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
              <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                {showCommercial ? 'Commercial' : 'Academic / Public'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.map((svc) => (
              <tr key={svc.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 font-medium">{svc.name}</td>
                <td className="px-4 py-3 text-gray-500">{svc.unit ?? '--'}</td>
                <td className="px-4 py-3 text-gray-900 text-right font-medium">
                  {formatSEK(showCommercial ? svc.priceCommercial : svc.priceAcademic)}
                </td>
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">FAIR Discounts</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {discounts.map((disc) => (
          <div
            key={disc.name}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-900">{disc.name}</h3>
              <span className="text-sm font-bold text-teal-700">
                -{disc.percentage}%
              </span>
            </div>
            <p className="text-xs text-gray-500">{disc.condition}</p>
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
  showCommercial,
}) {
  return (
    <div>
      <MembershipCards memberships={memberships} />
      <ServicesTable services={services} showCommercial={showCommercial} />
      <DiscountsSection discounts={discounts} />
    </div>
  );
}
