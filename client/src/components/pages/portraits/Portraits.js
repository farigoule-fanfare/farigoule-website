import React, { useEffect, useState } from "react";

import { axiosWrapper } from "@api/axiosUtils";

import ContentPageLayout from "../../layout/ContentPageLayout";
import FanfaronDescription from "./FanfaronDescription";

import "./Portraits.css";

const Portraits = () => {
  const [fanfarons, setFanfarons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [filterInstrument, setFilterInstrument] = useState("");
  const [filterPromo, setFilterPromo] = useState("");
  const [filterBureau, setFilterBureau] = useState("all");


  useEffect(() => {
    const fetchFanfarons = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosWrapper({ method: "get", url: "api/fanfarons" });
        if (res.success) setFanfarons(res.data);
        else throw new Error(res.message || "Erreur de chargement");
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFanfarons();
  }, []);

  // Derive unique filter options
  const instruments = Array.from(new Set(fanfarons.map(f => f.instrument))).sort();
  const promos = Array.from(new Set(fanfarons.map(f => f.promo))).sort((a,b) => a - b);
 
  const bureauMapping = {
    "":        "Blairos",       // Défaut si vide
    "president":  "Président",
    "chefmu":     "Chef Mu'",
    "trez":       "Trésorier",
    "com":        "Respo Com'",
    "biere":      "Respo Bière",
};

  // 2) Construit la liste d’options à partir de ce mapping
  const bureauOptions = [
    { value: "all", label: "Toutes" },
    ...Object.entries(bureauMapping).map(([raw, label]) => ({
      value: raw,
      label: label,
    })),
  ];


  // Apply filters
  const fanfaronsFiltered = fanfarons.filter(fanfaron => {
    const byInstrument = filterInstrument
      ? fanfaron.instrument === filterInstrument
      : true;

    const byPromo = filterPromo
      ? fanfaron.promo === Number(filterPromo)
      : true;

    // Si filterBureau vaut "all", on ne filtre pas ; 
    // sinon on compare directement, même pour "" (Blairos)
    const byBureau = filterBureau === "all"
      ? true
      : fanfaron.bureau === filterBureau;

    return byInstrument && byPromo && byBureau;
  });




  // Sort by promo descending then surname ascending
  const fanfaronsSorted = [...fanfaronsFiltered].sort((a, b) => {
    if (b.promo !== a.promo) return b.promo - a.promo;
    return a.surnom.localeCompare(b.surnom, 'fr');
  });

  const selectedFanfaron = fanfaronsSorted.find(f => f.id === selectedId);

  return (
  <ContentPageLayout title="Portraits">
    {loading && <p>Chargement des portraits…</p>}
    {error   && <p className="error">Erreur : {error}</p>}

    {/* → Nouveau grid parent */}
    <div className={`portrait-container ${selectedFanfaron ? "withDesc" : "noDesc"}`}>
      {/* 1) Header centré */}
      <div className="portrait-header">
        <h2 className="titre-annuaire">L’annuaire des fanfarons</h2>
        {fanfarons.length > 20 && (
          <p>
            <a href="#filtrerResultats" className="alertTooMany"> Hey, y’a trop de fanfarons ! </a>
          </p>
        )}
      </div>

      {/* 2) Grille 4 ou 2 colonnes */}
      <div
        id="annuaire"
        className={`blocAnnuaire container ${selectedFanfaron ? "twoColumns" : ""}`}
      >
        {fanfaronsSorted.map(f => {
          return(
            <div
            key={f.id}
            id={f.id}
            className="blocFanfaron"
              onClick={() => setSelectedId(selectedId === f.id ? null : f.id)}
            >
              <p className="pNomFanfaron">
                <strong>{f.surnom}</strong><br />
                {/* Instru (promo) */}
                {`${f.instrument.charAt(0).toUpperCase() + f.instrument.slice(1)}${f.promo ? ` (${f.promo})` :""}`}
              </p>
              {/* Ajoute l'icone "bureau" correspondant au poste si nécessaire */}
              {(f.bureau && ["president","chefmu","trez","com","biere"].includes(f.bureau)) && (
                <p className="pImageBureau">
                  <img
                    src={require(`../../../img/boutons/bouton-${f.bureau}.png`)}
                    alt="Logo bureau"
                    className="imageBureau"
                  />
                </p>
              )}
              <p className="pApercuFanfaron">
                <img
                  src={f.photoUrl}
                  alt="Fanfaron"
                  className="apercuFanfaron"
                />
              </p>
            </div>
          )}
          
          )}
        </div>

        {/* 3) Description sticky */}
      {selectedFanfaron && (
        <div className="portraitDesc">
          <FanfaronDescription
            fanfaron={selectedFanfaron}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}
    </div>

      {/* Filter controls */}
      <div id="filtrerResultats" className="filtrerResultats">
        <h3>Filtrer les résultats</h3>
        <label>
          Instrument:
          <select value={filterInstrument} onChange={e => setFilterInstrument(e.target.value)}>
            <option value="">Tous</option>
            {instruments.map(inst => (
              <option key={inst} value={inst}>{inst.charAt(0).toUpperCase() + inst.slice(1)}</option>
            ))}
          </select>
        </label>
        <label>
          Promo:
          <select value={filterPromo} onChange={e => setFilterPromo(e.target.value)}>
            <option value="">Toutes</option>
            {promos.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <label>
          Bureau :
          <select
            value={filterBureau}
            onChange={e => setFilterBureau(e.target.value)}
          >
            {bureauOptions.map(opt => (
              <option key={opt.value || "__empty"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <a href="#annuaire" className="backToTop">Retour en haut</a>
      </div>
    </ContentPageLayout>
  );
};

export default Portraits;
