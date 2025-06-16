import React, { useEffect, useState } from 'react';
import ContentPageLayout from '../layout/ContentPageLayout';
import { axiosWrapper } from '@api/axiosUtils';
import './ContactPage.css';

const ContactPage = () => {
  const [presidentInfo, setPresidentInfo] = useState(null);
  const [formData, setFormData] = useState({ nom: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  // Récupération du président
  useEffect(() => {
    const fetchPresident = async () => {
      try {
        const res = await axiosWrapper({ url: 'users/current-president', method: 'get' });
        if (res.data) {
          setPresidentInfo(res.data);
        }
      } catch (err) {
        console.error("Erreur récupération président :", err);
      }
    };
    fetchPresident();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!presidentInfo?.email) {
      setStatus({ loading: false, success: null, error: "Adresse mail du président introuvable." });
      return;
    }

    setStatus({ loading: true, success: null, error: null });
    try {
      const res = await axiosWrapper({
        url: 'mail/contact',
        method: 'post',
        data: {
          ...formData,
          destinataire: presidentInfo.email
        }
      });

      if (res?.success !== false) {
        setStatus({ loading: false, success: "Message envoyé avec succès !", error: null });
        setFormData({ nom: '', email: '', message: '' });
      } else {
        throw new Error(res?.message || "Erreur inconnue");
      }
    } catch (err) {
      setStatus({ loading: false, success: null, error: "Erreur lors de l'envoi du message." });
      console.error(err);
    }
  };

  return (
    <ContentPageLayout title="Envoyer un message">
      <div className="container-contact-page">
        <p className="pTexteContact">
          Vous pouvez écrire un petit mot au président de la Farigoule en remplissant ce formulaire. Sinon, vous pouvez nous écrire sur Instagram ou Facebook via les liens à droite !
        </p>

        <form onSubmit={handleSubmit} className="contact-form">
          <label>
            Votre nom :
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
          </label>

          <label>
            Votre adresse e-mail :
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>

          <label>
            Votre message :
            <textarea name="message" value={formData.message} onChange={handleChange} required />
          </label>

          <button type="submit" disabled={status.loading || !presidentInfo?.email}>
            {status.loading ? 'Envoi en cours…' : 'Envoyer'}
          </button>
        </form>

        {status.success && <p className="success-message">{status.success}</p>}
        {status.error && <p className="error-message">{status.error}</p>}
      </div>
    </ContentPageLayout>
  );
};

export default ContactPage;
