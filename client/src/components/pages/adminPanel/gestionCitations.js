// src/pages/GestionCitations.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import AdminPageLayout from '../../layout/AdminPageLayout';
import { axiosWrapper } from '@api/axiosUtils';
//import './gestionCitations.css';

export default function GestionCitations() {
  const ITEMS_PER_PAGE = 10;

  // Data state
  const [citations, setCitations] = useState([]);
  const [fanfarons, setFanfarons] = useState([]);

  // Form/edit state
  const [editCitationId, setEditCitationId] = useState(null);
  const [citationForm, setCitationForm] = useState({ auteur_id: '', citation: '' });
  const citationFormRef = useRef(null);

  // Pagination state
  const [citationPage, setCitationPage] = useState(1);

  // Fetch fans and citations
  const fetchFanfarons = useCallback(async () => {
    try {
      const res = await axiosWrapper({ method: 'get', url: 'admin/fanfarons' });
      if (res.success && Array.isArray(res.data)) setFanfarons(res.data);
    } catch (err) {
      console.error('[FETCH FANFARONS ERROR]', err);
    }
  }, []);

  const fetchCitations = useCallback(async () => {
    try {
      const res = await axiosWrapper({ method: 'get', url: 'admin/citations' });
      if (res.success && Array.isArray(res.data)) {
        setCitations(res.data);
        const total = Math.ceil(res.data.length / ITEMS_PER_PAGE);
        if (citationPage > total) setCitationPage(1);
      }
    } catch (err) {
      console.error('[FETCH CITATIONS ERROR]', err);
    }
  }, [citationPage]);

  useEffect(() => {
    fetchFanfarons();
    fetchCitations();
  }, [fetchFanfarons, fetchCitations]);

  // Handlers
  const handleCitationChange = e => {
    const { name, value } = e.target;
    setCitationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCitationSubmit = async e => {
    e.preventDefault();
    try {
      const payload = { auteur_id: citationForm.auteur_id, citation: citationForm.citation };
      const method = editCitationId ? 'put' : 'post';
      const url = editCitationId ? `admin/citations/${editCitationId}` : 'admin/citations';
      const res = await axiosWrapper({ method, url, data: payload });
      if (res.success) {
        setEditCitationId(null);
        setCitationForm({ auteur_id: '', citation: '' });
        fetchCitations();
      }
    } catch (err) {
      console.error('[SUBMIT CITATION ERROR]', err);
    }
  };

  const handleCitationEdit = c => {
    setEditCitationId(c.id);
    setCitationForm({ auteur_id: String(c.auteur_id), citation: c.citation });
    citationFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCitationCancel = () => {
    setEditCitationId(null);
    setCitationForm({ auteur_id: '', citation: '' });
  };

  const handleCitationDelete = async id => {
    if (!window.confirm('Supprimer cette citation ?')) return;
    try {
      const res = await axiosWrapper({ method: 'delete', url: `admin/citations/${id}` });
      if (res.success) fetchCitations();
    } catch (err) {
      console.error('[DELETE CITATION ERROR]', err);
    }
  };

  // Pagination
  const totalPages = Math.ceil(citations.length / ITEMS_PER_PAGE);
  const lastIndex = citationPage * ITEMS_PER_PAGE;
  const firstIndex = lastIndex - ITEMS_PER_PAGE;
  const currentCitations = citations.slice(firstIndex, lastIndex);

  return (
    <AdminPageLayout title="Gestion des citations">
      <section className="adminPanel-section">
        <h2>Citations</h2>
        <table className="adminPanel-table">
          <thead>
            <tr>
              <th>Fanfaron</th>
              <th>Citation</th>
              <th colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCitations.map(c => (
              <tr key={c.id}>
                <td>{c.auteurCitation}</td>
                <td>{c.citation}</td>
                <td>
                  <button
                    type='edit'
                    onClick={() => handleCitationEdit(c)}
                    className="adminPanel-button"
                  >✎</button>
                </td>
                <td>
                  <button
                    type='delete'
                    onClick={() => handleCitationDelete(c.id)}
                    className="adminPanel-button"
                  >🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              disabled={citationPage === i + 1}
              onClick={() => setCitationPage(i + 1)}
              className="adminPanel-button"
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="contentPage-form-wrapper" ref={citationFormRef}>
          <form onSubmit={handleCitationSubmit} className="contentPage-form">
            <h3>{editCitationId ? 'Éditer une citation' : 'Ajouter une citation'}</h3>
            <div className="contentPage-form-group">
              <label htmlFor="auteur_id" className="contentPage-label">Fanfaron :</label>
              <select
                id="auteur_id"
                name="auteur_id"
                value={citationForm.auteur_id}
                onChange={handleCitationChange}
                required
                className="contentPage-input"
              >
                <option value="">Sélectionner</option>
                {fanfarons.map(f => (
                  <option key={f.id} value={String(f.id)}>{f.surnom}</option>
                ))}
              </select>
            </div>
            <div className="contentPage-form-group">
              <label htmlFor="citation" className="contentPage-label">Citation :</label>
              <input
                id="citation"
                name="citation"
                type="text"
                value={citationForm.citation}
                onChange={handleCitationChange}
                required
                className="contentPage-input"
              />
            </div>
            <div className="adminPanel-buttons">
              <button
                type="submit"
                className="adminPanel-button"
              >
                {editCitationId ? 'Mettre à jour' : 'Envoyer'}
              </button>
              {editCitationId && (
                <button
                  type="cancel"
                  onClick={handleCitationCancel}
                  className="adminPanel-button"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </AdminPageLayout>
  );
}
