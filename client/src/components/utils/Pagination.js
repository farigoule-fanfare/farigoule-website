import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageRange = () => {
    const range = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  };

  const pages = getPageRange();

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>«</button>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>‹</button>

      {!pages.includes(1) && (
        <>
          <button onClick={() => onPageChange(1)}>1</button>
          {pages[0] > 2 && <span>…</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          disabled={p === currentPage}
          className={p === currentPage ? 'active' : ''}
        >
          {p}
        </button>
      ))}

      {!pages.includes(totalPages) && (
        <>
          {pages.at(-1) < totalPages - 1 && <span>…</span>}
          <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
      <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>»</button>
    </div>
  );
}
