// src/pages/GestionCitations.jsx
import React, { useState, useEffect, useRef,useCallback} from 'react';
import AdminPageLayout from '../../layout/AdminPageLayout';
import { axiosWrapper } from '@api/axiosUtils';
//import './adminPanel.css';

export default function GestionCitations() {
  const ITEMS_PER_PAGE = 20;

  // Data state
  const [citations, setCitations] = useState([]);
  const [fanfarons, setFanfarons] = useState([]);

  // Form/edit state
  const [editCitationId, setEditCitationId] = useState(null);
  const [citationForm, setCitationForm] = useState({ auteur_id: '', citation: '' });
  const citationFormRef = useRef(null);

  // Pagination state
  const [citationPage, setCitationPage] = useState(1);

  

  // Load fanfarons for select options
  const fetchFanfarons = async () => {
    try {
      const res = await axiosWrapper({ method: 'get', url: 'admin/fanfarons' });
      console.log('fetchFanfarons response:', res);  // Debug raw response
      if (res.success && Array.isArray(res.data)) {
        setFanfarons(res.data);
      } else {
        console.error('Erreur fetch fanfarons:', res.message);
      }
    } catch (error) {
      console.error('Erreur réseau fetch fanfarons:', error);
    }
  };

  // Load all citations
  const fetchCitations = useCallback(async () => {
    try {
      const res = await axiosWrapper({ method: 'get', url: 'admin/citations' });
      console.log('fetchCitations response:', res);  // Debug raw response
      if (res.success && Array.isArray(res.data)) {
        setCitations(res.data);
        const totalPages = Math.ceil(res.data.length / ITEMS_PER_PAGE);
        if (citationPage > totalPages) setCitationPage(1);
      } else console.error('Erreur fetch citations:', res.message);
    } catch (error) {
      console.error('Erreur réseau fetch citations:', error);
    }
  },[citationPage]);

  // Fetch data on mount
  useEffect(() => {
    fetchFanfarons();
    fetchCitations();
  }, [fetchCitations]);

  // Handle form changes
  const handleCitationChange = e => {
    const { name, value } = e.target;
    setCitationForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit add/edit
  const handleCitationSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        auteur_id: citationForm.auteur_id,
        citation: citationForm.citation
      };
      const url = editCitationId
        ? `admin/citations/${editCitationId}`
        : 'admin/citations';
      const method = editCitationId ? 'put' : 'post';
      const res = await axiosWrapper({ method, url, data: payload });
      if (res.success) {
        setEditCitationId(null);
        setCitationForm({ auteur_id: '', citation: '' });
        fetchCitations();
      }
    } catch (error) {
      console.error('Erreur submit citation:', error);
    }
  };

  // Prepare edit (keep fanfaron selection)
  const handleCitationEdit = citation => {
    setEditCitationId(citation.id);
    setCitationForm({
      auteur_id: citation.auteur_id,
      citation: citation.citation
    });
    citationFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Delete citation
  const handleCitationDelete = async id => {
    if (!window.confirm('Supprimer cette citation ?')) return;
    try {
      const res = await axiosWrapper({ method: 'delete', url: `admin/citations/${id}` });
      if (res.success) fetchCitations();
    } catch (error) {
      console.error('Erreur delete citation:', error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(citations.length / ITEMS_PER_PAGE);
  const idxLast = citationPage * ITEMS_PER_PAGE;
  const idxFirst = idxLast - ITEMS_PER_PAGE;
  const currentCitations = citations.slice(idxFirst, idxLast);

  return (
    <AdminPageLayout title="Gestion des citations">
      <section className="gestionAccueil-section">
        <h2>Citations</h2>
        <table className="tableauCitations">
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
                  <button onClick={() => handleCitationEdit(c)}>✎</button>
                </td>
                <td>
                  <button onClick={() => handleCitationDelete(c.id)}>🗑</button>
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
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div ref={citationFormRef} className="gestionAccueil-form-wrapper">
          <form onSubmit={handleCitationSubmit}>
            <h3>{editCitationId ? 'Éditer une citation' : 'Ajouter une citation'}</h3>
            <p>
              <label htmlFor="auteur_id">Fanfaron :</label>
              <select
                name="auteur_id"
                id="auteur_id"
                value={citationForm.auteur_id}
                onChange={handleCitationChange}
                required
              >
                <option value="">Sélectionner</option>
                {fanfarons.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.surnom}
                  </option>
                ))}
              </select>
            </p>
            <p>
              <label htmlFor="citation">Citation :</label>
              <input
                type="text"
                name="citation"
                id="citation"
                maxLength={1000}
                value={citationForm.citation}
                onChange={handleCitationChange}
                required
              />
            </p>
            <p>
              <button type="submit">
                {editCitationId ? 'Mettre à jour' : 'Envoyer'}
              </button>
            </p>
          </form>
        </div>
      </section>
    </AdminPageLayout>
  );
}
