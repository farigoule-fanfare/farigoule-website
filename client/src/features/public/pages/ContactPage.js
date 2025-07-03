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
      <p className="pTexteContact">
        Pour nous contacter, ou envoyer une déclaration d'amour au (à la) présidente(e) la Farigoule, vous pouvez:
      </p><br />
      <ul>
        <li>- Nous écrire sur les réseaux sociaux (Instagram, de préférence, ou Facebook), en utilisant les boutons ci-dessus</li>
        <li>- Remplir le formulaire ci-dessous avec votre mail pour qu'on puisse vous répondre</li>
        <li>- Contacter le (la) président(e) par téléphone ou SMS, son téléphone est affiché en bas de chaque page du site</li>
      </ul>
      
      <div className="contentPage-form-wrapper">
        <form onSubmit={handleSubmit} className="contentPage-form">
          <div className="contentPage-form-group">
            <label className="contentPage-label">Votre nom :</label>
            <input type="text" className="contentPage-input" name="nom" value={formData.nom} onChange={handleChange} required />
          </div>

          <div className="contentPage-form-group">
            <label className="contentPage-label">Votre adresse e-mail :</label>
            <input type="email" className="contentPage-input" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="contentPage-form-group">
          <label className="contentPage-label">Votre message :</label>
          <textarea name="message" className="contentPage-textarea" value={formData.message} onChange={handleChange} required />
          </div>

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
