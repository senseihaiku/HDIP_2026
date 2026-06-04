/* Shared label shown wherever a concrete figure used to appear.
   Pricing is intentionally number-free while the adaptive model is developed. */
function PricingPending() {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700">
      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
      Pricing under development
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Membership Cards                                                   */
/* ------------------------------------------------------------------ */
function MembershipCards({ memberships }) {
  if (!memberships || memberships.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Membership Tiers</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {memberships.map((tier) => (
          <div
            key={tier.tier}
            className="rounded-lg border border-gray-200 bg-white p-6 flex flex-col"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{tier.label}</h3>
            <p className="text-sm text-gray-500 mb-4 flex-1">{tier.includes}</p>
            <PricingPending />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Services Table                                                     */
/* ------------------------------------------------------------------ */
function ServicesTable({ services }) {
  if (!services || services.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Service</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Billed</th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-right">Fee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.map((svc) => (
              <tr key={svc.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 font-medium">{svc.name}</td>
                <td className="px-4 py-3 text-gray-500">{svc.unit ?? '--'}</td>
                <td className="px-4 py-3 text-right">
                  <PricingPending />
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
/*  FAIR Incentives Section                                            */
/* ------------------------------------------------------------------ */
function DiscountsSection({ discounts }) {
  if (!discounts || discounts.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">FAIR Incentives</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-2xl">
        Contributions that strengthen the ecosystem will be rewarded with reduced
        fees. The exact incentive levels are part of the adaptive model still in development.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {discounts.map((disc) => (
          <div
            key={disc.name}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-900">{disc.name}</h3>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 rounded-full px-2 py-0.5">
                Incentive available
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
export default function PricingTable({ memberships, services, discounts }) {
  return (
    <div>
      <MembershipCards memberships={memberships} />
      <ServicesTable services={services} />
      <DiscountsSection discounts={discounts} />
    </div>
  );
}
