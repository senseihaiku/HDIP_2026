import { useState } from 'react';

export default function FaqTab({ dataset }) {
  const [openIndex, setOpenIndex] = useState(null);
  const faq = dataset.faq || [];

  if (faq.length === 0) {
    return (
      <p className="text-gray-400 italic text-sm">
        No frequently asked questions have been added for this dataset yet.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-200">
      {faq.map((item, index) => (
        <div key={index}>
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full py-4 px-5 cursor-pointer flex justify-between items-center font-medium text-gray-900 hover:bg-gray-50 text-left"
          >
            <span>{item.question}</span>
            <svg
              className={`w-5 h-5 text-gray-400 shrink-0 ml-4 transition-transform duration-200 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {openIndex === index && (
            <div className="px-5 pb-4 text-gray-600 text-sm">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}
