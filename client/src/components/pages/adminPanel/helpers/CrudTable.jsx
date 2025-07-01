export default function CrudTable({ rows, cols, rowActions }) {
  return (
    <table className="adminPanel-table">
      <thead>
        <tr>
          {cols.map((c) => (
            <th key={c.key}>{c.header}</th>
          ))}
          {rowActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            {cols.map((c) => (
              <td key={c.key}>{c.render ? c.render(r[c.key], r) : r[c.key]}</td>
            ))}
            {rowActions && (
              <td>
                <div className="adminPanel-buttons">
                  {rowActions(r).map((a, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={a.disabled}
                      onClick={a.onClick}
                      className={`adminPanel-button ${a.className || ''}`.trim()}
                    >
                      {a.icon} {a.label}
                    </button>
                  ))}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
