import { useState } from 'react';
import pricingData from '../data/pricing.json';
import PricingTable from '../components/PricingTable';

export default function Pricing() {
  const [showCommercial, setShowCommercial] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          HDIP operates on a cost-recovery basis. All fees cover infrastructure,
          legal expertise, and FAIRification — not profit.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span className={`text-sm font-medium ${!showCommercial ? 'text-teal-700' : 'text-gray-400'}`}>
          Academic / Public
        </span>
        <button
          onClick={() => setShowCommercial(!showCommercial)}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            showCommercial ? 'bg-teal-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
              showCommercial ? 'translate-x-7' : ''
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${showCommercial ? 'text-teal-700' : 'text-gray-400'}`}>
          Commercial
        </span>
      </div>

      <PricingTable
        memberships={pricingData.memberships}
        services={pricingData.services}
        discounts={pricingData.discounts}
        showCommercial={showCommercial}
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
            <h3 className="font-semibold text-gray-800 mb-2">Buffer (5%)</h3>
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
