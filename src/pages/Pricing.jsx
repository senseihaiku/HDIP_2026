import pricingData from '../data/pricing.json';
import PricingTable from '../components/PricingTable';

export default function Pricing() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing &amp; Licensing</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          HDIP will operate on a cost-recovery licensing model — fees cover infrastructure,
          legal expertise, and FAIRification, not profit.
        </p>
      </div>

      {/* Adaptive pricing notice */}
      <div className="mb-12 rounded-xl border border-teal-200 bg-teal-50 p-6 flex items-start gap-4">
        <svg className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Pricing is still under development
          </h2>
          <p className="text-sm text-gray-600">
            We are developing an <strong>adaptive pricing model</strong>. The membership tiers,
            services, and FAIR incentives below outline how the licensing model is structured —
            exact fees are not yet set and will be published once the model is finalised.
          </p>
        </div>
      </div>

      <PricingTable
        memberships={pricingData.memberships}
        services={pricingData.services}
        discounts={pricingData.discounts}
      />

      {/* Surplus handling */}
      <div className="mt-16 bg-gray-50 border border-gray-200 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How Surplus is Handled</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Cost Coverage</h3>
            <p className="text-gray-600 text-sm">
              All revenue first covers salaries, server hosting, and licenses.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Maintenance Buffer</h3>
            <p className="text-gray-600 text-sm">
              A portion of usage fees is set aside for a maintenance fund
              to handle unforeseen technical issues.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Reinvestment</h3>
            <p className="text-gray-600 text-sm">
              Any surplus either lowers next year's membership fees or funds
              FAIRification of new high-demand datasets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
