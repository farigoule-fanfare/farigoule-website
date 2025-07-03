import React, { useEffect, useState } from "react";
import { ContentPageLayout } from "@shell";
import { axiosWrapper } from "@services/axiosUtils";

import "./ContactPage.css";

const ContactPage = () => {
  const [president, setPresident] = useState(null);
  const [formData, setFormData]   = useState({ nom: "", email: "", message: "" });
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [success, setSuccess]     = useState(null);

  
  useEffect(() => {
    const fetchPresident = async () => {
      try {
        const res = await axiosWrapper({ method: "get", url: "api/users/current-president" });
        setPresident(res.data);
      } catch (e) {
        console.error("Erreur récupération président :", e);
      }
    };
    fetchPresident();
  }, []);

  /* --- handlers --- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!president?.email) {
      setError("Adresse mail du président introuvable.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosWrapper({
        method: "post",
        url: "/api/email",
        data: { ...formData, destinataire: president.email },
      });

      // Le backend renvoie seulement { message: '...' }
      setSuccess(res.data?.message || "Message envoyé !");
      setFormData({ nom: "", email: "", message: "" });
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur lors de l’envoi du message.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* --- rendu --- */
  return (
    <ContentPageLayout title="Envoyer un message">
      <p className="pTexteContact">
        Pour nous contacter, ou envoyer une déclaration d’amour au&nbsp;
        {president ? `président(e) ${president.prenom}` : "président(e)"} de la Farigoule, vous pouvez&nbsp;:
      </p>
      <ul>
        <li> Nous écrire sur Instagram (ou Facebook) via les boutons ci-dessus</li>
        <li> Remplir le formulaire ci-dessous pour un e-mail direct</li>
        <li> Appeler ou envoyer un SMS au/à la président(e) ; son numéro est en bas de chaque page</li>
      </ul>

      <div className="contentPage-form-wrapper">
        <form className="contentPage-form" onSubmit={handleSubmit}>
          <div className="contentPage-form-group">
            <label htmlFor="nom" className="contentPage-label">Votre nom :</label>
            <input
              id="nom"
              type="text"
              name="nom"
              required
              className="contentPage-input"
              value={formData.nom}
              onChange={handleChange}
            />
          </div>

          <div className="contentPage-form-group">
            <label htmlFor="email" className="contentPage-label">Votre adresse e-mail :</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="contentPage-input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="contentPage-form-group">
            <label htmlFor="message" className="contentPage-label">Votre message :</label>
            <textarea
              id="message"
              name="message"
              required
              className="contentPage-textarea"
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <div className="contentPage-buttons" style={{ gridColumn: "1 / -1" }}>
            <button
              type="submit"
              className="contentPage-button contentPage-button--submit"
              disabled={loading || !president?.email}
            >
              {loading ? "Envoi en cours…" : "Envoyer"}
            </button>
          </div>
          {success && <p className="success-message">{success}</p>}
          {error   && <p className="error-message">{error}</p>}
        </form>

        
      </div>
    </ContentPageLayout>
  );
};

export default ContactPage;
