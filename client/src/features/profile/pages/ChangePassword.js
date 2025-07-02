// src/components/User/ChangePassword.js
import React, { useState } from 'react';
import { axiosWrapper } from '@services/axiosUtils';
import { ContentPageLayout } from "@shell"

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);

    if (form.newPassword !== form.confirmPassword) {
      setStatus('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await axiosWrapper({
        method: 'put',
        url: 'api/auth/change-password',
        data: {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        }
      });
      setStatus('Votre mot de passe a bien été changé.');
    } catch (err) {
      const message = err?.response?.data?.message || 'Erreur réseau ou inattendue.';
      setStatus(`Erreur : ${message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentPageLayout title="Changer de mot de passe">
      <form className="contentPage-form" onSubmit={handleSubmit}>
        <h3>Souviens-toi en</h3>
        <div className="contentPage-form-group">
          <label className='contentPage-label'>Mot de passe actuel</label>
          <input
            type="password"
            name="currentPassword"
            className="contentPage-input"
            value={form.currentPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="contentPage-form-group">
          <label className='contentPage-label'>Nouveau mot de passe</label>
          <input
            type="password"
            name="newPassword"
            className="contentPage-input"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="contentPage-form-group">
          <label className='contentPage-label'>Confirmer le mot de passe</label>
          <input
            type="password"
            name="confirmPassword"
            className="contentPage-input"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className='contentPage-buttons'>
        <button className="contentPage-button contentPage-button--submit" type="submit" disabled={loading}>
          {loading ? 'En cours…' : 'Valider'}
        </button>
        {status && <p className="status">{status}</p>}
        </div>
      </form>
    </ContentPageLayout>
  );
}