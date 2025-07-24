// src/components/User/ChangePassword.js
import React, { useState } from 'react';
import { axiosWrapper } from '@services/axiosUtils';
import { ContentPageLayout } from "@shell"

// Allowed special characters for strong passwords
const SPECIALS = '@#()_+[]{}|;:,.<>?';
const specialsEscaped = SPECIALS.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
const specialRegex = new RegExp('[' + specialsEscaped + ']');
const strongRegex = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[${specialsEscaped}]).{12,}$`);

const isStrongPassword = (pw) => strongRegex.test(pw);

const evaluatePassword = (pw) => ({
  length: pw.length >= 12,
  upper: /[A-Z]/.test(pw),
  lower: /[a-z]/.test(pw),
  digit: /\d/.test(pw),
  special: specialRegex.test(pw)
});

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checks, setChecks] = useState(evaluatePassword(''));

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'newPassword') {
      setChecks(evaluatePassword(value));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);

    if (form.newPassword !== form.confirmPassword) {
      setStatus('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    if (!isStrongPassword(form.newPassword)) {
      setStatus(`Le mot de passe doit contenir au moins 12 caracteres, des chiffres, des majuscules, des minuscules et un caractere special autorise (${SPECIALS}).`);
      return;
    }

    setLoading(true);
    try {
      await axiosWrapper({
        method: 'put',
        url: 'auth/change-password',
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
          <ul style={{textAlign:'left', listStyle:'none', padding:0, fontSize:'0.9em'}}>
            <li style={{color: checks.length ? 'green' : 'red'}}>
              {checks.length ? '✓' : '✗'} 12 caractères minimum
            </li>
            <li style={{color: checks.upper ? 'green' : 'red'}}>
              {checks.upper ? '✓' : '✗'} 1 majuscule
            </li>
            <li style={{color: checks.lower ? 'green' : 'red'}}>
              {checks.lower ? '✓' : '✗'} 1 minuscule
            </li>
            <li style={{color: checks.digit ? 'green' : 'red'}}>
              {checks.digit ? '✓' : '✗'} 1 chiffre
            </li>
            <li style={{color: checks.special ? 'green' : 'red'}}>
              {checks.special ? '✓' : '✗'} 1 caractère spécial autorisé
            </li>
          </ul>
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