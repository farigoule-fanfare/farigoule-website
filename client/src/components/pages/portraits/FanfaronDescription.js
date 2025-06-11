import React from "react";
import { BureauMapping } from "./BureauMapping"
import "./FanfaronDescription.css";


export default function FanfaronDescription({ fanfaron, onClose }) {
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

 // Libellé final : on regarde dans le mapping ; sinon on capitalise
  const bureauLabel =
    BureauMapping[fanfaron.bureau ?? ""]               // trouvé ?
      || (fanfaron.bureau                              // sinon, valeur brute ?
            ? capitalize(fanfaron.bureau)
            : "Blairo");                               // sinon blairo par défaut

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
          {`${capitalize(fanfaron.instrument)}${fanfaron.promo ? ` — Promo ${fanfaron.promo}` : ""}`}
        </p>
        <p className="pDetailsFanfaron"> {bureauLabel}
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