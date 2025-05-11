import React, { useEffect, useState } from "react";
import ContentPageLayout from "../../layout/ContentPageLayout";
import { axiosWrapper } from "@api/axiosUtils";
import FanfaronDescription from "./FanfaronDescription";
import "./Portraits.css";

const Portraits = () => {
  const [fanfarons, setFanfarons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [filterInstrument, setFilterInstrument] = useState("");
  const [filterPromo, setFilterPromo] = useState("");

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

  // Apply filters
  const filtered = fanfarons.filter(f =>
    (filterInstrument ? f.instrument === filterInstrument : true) &&
    (filterPromo ? f.promo === parseInt(filterPromo) : true)
  );

  // Sort by promo descending then surname ascending
  const sorted = [...filtered].sort((a, b) => {
    if (b.promo !== a.promo) return b.promo - a.promo;
    return a.surnom.localeCompare(b.surnom, 'fr');
  });

  const selectedFanfaron = sorted.find(f => f.id === selectedId);

  return (
    <ContentPageLayout title="Portraits">
      {loading && <p>Chargement des portraits…</p>}
      {error && <p className="error">Erreur : {error}</p>}

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
        <a href="#annuaire" className="backToTop">Retour en haut</a>
      </div>

      <div className="portrait-layout">
        <div
          id="annuaire"
          className={`blocAnnuaire container ${selectedId ? "twoColumns" : ""}`}
        >
          {sorted.map(f => (
            <div
              key={f.id}
              id={f.id}
              className="blocFanfaron"
              onClick={() => setSelectedId(selectedId === f.id ? null : f.id)}
            >
              <p className="pNomFanfaron">
                <strong>{f.surnom}</strong><br />
                {f.instrument.charAt(0).toUpperCase() + f.instrument.slice(1)} ({f.promo})
              </p>
              {f.bureau && (
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
                  alt="Photo du fanfaron"
                  className="apercuFanfaron"
                />
              </p>
            </div>
          ))}
        </div>

        {/* Sticky, scrollable description panel with top close cross */}
        {selectedFanfaron && (
          <div
            style={{
              position: 'sticky',
              top: '1rem',
              alignSelf: 'flex-start',
              maxHeight: 'calc(100vh - 2rem)',
              overflowY: 'auto',
              padding: '0.5rem',
              background: 'transparent',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <button
              className="fermerDescription top"
              onClick={() => setSelectedId(null)}
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                background: 'transparent',
                border: 'none',
                color: '#000',
                fontSize: '1.25rem',
                cursor: 'pointer',
                textAlign: 'right',
                width: '100%'
              }}
            >
              ×
            </button>
            <FanfaronDescription
              fanfaron={selectedFanfaron}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>
    </ContentPageLayout>
  );
};

export default Portraits;
