export default function PublicationsTab({ dataset }) {
  const publications = dataset.publications || [];

  if (publications.length === 0) {
    return (
      <p className="text-gray-400 italic text-sm">
        No publications have been linked to this dataset yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {publications.map((pub, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
        >
          {pub.url ? (
            <a
              href={pub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-700 font-semibold leading-snug"
            >
              {pub.title}
            </a>
          ) : (
            <h4 className="font-semibold text-gray-900 leading-snug">{pub.title}</h4>
          )}

          {pub.authors && (
            <p className="text-sm text-gray-600 mt-1">{pub.authors}</p>
          )}

          {(pub.journal || pub.year) && (
            <p className="text-sm text-gray-500 italic mt-1">
              {pub.journal}
              {pub.journal && pub.year ? ', ' : ''}
              {pub.year}
            </p>
          )}

          {pub.doi && (
            <a
              href={`https://doi.org/${pub.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-700 text-xs mt-2 inline-block"
            >
              DOI: {pub.doi}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
