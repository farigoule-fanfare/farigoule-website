import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { axiosWrapper } from '../../api/axiosUtils';
import ContentPageLayout from '../layout/ContentPageLayout';
import './UserProfile.css';

export default function UserProfile() {
  const { currentUser, isAuthenticated, isLoading, checkAuthStatus } = useAuth();
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setForm({
        nom: currentUser.nom || '',
        prenom: currentUser.prenom || '',
        email: currentUser.email || '',
        telephone: currentUser.telephone || currentUser.tel || ''
      });
    }
  }, [currentUser]);

  if (isLoading) {
    return (
      <ContentPageLayout title="Mon Profil">
        <div>Chargement...</div>
      </ContentPageLayout>
    );
  }

  const handleChange = (e) => {
  const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      console.log('Submitting user profile update:', form);
      const res = await axiosWrapper({
        method: 'put',
        url: 'users/profile',
        data: form,
      });
      if (res.success) {
        setStatus('Modifications enregistrées.');
        await checkAuthStatus();
      } else {
        setStatus('Erreur lors de la mise à jour.');
        console.error('Update error:', res.error || res.message);
      }
    } catch (err) {
      setStatus('Erreur inattendue.');
      console.error('Unexpected error:', err);
    }
  };

  return (
    <ContentPageLayout title="Mon Profil">
      <div className="userProfile-container">
        <form onSubmit={handleSubmit} className="userProfile-form">
          <div className="userProfile-form-group">
            <label htmlFor="nom" className="userProfile-label">Nom:</label>
            <input
              id="nom"
              name="nom"
              className="userProfile-input"
              value={form.nom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="userProfile-form-group">
            <label htmlFor="prenom" className="userProfile-label">Prénom:</label>
            <input
              id="prenom"
              name="prenom"
              className="userProfile-input"
              value={form.prenom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="userProfile-form-group">
            <label htmlFor="email" className="userProfile-label">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              className="userProfile-input"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="userProfile-form-group">
            <label htmlFor="telephone" className="userProfile-label">Téléphone:</label>
            <input
              id="telephone"
              name="telephone"
              className="userProfile-input"
              value={form.telephone}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="userProfile-button">Enregistrer</button>
        </form>
        {status && <div className="userProfile-status">{status}</div>}
      </div>
    </ContentPageLayout>
  );
}