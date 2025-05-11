// src/components/pages/FanfaronDescription.js
import React from "react";
import "./Portraits.css";

export default function FanfaronDescription({ fanfaron, onClose }) {
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <section
      id="descriptionFanfaron"
      className="blocDescriptionFanfaron"
      style={{ display: "block", marginLeft: "1rem", position: 'relative' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Large close button overlay */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          background: 'transparent',
          border: 'none',
          fontSize: '2rem',
          cursor: 'pointer',
          color: '#000',
          zIndex: 20
        }}
      >
        ×
      </button>

      {/* Fixed header and photo */}
      <div className="fixedContent" style={{ textAlign: 'center', padding: '0 1rem' }}>
        <h2 className="pSurnomFanfaron" style={{ margin: 0, padding: 0 }}>
          {fanfaron.surnom}
        </h2>
        <p className="pDetailsFanfaron" style={{ margin: '0.25rem 0', padding: 0 }}>
          {capitalize(fanfaron.instrument)} — Promo {fanfaron.promo}
        </p>
        <img
          src={fanfaron.photoUrl}
          alt={fanfaron.surnom}
          className="photoFanfaron"
          style={{ width: '100%', height: 'auto', borderRadius: '8px', margin: '0 auto' }}
        />
      </div>

      {/* Scrollable description only */}
      <div
        className="descriptionScroll"
        
      >
        <p className="pDescriptionFanfaron" style={{ margin: 0 }}>
          {fanfaron.description}
        </p>
      </div>
    </section>
  );
}