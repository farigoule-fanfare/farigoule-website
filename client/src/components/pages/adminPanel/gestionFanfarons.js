// src/pages/GestionFanfarons.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import AdminPageLayout from '../../layout/AdminPageLayout';
import { axiosWrapper } from '@api/axiosUtils';
import Pagination from '../../utils/Pagination';
import './gestionFanfaron.css';

export default function GestionFanfarons() {
  const ITEMS_PER_PAGE = 10;
  const [fanfarons, setFanfarons] = useState([]);
  const [form, setForm] = useState({ surnom: '', instrument: '', promo: '', bureau: '', email: '', tel: '', description: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const formRef = useRef(null);
  const [page, setPage] = useState(1);



  const fetchList = useCallback(async () => {
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
  },[page]);

    useEffect(() => {
    fetchList();
  }, [fetchList]);

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
        setForm({ surnom: '', instrument: '', promo: '', bureau: '', email: '', tel: '', description: '' });
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
      email: f.email,
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
      <div className="contentPage-form-wrapper" ref={formRef}>
        <form onSubmit={handleSubmit} className="contentPage-form">
          <h3>{editingId ? 'Éditer un fanfaron' : 'Ajouter un fanfaron'}</h3>
          {['surnom','instrument','promo','bureau','email','tel'].map(field => (
            <div key={field} className="contentPage-form-group">
              <label htmlFor={field} className="contentPage-label">
                {field === 'email' ? 'Mail :' : field.charAt(0).toUpperCase() + field.slice(1) + ' :'}
              </label>
              <input
                id={field}
                name={field}
                type={field === 'promo' ? 'number' : field === 'email' ? 'mail' : 'text'}
                value={form[field]}
                onChange={handleChange}
                required={['surnom','instrument','promo'].includes(field)}
                className="contentPage-input"
              />
            </div>
          ))}
          <div className="contentPage-form-group">
            <label htmlFor="description" className="contentPage-label">Description :</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="contentPage-textarea"
            />
          </div>
          <div className="contentPage-form-group">
            <label htmlFor="photoFanfaron" className="contentPage-label">Photo :</label>
            <input
              id="photoFanfaron"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="contentPage-input"
            />
          </div>
          <div className="adminPanel-buttons">
            <button type = {editingId ? "update" : "submit"} className="adminPanel-button">
              {editingId ? 'Mettre à jour' : 'Créer'}
            </button>
            {editingId && (
              <button
                type="cancel"
                onClick={() => { setEditingId(null); setForm({ surnom: '', instrument: '', promo: '', bureau: '', email: '', tel: '', description: '' }); setPhotoFile(null); }}
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
              <th>Email</th>
              <th>Photo</th>
              <th>Actions</th>
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
                <td>{f.email}</td>
                <td>
                  {f.photoUrl
                    ? <img src={f.photoUrl} alt={f.surnom} className="apercuDiapo" />
                    : <span className="gestionFanfarons-noPhoto">Aucune photo</span>
                  }
                </td>
                <td>
                  <div className="adminPanel-buttons">
                  <button onClick={() => handleEditClick(f)} className="adminPanel-button" type="edit">✎</button>
                  <button onClick={() => handleDelete(f.id)} className="adminPanel-button" type="delete">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={page}
          totalPages={ Math.ceil(sorted.length / ITEMS_PER_PAGE)}
          onPageChange={setPage}
        />
        </div>
    </AdminPageLayout>
  );
}