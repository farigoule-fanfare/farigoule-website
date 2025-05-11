// src/components/Portrait/FanfaronDescription.js
import React from 'react';
import './FanfaronDescription.css'; // tu peux réutiliser Portraits.css ou créer un fichier dédié

export default function FanfaronDescription({ fanfaron, onClose }) {
  return (
    <section id="descriptionFanfaron" className="blocDescriptionFanfaron">
      <div className="photoFanfaron">
        <img
          src={fanfaron.photoUrl}
          alt={`Portrait de ${fanfaron.surnom}`}
          className="photoFanfaron"
        />
      </div>
      <div className="texteDescriptionFanfaron">
        <h2 className="titreDescription">{fanfaron.surnom}</h2>
        <p className="pDescriptionFanfaron">{fanfaron.description}</p>
      </div>
      <button
        id="fermerDescription"
        className="fermerDescription"
        onClick={onClose}
      >
        Fermer
      </button>
    </section>
  );
}
