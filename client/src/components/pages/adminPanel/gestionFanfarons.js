// src/pages/GestionFanfarons.jsx
import React, { useState, useEffect, useRef } from 'react';
import AdminPageLayout from '../../layout/AdminPageLayout';
import { axiosWrapper } from '@api/axiosUtils';
import './gestionFanfaron.css';

export default function GestionFanfarons() {
  const ITEMS_PER_PAGE = 10;
  const [fanfarons, setFanfarons] = useState([]);
  const [form, setForm] = useState({ surnom: '', instrument: '', promo: '', bureau: '', mail: '', tel: '', description: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const formRef = useRef(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      const res = await axiosWrapper({ method: 'get', url: 'admin/fanfarons/' });
      if (res.success) {
        const arr = Array.isArray(res.data) ? res.data : Array.isArray(res.data.data) ? res.data.data : [];
        setFanfarons(arr);
        const total = Math.ceil(arr.length / ITEMS_PER_PAGE);
        if (page > total) setPage(1);
      }
    } catch (err) {
      console.error('[FETCH ERROR]', err);
    }
  };

  const sorted = [...fanfarons].sort((a, b) => {
    const pa = Number(a.promo), pb = Number(b.promo);
    if (pb !== pa) return pb - pa;
    return a.surnom.localeCompare(b.surnom, 'fr');
  });

  const lastIndex = page * ITEMS_PER_PAGE;
  const firstIndex = lastIndex - ITEMS_PER_PAGE;
  const current = sorted.slice(firstIndex, lastIndex);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = e => setPhotoFile(e.target.files[0] || null);

  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (photoFile) fd.append('photoFanfaron', photoFile);
    const method = editingId ? 'put' : 'post';
    const url = editingId ? `admin/fanfarons/${editingId}` : 'admin/fanfarons';
    try {
      const res = await axiosWrapper({ method, url, data: fd, isMultipart: true });
      if (res.success) {
        await fetchList();
        setForm({ surnom: '', instrument: '', promo: '', bureau: '', mail: '', tel: '', description: '' });
        setPhotoFile(null);
        setEditingId(null);
      }
    } catch (err) {
      console.error('[SUBMIT ERROR]', err);
    }
  };

  const handleEditClick = f => {
    setEditingId(f.id);
    setForm({
      surnom: f.surnom,
      instrument: f.instrument,
      promo: f.promo,
      bureau: f.bureau,
      mail: f.mail,
      tel: f.tel,
      description: f.description
    });
    setPhotoFile(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async id => {
    if (!window.confirm('Supprimer ce fanfaron ?')) return;
    try {
      const res = await axiosWrapper({ method: 'delete', url: `admin/fanfarons/${id}` });
      if (res.success) fetchList();
    } catch (err) {
      console.error('[DELETE ERROR]', err);
    }
  };

  return (
    <AdminPageLayout title="Gestion des fanfarons">
      {/* Formulaire */}
      <div className="adminPanel-form-wrapper" ref={formRef}>
        <form onSubmit={handleSubmit} className="adminPanel-form">
          <h3>{editingId ? 'Éditer un fanfaron' : 'Ajouter un fanfaron'}</h3>
          {['surnom','instrument','promo','bureau','mail','tel'].map(field => (
            <div key={field} className="adminPanel-form-group">
              <label htmlFor={field} className="adminPanel-label">
                {field === 'mail' ? 'Mail :' : field.charAt(0).toUpperCase() + field.slice(1) + ' :'}
              </label>
              <input
                id={field}
                name={field}
                type={field === 'promo' ? 'number' : field === 'mail' ? 'email' : 'text'}
                value={form[field]}
                onChange={handleChange}
                required={['surnom','instrument','promo'].includes(field)}
                className="adminPanel-input"
              />
            </div>
          ))}
          <div className="adminPanel-form-group">
            <label htmlFor="description" className="adminPanel-label">Description :</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="adminPanel-textarea"
            />
          </div>
          <div className="adminPanel-form-group">
            <label htmlFor="photoFanfaron" className="adminPanel-label">Photo :</label>
            <input
              id="photoFanfaron"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="adminPanel-input"
            />
          </div>
          <div className="adminPanel-buttons">
            <button type="submit" className="adminPanel-button">
              {editingId ? 'Mettre à jour' : 'Créer'}
            </button>
            {editingId && (
              <button
                type="cancel"
                onClick={() => { setEditingId(null); setForm({ surnom: '', instrument: '', promo: '', bureau: '', mail: '', tel: '', description: '' }); setPhotoFile(null); }}
                className="adminPanel-button"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tableau inspiré de adminPanel-table */}
      <div className="adminPanel-section">
        <table className="adminPanel-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Surnom</th>
              <th>Instrument</th>
              <th>Promo</th>
              <th>Bureau</th>
              <th>Téléphone</th>
              <th>Photo</th>
              <th colSpan={2}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {current.map(f => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.surnom}</td>
                <td>{f.instrument}</td>
                <td>{f.promo}</td>
                <td>{f.bureau}</td>
                <td>{f.tel}</td>
                <td>
                  {f.photoUrl
                    ? <img src={f.photoUrl} alt={f.surnom} className="apercuDiapo" />
                    : <span className="gestionFanfarons-noPhoto">Aucune photo</span>
                  }
                </td>
                <td>
                  <button onClick={() => handleEditClick(f)} className="adminPanel-button" type="edit">✎</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(f.id)} className="adminPanel-button" type="delete">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: Math.ceil(sorted.length / ITEMS_PER_PAGE) }, (_, i) => (
            <button key={i+1} disabled={page===i+1} onClick={()=>setPage(i+1)} className="adminPanel-button">{i+1}</button>
          ))}
        </div>
      </div>
    </AdminPageLayout>
  );
}