import React, { useEffect, useState } from "react";
import ContentPageLayout from "../../layout/ContentPageLayout";
import { axiosWrapper } from "@api/axiosUtils";
import "./Portraits.css";

const Portraits = () => {
  const [fanfarons, setFanfarons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchFanfarons = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosWrapper({
          method: "get",
          url: "api/fanfarons"
        });
        if (res.success) {
          setFanfarons(res.data);
        } else {
          throw new Error(res.message || "Erreur de chargement");
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFanfarons();
  }, []);

  return (
    <ContentPageLayout title="Portraits">
      {loading && <p>Chargement des portraits…</p>}
      {error && <p className="error">Erreur : {error}</p>}

      <div id="annuaire" className="blocAnnuaire container">
        {[...fanfarons].reverse().map((f) => (
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

            {selectedId === f.id && (
              <div className="blocDescriptionFanfaron">
                <p className="photoFanfaron">
                  <img
                    src={f.photoUrl}
                    alt="Photo du fanfaron"
                    className="photoFanfaron"
                  />
                </p>
                <p className="pDescriptionFanfaron">{f.description}</p>
                <p
                  className="fermerDescription"
                  onClick={() => setSelectedId(null)}
                >
                  Fermer
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
};

export default Portraits;
