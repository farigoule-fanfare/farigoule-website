// src/pages/GestionAccueil.jsx
import React, { useState, useEffect, useRef } from 'react';
import AdminPageLayout from '../../layout/AdminPageLayout';
import { axiosWrapper } from '@api/axiosUtils';
import './adminPanel.css';

export default function GestionAccueil() {
  // — diaporama —
  const [diapos, setDiapos] = useState([]);
  const [editDiapoId, setEditDiapoId] = useState(null);
  const [diapoForm, setDiapoForm] = useState({ description: '' });
  const [diapoFile, setDiapoFile] = useState(null);
  const diapoFormRef = useRef(null);

  // — dates —
  const [dates, setDates] = useState([]);
  const [editDateId, setEditDateId] = useState(null);
  const [dateForm, setDateForm] = useState({ date: '', lieu: '', description: '' });
  const dateFormRef = useRef(null);

  // Chargement initial
  useEffect(() => {
    fetchDiapos();
    fetchDates();
  }, []);

  const fetchDiapos = async () => {
    const res = await axiosWrapper({ method: 'get', url: 'accueil/diapos' });
    if (res.success) setDiapos(res.data);
  };

  const fetchDates = async () => {
    const res = await axiosWrapper({ method: 'get', url: 'accueil/contrats' });
    if (res.success) setDates(res.data);
  };

  // — Handlers diapo —
  const handleDiapoChange = e => {
    const { value } = e.target;
    setDiapoForm({ description: value });
  };
  const handleDiapoFile = e => {
    setDiapoFile(e.target.files[0] || null);
  };
  const handleDiapoEdit = d => {
    setEditDiapoId(d.id);
    setDiapoForm({ description: d.description });
    setDiapoFile(null);
    diapoFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleDiapoDelete = async id => {
    if (!window.confirm('Supprimer cette diapo ?')) return;
    const res = await axiosWrapper({ method: 'delete', url: `accueil/diapos/${id}` });
    if (res.success) fetchDiapos();
  };
  const handleDiapoSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('descriptionDiapo', diapoForm.description);
    if (diapoFile) fd.append('imageDiapo', diapoFile);

    const isEdit = Boolean(editDiapoId);
    const res = await axiosWrapper({
      method: isEdit ? 'put' : 'post',
      url: isEdit ? `accueil/diapos/${editDiapoId}` : 'accueil/diapos',
      data: fd,
      isMultipart: true
    });

    if (res.success) {
      setEditDiapoId(null);
      setDiapoForm({ description: '' });
      setDiapoFile(null);
      fetchDiapos();
    }
  };

  // — Handlers date —
  const handleDateChange = e => {
    const { name, value } = e.target;
    setDateForm(prev => ({ ...prev, [name]: value }));
  };
  const handleDateEdit = d => {
    setEditDateId(d.id);
    setDateForm({ date: d.date, lieu: d.lieu, description: d.description });
    dateFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleDateDelete = async id => {
    if (!window.confirm('Supprimer cette date ?')) return;
    const res = await axiosWrapper({ method: 'delete', url: `accueil/contrats/${id}` });
    if (res.success) fetchDates();
  };
  const handleDateSubmit = async e => {
    e.preventDefault();
    const payload = {
      dateContrat: dateForm.date,
      lieuContrat: dateForm.lieu,
      descriptionContrat: dateForm.description
    };

    const isEdit = Boolean(editDateId);
    const res = await axiosWrapper({
      method: isEdit ? 'put' : 'post',
      url: isEdit ? `accueil/contrats/${editDateId}` : 'accueil/contrats',
      data: payload
    });

    if (res.success) {
      setEditDateId(null);
      setDateForm({ date: '', lieu: '', description: '' });
      fetchDates();
    }
  };

  return (
    <AdminPageLayout title="Gestion de la page d'accueil">
      {/* ==== SECTION DIAPORAMA ==== */}
      <section className="gestionAccueil-section">
        <h2>Diaporama</h2>
        <p><strong>Attention</strong> : seules les cinq dernières diapos sont éditables/affichées</p>
        <table className="tableauDiapos">
          <thead>
            <tr>
              <th>Aperçu photo</th>
              <th>Texte de diapo</th>
              <th colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {diapos.map(d => (
              <tr key={d.id}>
                <td>
                  <img src={d.fichierUrl} alt="" className="apercuDiapo" />
                </td>
                <td>{d.description}</td>
                <td>
                  <button onClick={() => handleDiapoEdit(d)}>✎</button>
                </td>
                <td>
                  <button onClick={() => handleDiapoDelete(d.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div ref={diapoFormRef} className="gestionAccueil-form-wrapper">
          <form onSubmit={handleDiapoSubmit} encType="multipart/form-data">
            <h3>{editDiapoId ? 'Éditer une diapo' : 'Ajouter une diapo'}</h3>
            <p>
              <label>
                Image :
                <input
                  type="file"
                  accept="image/jpeg"
                  onChange={handleDiapoFile}
                  required={!editDiapoId}
                />
              </label>
              <br />Dimensions : 900×500, JPEG
            </p>
            <p>
              <label>
                Texte :
                <input
                  type="text"
                  value={diapoForm.description}
                  onChange={handleDiapoChange}
                  required
                />
              </label>
            </p>
            <p>
              <button type="submit">
                {editDiapoId ? 'Mettre à jour' : 'Envoyer'}
              </button>
            </p>
          </form>
        </div>
      </section>

      {/* ==== SECTION DATES ==== */}
      <section className="gestionAccueil-section">
        <h2>Les prochaines dates</h2>
        <p><strong>Remarque</strong> : seules les dates futures apparaissent sur le site</p>
        <p className="lienAncreFormulaireDate">
          <a href="#formulaireDate">Aller au formulaire “Ajouter une date”</a>
        </p>

        <table className="tableauDates">
          <thead>
            <tr>
              <th>Date</th><th>Lieu</th><th>Description</th><th colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dates.map(d => (
              <tr key={d.id}>
                <td>{d.date}</td>
                <td>{d.lieu}</td>
                <td>{d.description}</td>
                <td><button onClick={() => handleDateEdit(d)}>✎</button></td>
                <td><button onClick={() => handleDateDelete(d.id)}>🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div ref={dateFormRef} id="formulaireDate">
          <form onSubmit={handleDateSubmit}>
            <h3>{editDateId ? 'Éditer une date' : 'Ajouter une date'}</h3>
            <p>
              <label>
                Date :
                <input
                  type="date"
                  name="date"
                  value={dateForm.date}
                  onChange={handleDateChange}
                  required
                />
              </label>
            </p>
            <p>
              <label>
                Lieu :
                <input
                  type="text"
                  name="lieu"
                  maxLength="100"
                  value={dateForm.lieu}
                  onChange={handleDateChange}
                  required
                />
              </label>
            </p>
            <p>
              <label>
                Description :
                <input
                  type="text"
                  name="description"
                  maxLength="255"
                  value={dateForm.description}
                  onChange={handleDateChange}
                  required
                />
              </label>
            </p>
            <p>
              <button type="submit">
                {editDateId ? 'Mettre à jour' : 'Envoyer'}
              </button>
            </p>
          </form>
        </div>
      </section>
    </AdminPageLayout>
  );
}
