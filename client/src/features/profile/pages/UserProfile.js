import React, { useState, useEffect } from 'react';
import { useAuth } from '@features/auth';
import { axiosWrapper } from '@services/axiosUtils';
import ContentPageLayout from '../../../components/layout/ContentPageLayout';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const { currentUser, isLoading, checkAuthStatus } = useAuth();
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  });
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const handleChangePassword = () => navigate('/change-password');

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
      await axiosWrapper({
        method: 'put',
        url: 'api/users/profile',
        data: form,
      });
      setStatus('Modifications enregistrées.');
      await checkAuthStatus();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Erreur lors de la mise à jour.';
      setStatus(msg);
      console.error('Update error:', msg);
    }
};

  return (
    <ContentPageLayout title="Mon Profil">
      <div className="adminPanel-container">
        <form onSubmit={handleSubmit} className="contentPage-form">
          <h3>Mes informations</h3>
          <div className="contentPage-form-group">
            <label htmlFor="nom" className="contentPage-label">Nom:</label>
            <input
              id="nom"
              name="nom"
              className="contentPage-input"
              value={form.nom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="contentPage-form-group">
            <label htmlFor="prenom" className="contentPage-label">Prénom:</label>
            <input
              id="prenom"
              name="prenom"
              className="contentPage-input"
              value={form.prenom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="contentPage-form-group">
            <label htmlFor="email" className="contentPage-label">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              className="contentPage-input"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="contentPage-form-group">
            <label htmlFor="telephone" className="contentPage-label">Téléphone:</label>
            <input
              id="telephone"
              name="telephone"
              className="contentPage-input"
              value={form.telephone}
              onChange={handleChange}
            />
          </div>

          <div className="contentPage-buttons">
              <button className='contentPage-button contentPage-button--submit' type="submit">Enregistrer</button>
              <button className="contentPage-button contentPage-button--update" onClick={handleChangePassword} type = "button" >Modifier mon mot de passe</button>
        </div>
        </form>
        {status && <div className="adminPanel-status">{status}</div>}
      
      </div>
      
    </ContentPageLayout>
  );
}