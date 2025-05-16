// src/pages/GestionAccueil.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import AdminPageLayout from '../../layout/AdminPageLayout';
import { axiosWrapper } from '@api/axiosUtils';
import './gestionAccueil.css';

export default function GestionAccueil() {
  const ITEMS_PER_PAGE = 10;

  // Diaporama state
  const [diapos, setDiapos] = useState([]);
  const [editDiapoId, setEditDiapoId] = useState(null);
  const [diapoForm, setDiapoForm] = useState({ description: '', file: null });
  const diapoFormRef = useRef(null);

  // Dates state
  const [dates, setDates] = useState([]);
  const [editDateId, setEditDateId] = useState(null);
  const [dateForm, setDateForm] = useState({ date: '', lieu: '', description: '' });
  const dateFormRef = useRef(null);

  // Pagination state
  const [diapoPage, setDiapoPage] = useState(1);
  const [datePage, setDatePage] = useState(1);

  // Fetchers
  const fetchDiapos = useCallback(async () => {
    try {
      const res = await axiosWrapper({ method: 'get', url: 'admin/diapos' });
      if (res.success && Array.isArray(res.data)) {
        setDiapos(res.data);
        if (diapoPage > Math.ceil(res.data.length / ITEMS_PER_PAGE)) setDiapoPage(1);
      }
    } catch (err) { console.error('[FETCH DIAPOS ERROR]', err); }
  }, [diapoPage]);

  const fetchDates = useCallback(async () => {
    try {
      const res = await axiosWrapper({ method: 'get', url: 'admin/contrats/' });
      if (res.success && Array.isArray(res.data)) {
        setDates(res.data);
        if (datePage > Math.ceil(res.data.length / ITEMS_PER_PAGE)) setDatePage(1);
      }
    } catch (err) { console.error('[FETCH DATES ERROR]', err); }
  }, [datePage]);

  useEffect(() => { fetchDiapos(); fetchDates(); }, [fetchDiapos, fetchDates]);

  // Handlers for Diapos
  const handleDiapoChange = e => setDiapoForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleDiapoFileChange = e => setDiapoForm(prev => ({ ...prev, file: e.target.files[0] }));

  const handleDiapoSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('description', diapoForm.description);
    if (diapoForm.file) fd.append('fichier', diapoForm.file);
    const method = editDiapoId ? 'put' : 'post';
    const url = editDiapoId ? `admin/diapos/${editDiapoId}` : 'admin/diapos';
    try {
      const res = await axiosWrapper({ method, url, data: fd, isMultipart: true });
      if (res.success) {
        setEditDiapoId(null);
        setDiapoForm({ description: '', file: null });
        fetchDiapos();
      }
    } catch (err) { console.error('[SUBMIT DIAPO ERROR]', err); }
  };

  const handleDiapoEdit = d => {
    setEditDiapoId(d.id);
    setDiapoForm({ description: d.description, file: null });
    diapoFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDiapoCancel = () => {
    setEditDiapoId(null);
    setDiapoForm({ description: '', file: null });
  };

  const handleDiapoDelete = async id => {
    if (!window.confirm('Supprimer cette diapo ?')) return;
    try {
      const res = await axiosWrapper({ method: 'delete', url: `admin/diapos/${id}` });
      if (res.success) fetchDiapos();
    } catch (err) { console.error('[DELETE DIAPO ERROR]', err); }
  };

  // Handlers for Dates
  const handleDateChange = e => setDateForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleDateSubmit = async e => {
    e.preventDefault();
    const payload = { date: dateForm.date, lieu: dateForm.lieu, description: dateForm.description };
    const method = editDateId ? 'put' : 'post';
    const url = editDateId ? `admin/contrats/${editDateId}` : 'admin/contrats';
    try {
      const res = await axiosWrapper({ method, url, data: payload });
      if (res.success) {
        setEditDateId(null);
        setDateForm({ date: '', lieu: '', description: '' });
        fetchDates();
      }
    } catch (err) { console.error('[SUBMIT DATE ERROR]', err); }
  };

  const handleDateEdit = d => {
    setEditDateId(d.id);
    setDateForm({ date: d.date, lieu: d.lieu, description: d.description });
    dateFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDateCancel = () => {
    setEditDateId(null);
    setDateForm({ date: '', lieu: '', description: '' });
  };

  const handleDateDelete = async id => {
    if (!window.confirm('Supprimer cette date ?')) return;
    try {
      const res = await axiosWrapper({ method: 'delete', url: `admin/contrats/${id}` });
      if (res.success) fetchDates();
    } catch (err) { console.error('[DELETE DATE ERROR]', err); }
  };

  // Pagination
  const totalDiapoPages = Math.ceil(diapos.length / ITEMS_PER_PAGE);
  const diapoLast = diapoPage * ITEMS_PER_PAGE;
  const diapoFirst = diapoLast - ITEMS_PER_PAGE;
  const currentDiapos = diapos.slice(diapoFirst, diapoLast);

  const totalDatePages = Math.ceil(dates.length / ITEMS_PER_PAGE);
  const dateLast = datePage * ITEMS_PER_PAGE;
  const dateFirst = dateLast - ITEMS_PER_PAGE;
  const currentDates = dates.slice(dateFirst, dateLast);

  return (
    <AdminPageLayout title="Gestion de la page d'accueil">
      {/* Diaporama Section */}
      <section className="adminPanel-section">
        <h2>Diaporama</h2>
        <table className="adminPanel-table">
          <thead>
            <tr><th>Aperçu</th><th>Texte</th><th colSpan="2">Actions</th></tr>
          </thead>
          <tbody>
            {currentDiapos.map(d => (
              <tr key={d.id}>
                <td><img src={d.imageUrl} alt={d.description} className="apercuDiapo" /></td>
                <td>{d.description}</td>
                <td><button onClick={() => handleDiapoEdit(d)} className="adminPanel-button" type="edit">✎</button></td>
                <td><button onClick={() => handleDiapoDelete(d.id)} className="adminPanel-button" type="delete">🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalDiapoPages }, (_, i) => (
            <button key={i+1} disabled={diapoPage===i+1} onClick={()=>setDiapoPage(i+1)} className="adminPanel-button">{i+1}</button>
          ))}
        </div>

        {/* Diapo Form */}
        <div className="contentPage-form-wrapper" ref={diapoFormRef}>
          <form onSubmit={handleDiapoSubmit} encType="multipart/form-data" className="contentPage-form">
            <h3>{editDiapoId ? 'Éditer une diapo' : 'Ajouter une diapo'}</h3>
            <div className="contentPage-form-group">
              <label htmlFor="file" className="contentPage-label">Image :</label>
              <input id="file" name="file" type="file" accept="image/*" onChange={handleDiapoFileChange} required={!editDiapoId} className="contentPage-input" />
            </div>
            <div className="contentPage-form-group">
              <label htmlFor="description" className="contentPage-label">Texte :</label>
              <input id="description" name="description" type="text" value={diapoForm.description} onChange={handleDiapoChange} required className="contentPage-input" />
            </div>
            <div className="adminPanel-buttons">
              <button type={editDiapoId ? "update" : "submit"} className="adminPanel-button">{editDiapoId ? 'Mettre à jour' : 'Envoyer'}</button>
              {editDiapoId && <button type="cancel" onClick={handleDiapoCancel} className="adminPanel-button">Annuler</button>}
            </div>
          </form>
        </div>
      </section>

      {/* Dates Section */}
      <section className="adminPanel-section">
        <h2>Les prochaines dates</h2>
        <table className="adminPanel-table">
          <thead>
            <tr><th>Date</th><th>Lieu</th><th>Description</th><th colSpan="2">Actions</th></tr>
          </thead>
          <tbody>
            {currentDates.map(d => (
              <tr key={d.id}>
                <td>{new Date(d.date).toLocaleDateString('fr-FR')}</td>
                <td>{d.lieu}</td>
                <td>{d.description}</td>
                <td><button onClick={()=>handleDateEdit(d)} className="adminPanel-button" type="edit">✎</button></td>
                <td><button onClick={()=>handleDateDelete(d.id)} className="adminPanel-button" type="delete">🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalDatePages }, (_, i) => (
            <button key={i+1} disabled={datePage===i+1} onClick={()=>setDatePage(i+1)} className="adminPanel-button">{i+1}</button>
          ))}
        </div>

        {/* Dates Form */}
        <div className="contentPage-form-wrapper" ref={dateFormRef}>
          <form onSubmit={handleDateSubmit} className="contentPage-form">
            <h3>{editDateId ? 'Éditer une date' : 'Ajouter une date'}</h3>
            <div className="contentPage-form-group">
              <label htmlFor="date" className="contentPage-label">Date :</label>
              <input id="date" name="date" type="date" value={dateForm.date} onChange={handleDateChange} required className="contentPage-input" />
            </div>
            <div className="contentPage-form-group">
              <label htmlFor="lieu" className="contentPage-label">Lieu :</label>
              <input id="lieu" name="lieu" type="text" value={dateForm.lieu} onChange={handleDateChange} required className="contentPage-input" />
            </div>
            <div className="contentPage-form-group">
              <label htmlFor="descriptionDate" className="contentPage-label">Description :</label>
              <input id="descriptionDate" name="description" type="text" value={dateForm.description} onChange={handleDateChange} required className="contentPage-input" />
            </div>
            <div className="adminPanel-buttons">
              <button type={editDateId ? "update" : "submit"} className="adminPanel-button">{editDateId ? 'Mettre à jour' : 'Envoyer'}</button>
              {editDateId && <button type="cancel" onClick={handleDateCancel} className="adminPanel-button">Annuler</button>}
            </div>
          </form>
        </div>
      </section>
    </AdminPageLayout>
  );
}
