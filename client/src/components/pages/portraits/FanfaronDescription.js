import React from "react";
import "./FanfaronDescription.css";

export default function FanfaronDescription({ fanfaron, onClose }) {
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <section
      id="descriptionFanfaron"
      className="blocDescriptionFanfaron"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <button className="closeButton" onClick={onClose}>×</button>

      <div className="fixedContent">
        <h2 className="pSurnomFanfaron">{fanfaron.surnom}</h2>
        <p className="pDetailsFanfaron">
          {capitalize(fanfaron.instrument)} — Promo {fanfaron.promo}
        </p>
        <img
          src={fanfaron.photoUrl}
          alt={fanfaron.surnom}
          className="photoFanfaron"
        />
      </div>

      <div className="descriptionScroll">
        <p className="pDescriptionFanfaron">{fanfaron.description}</p>
      </div>
    </section>
  );
}