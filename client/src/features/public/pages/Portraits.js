import React, { useEffect, useState } from "react";

import { axiosWrapper } from "@services/axiosUtils";

import { ContentPageLayout } from "@shell"
import FanfaronDescription from "../components/FanfaronDescription";
import { BureauMapping } from "../components/BureauMapping"

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
        setFanfarons(res.data);
      } catch (e) {
        setError(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFanfarons();
  }, []);

  const instruments = Array.from(new Set(fanfarons.map(f => f.instrument))).sort();
  const promos = Array.from(new Set(fanfarons.map(f => f.promo))).sort((a,b) => a - b);

  const bureauOptions = [
    { value: "all", label: "Toutes" },
    ...Object.entries(BureauMapping).map(([raw, label]) => ({
      value: raw,
      label: label,
    })),
  ];

  const fanfaronsFiltered = fanfarons.filter(fanfaron => {
    const byInstrument = filterInstrument ? fanfaron.instrument === filterInstrument : true;
    const byPromo = filterPromo ? fanfaron.promo === Number(filterPromo) : true;
    const byBureau = filterBureau === "all" ? true : fanfaron.bureau === filterBureau;
    return byInstrument && byPromo && byBureau;
  });

  const fanfaronsSorted = [...fanfaronsFiltered].sort((a, b) => {
    if (b.promo !== a.promo) return b.promo - a.promo;
    return a.surnom.localeCompare(b.surnom, 'fr');
  });

  const selectedFanfaron = fanfaronsSorted.find(f => f.id === selectedId);

  return (
  <ContentPageLayout title="Portraits">
    {loading && <p>Chargement des portraits…</p>}
    {error   && <p className="error">Erreur : {error}</p>}

    <div className={`portrait-container ${selectedFanfaron ? "withDesc" : "noDesc"}`}>
      <div className="portrait-header">
        <h2 className="titre-annuaire" id="annuaire-title">L’annuaire des fanfarons</h2>
        {fanfarons.length > 20 && (
          <button
            className="contentPage-button contentPage-button--submit"
            onClick={() => {
              setSelectedId(null);
              const el = document.getElementById("filtrerResultats");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Hey, y’a trop de fanfarons !
          </button>
        )}
      </div>

      <div
        id="annuaire"
        className={`blocAnnuaire container ${selectedFanfaron ? "twoColumns" : ""}`}
      >
        {fanfaronsSorted.map(f => (
          
          <div
            key={f.id}
            id={f.id}
            className="blocFanfaron"
            onClick={() => setSelectedId(selectedId === f.id ? null : f.id)}
          >
              <p className="pInfosFanfaron">
                <strong>{f.surnom}</strong><br />
                {`${f.instrument.charAt(0).toUpperCase() + f.instrument.slice(1)}${f.promo ? ` (${f.promo})` :""}`}
              </p>

            <div className="wrapperPhoto">
              {(f.bureau && ["president","chefmu","trez","com","biere","prev"].includes(f.bureau)) && (
                <img
                  src={require(`@assets/images/icones-bureau/icon-${f.bureau}.png`)}
                  alt="Bureau"
                  className="badgeBureau"
                />
              )}
            
            <img src={f.photoUrl} alt="Fanfaron" className="apercuFanfaron"/>
            </div>
          </div>
        ))}
      </div>

      {selectedFanfaron && (
        <div className="portraitDesc">
          <FanfaronDescription
            fanfaron={selectedFanfaron}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}
    </div>

    {/* --- Filtrer les résultats --- */}
    <div id="filtrerResultats" className="contentPage-form-wrapper">
      <form
        className="contentPage-form"
        onSubmit={e => e.preventDefault()}
      >
        <h3 style={{gridColumn:'1 / -1'}}>Filtrer les résultats</h3>

        <div className="contentPage-form-group">
          <label htmlFor="instrument" className="contentPage-label">Instrument :</label>
          <select
            id="instrument"
            className="contentPage-input"
            value={filterInstrument}
            onChange={e => setFilterInstrument(e.target.value)}
          >
            <option value="">Tous</option>
            {instruments.map(inst => (
              <option key={inst} value={inst}>{inst.charAt(0).toUpperCase()+inst.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="contentPage-form-group">
          <label htmlFor="promo" className="contentPage-label">Promo :</label>
          <select
            id="promo"
            className="contentPage-input"
            value={filterPromo}
            onChange={e => setFilterPromo(e.target.value)}
          >
            <option value="">Toutes</option>
            {promos.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="contentPage-form-group">
          <label htmlFor="bureau" className="contentPage-label">Bureau :</label>
          <select
            id="bureau"
            className="contentPage-input"
            value={filterBureau}
            onChange={e => setFilterBureau(e.target.value)}
          >
            {bureauOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="contentPage-buttons" style={{gridColumn:'1 / -1'}}>
          <button
            type="button"
            className="contentPage-button contentPage-button--submit"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Retour en haut
          </button>
        </div>
      </form>
    </div>
  </ContentPageLayout>
  );
};

export default Portraits;
