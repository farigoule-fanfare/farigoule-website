// src/pages/GestionAccueil.jsx
import React, { useState, useEffect, useRef } from 'react';
import AdminPageLayout from '../../layout/AdminPageLayout';
import { axiosWrapper } from '@api/axiosUtils';
import './gestionAccueil.css';

export default function GestionAccueil() {
  // Diaporama state
  const [diapos, setDiapos] = useState([]);
  const [editDiapoId, setEditDiapoId] = useState(null);
  const [diapoForm, setDiapoForm] = useState({ description: '' });
  const [diapoFile, setDiapoFile] = useState(null);
  const diapoFormRef = useRef(null);

  // Dates state
  const [dates, setDates] = useState([]);
  const [editDateId, setEditDateId] = useState(null);
  const [dateForm, setDateForm] = useState({ date: '', lieu: '', description: '' });
  const dateFormRef = useRef(null);

  // Pagination state
  const ITEMS_PER_PAGE = 10;
  const [diapoPage, setDiapoPage] = useState(1);
  const [datePage, setDatePage] = useState(1);

  // Fetch data on mount
  useEffect(() => {
    fetchDiapos();
    fetchDates();
  }, []);

  // Fetch diapos using same endpoint as admin
  const fetchDiapos = async () => {
    try {
      const res = await axiosWrapper({ method: 'get', url: 'admin/diapos' });
      if (res.success && Array.isArray(res.data)) {
        setDiapos(res.data);
        if (diapoPage > Math.ceil(res.data.length / ITEMS_PER_PAGE)) {
          setDiapoPage(1);
        }
      } else {
        console.error('Erreur fetch diapos:', res.message);
      }
    } catch (error) {
      console.error('Erreur réseau fetch diapos:', error);
    }
  };

  // Fetch upcoming contracts (dates)
  const fetchDates = async () => {
    try {
      const res = await axiosWrapper({ method: 'get', url: 'admin/contrats/' });
      if (res.success && Array.isArray(res.data)) {
        setDates(res.data);
        if (datePage > Math.ceil(res.data.length / ITEMS_PER_PAGE)) {
          setDatePage(1);
        }
      } else {
        console.error('Erreur fetch dates:', res.message);
      }
    } catch (error) {
      console.error('Erreur réseau fetch dates:', error);
    }
  };

  // --- Diapo handlers ---
  const handleDiapoChange = e => setDiapoForm({ description: e.target.value });
  const handleDiapoFileChange = e => setDiapoFile(e.target.files[0] || null);

  const handleDiapoSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('description', diapoForm.description);
      if (diapoFile) formData.append('fichier', diapoFile);
      const url = editDiapoId ? `admin/diapos/${editDiapoId}` : 'admin/diapos';
      const method = editDiapoId ? 'put' : 'post';
      const res = await axiosWrapper({ method, url, data: formData, isMultipart: true });
      if (res.success) {
        setEditDiapoId(null);
        setDiapoForm({ description: '' });
        setDiapoFile(null);
        fetchDiapos();
      }
    } catch (error) {
      console.error('Erreur submit diapo:', error);
    }
  };

  const handleDiapoEdit = diapo => {
    setEditDiapoId(diapo.id);
    setDiapoForm({ description: diapo.description });
    setDiapoFile(null);
    diapoFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDiapoDelete = async id => {
    if (!window.confirm('Supprimer cette diapo ?')) return;
    try {
      const res = await axiosWrapper({ method: 'delete', url: `admin/diapos/${id}` });
      if (res.success) fetchDiapos();
    } catch (error) {
      console.error('Erreur delete diapo:', error);
    }
  };

  // --- Date handlers ---
  const handleDateChange = e => {
    const { name, value } = e.target;
    setDateForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSubmit = async e => {
    e.preventDefault();
    try {
      const payload = { date: dateForm.date, lieu: dateForm.lieu, description: dateForm.description };
      const url = editDateId ? `admin/contrats/${editDateId}` : 'admin/contrats';
      const method = editDateId ? 'put' : 'post';
      const res = await axiosWrapper({ method, url, data: payload });
      if (res.success) {
        setEditDateId(null);
        setDateForm({ date: '', lieu: '', description: '' });
        fetchDates();
      }
    } catch (error) {
      console.error('Erreur submit date:', error);
    }
  };

  const handleDateEdit = dateItem => {
    setEditDateId(dateItem.id);
    setDateForm({ date: dateItem.date, lieu: dateItem.lieu, description: dateItem.description });
    dateFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDateDelete = async id => {
    if (!window.confirm('Supprimer cette date ?')) return;
    try {
      const res = await axiosWrapper({ method: 'delete', url: `admin/contrats/${id}` });
      if (res.success) fetchDates();
    } catch (error) {
      console.error('Erreur delete date:', error);
    }
  };

  // --- Pagination calculations ---
  const totalDiapoPages = Math.ceil(diapos.length / ITEMS_PER_PAGE);
  const indexDiapoLast   = diapoPage * ITEMS_PER_PAGE;
  const indexDiapoFirst  = indexDiapoLast - ITEMS_PER_PAGE;
  const currentDiapos    = diapos.slice(indexDiapoFirst, indexDiapoLast);

  const totalDatePages  = Math.ceil(dates.length / ITEMS_PER_PAGE);
  const indexDateLast   = datePage * ITEMS_PER_PAGE;
  const indexDateFirst  = indexDateLast - ITEMS_PER_PAGE;
  const currentDates    = dates.slice(indexDateFirst, indexDateLast);

  return (
    <AdminPageLayout title="Gestion de la page d'accueil">
      {/* -- Section Diaporama -- */}
      <section className="gestionAccueil-section">
        <h2>Diaporama</h2>
        <table className="tableauDiapos">
          <thead>
            <tr>
              <th>Aperçu</th>
              <th>Texte</th>
              <th colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDiapos.map(d => (
              <tr key={d.id}>
                <td><img src={d.imageUrl} alt={d.description} className="apercuDiapo" /></td>
                <td>{d.description}</td>
                <td><button onClick={() => handleDiapoEdit(d)}>✎</button></td>
                <td><button onClick={() => handleDiapoDelete(d.id)}>🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalDiapoPages }, (_, i) => (
            <button
              key={i + 1}
              disabled={diapoPage === i + 1}
              onClick={() => setDiapoPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div ref={diapoFormRef} className="gestionAccueil-form-wrapper">
          <form onSubmit={handleDiapoSubmit} encType="multipart/form-data">
            <h3>{editDiapoId ? 'Éditer une diapo' : 'Ajouter une diapo'}</h3>
            <p><label>Image: <input type="file" accept="image/*" onChange={handleDiapoFileChange} required={!editDiapoId} /></label></p>
            <p><label>Texte: <input type="text" name="description" value={diapoForm.description} onChange={handleDiapoChange} required /></label></p>
            <p><button type="submit">{editDiapoId ? 'Mettre à jour' : 'Envoyer'}</button></p>
          </form>
        </div>
      </section>

      {/* -- Section Dates -- */}
      <section className="gestionAccueil-section">
        <h2>Les prochaines dates</h2>
        <table className="tableauDates">
          <thead>
            <tr>
              <th>Date</th>
              <th>Lieu</th>
              <th>Description</th>
              <th colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDates.map(d => (
              <tr key={d.id}>
                <td>{new Date(d.date).toLocaleDateString('fr-FR')}</td>
                <td>{d.lieu}</td>
                <td>{d.description}</td>
                <td><button onClick={() => handleDateEdit(d)}>✎</button></td>
                <td><button onClick={() => handleDateDelete(d.id)}>🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalDatePages }, (_, i) => (
            <button
              key={i + 1}
              disabled={datePage === i + 1}
              onClick={() => setDatePage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div ref={dateFormRef} className="gestionAccueil-form-wrapper">
          <form onSubmit={handleDateSubmit}>
            <h3>{editDateId ? 'Éditer une date' : 'Ajouter une date'}</h3>
            <p><label>Date: <input type="date" name="date" value={dateForm.date} onChange={handleDateChange} required /></label></p>
            <p><label>Lieu: <input type="text" name="lieu" value={dateForm.lieu} onChange={handleDateChange} maxLength="100" required /></label></p>
            <p><label>Description: <input type="text" name="description" value={dateForm.description} onChange={handleDateChange} maxLength="255" required /></label></p>
            <p><button type="submit">{editDateId ? 'Mettre à jour' : 'Envoyer'}</button></p>
          </form>
        </div>
      </section>
    </AdminPageLayout>
  );
}
