const FAIR_LABELS = ['F', 'A', 'I', 'R'];
const FAIR_KEYS = ['findable', 'accessible', 'interoperable', 'reusable'];
const MAX_PER_DIMENSION = 5;
const MAX_TOTAL = 20;

function getScoreColor(total) {
  if (total >= 16) return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', bar: 'bg-emerald-500' };
  if (total >= 12) return { bg: 'bg-teal-200', text: 'text-teal-800', border: 'border-teal-400', bar: 'bg-teal-500' };
  if (total >= 8)  return { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300', bar: 'bg-teal-400' };
  return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', bar: 'bg-red-500' };
}

const DIMENSION_COLORS = ['bg-teal-500', 'bg-teal-400', 'bg-teal-600', 'bg-teal-800'];

export default function FairBadge({ score, detailed = false }) {
  if (!score) return null;

  const total = score.total ?? 0;
  const colors = getScoreColor(total);

  if (!detailed) {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}
        title={`FAIR Score: ${total}/${MAX_TOTAL}`}
      >
        FAIR {total}/{MAX_TOTAL}
      </span>
    );
  }

  return (
    <div className={`rounded-lg border p-3 ${colors.border} ${colors.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-semibold ${colors.text}`}>FAIR Score</span>
        <span className={`text-sm font-bold ${colors.text}`}>{total}/{MAX_TOTAL}</span>
      </div>
      <div className="space-y-1.5">
        {FAIR_KEYS.map((key, i) => {
          const value = score[key] ?? 0;
          const pct = (value / MAX_PER_DIMENSION) * 100;
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600 w-3 text-center">
                {FAIR_LABELS[i]}
              </span>
              <div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${DIMENSION_COLORS[i]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-6 text-right">
                {value}/{MAX_PER_DIMENSION}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
