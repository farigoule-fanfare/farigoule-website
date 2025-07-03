export default function CrudForm({ fields, values, onChange, onSubmit, children }) {
  const handle = e => onChange(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <form onSubmit={onSubmit} className="contentPage-form">
      {fields.map(f => (
        <div key={f.name} className="contentPage-form-group">
          <label htmlFor={f.name} className="contentPage-label">{f.label} :</label>

          {f.type === 'select' ? (
            <select id={f.name} name={f.name} value={values[f.name]} onChange={handle} required={f.required} className="contentPage-input">
              {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : f.type === 'textarea' ? (
            <textarea id={f.name} name={f.name} value={values[f.name]} onChange={handle} required={f.required} className="contentPage-textarea" />
          ) : f.type === 'file' ? (
            <input type="file" onChange={e => onChange(p => ({ ...p, [f.name]: e.target.files[0] }))}/>
          ) : (
            <input id={f.name} name={f.name} type={f.type} value={values[f.name]} onChange={handle} required={f.required} className="contentPage-input" />
          )}
        </div>
      ))}
      {children /* zone boutons custom */}
    </form>
  );
}
