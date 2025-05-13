import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { axiosWrapper } from '../../api/axiosUtils';

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

  if (isLoading) return <div>Chargement...</div>;
  if (!isAuthenticated) return <div>Vous devez être connecté pour accéder à cette page.</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      // Log the form submission
      console.log('Submitting user profile update:', form);
      const res = await axiosWrapper({
        method: 'put',
        url: 'users/profile',
        data: form
      });
      if (res.success) {
        setStatus('Modifications enregistrées.');
        await checkAuthStatus(); // Refresh user info
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
    <div style={{ padding: '2rem' }}>
      <h2>Mon Profil</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom:</label>
          <input name="nom" value={form.nom} onChange={handleChange} required />
        </div>
        <div>
          <label>Prénom:</label>
          <input name="prenom" value={form.prenom} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Téléphone:</label>
          <input name="telephone" value={form.telephone} onChange={handleChange} />
        </div>
        <button type="submit">Enregistrer</button>
      </form>
      {status && <div style={{ marginTop: '1rem' }}>{status}</div>}
    </div>
  );
} 