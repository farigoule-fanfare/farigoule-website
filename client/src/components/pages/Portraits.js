// src/components/pages/Portraits.js
import React, { useEffect, useState } from "react";
import ContentPageLayout from "../layout/ContentPageLayout";
import { axiosWrapper } from "@api/axiosUtils";
import "../../css/portraits.css";

const Portraits = () => {
  const [fanfarons, setFanfarons] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchFanfarons = async () => {
      setLoading(true);
      setError(null);
      try {
        // on pointe bien vers /route/api/fanfarons
        const res = await axiosWrapper({
          method: "get",
          url: "route/api/fanfarons"
        });
        if (res.success) {
          setFanfarons(res.data);
        } else {
          throw new Error(res.message || "Erreur chargement");
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
      {error   && <p className="error">Erreur : {error}</p>}

      <div className="portraits-list">
        {fanfarons.map((f) => (
          <div
            key={f.id}
            className="blocFanfaron"
            onClick={() =>
              setSelectedId(selectedId === f.id ? null : f.id)
            }
          >
            <p className="pImageBureau">
              <img
                src={`/img/boutons/${f.bureau}.png`}
                alt={f.bureau}
                className="imageBureau"
              />
            </p>
            <p className="pNomFanfaron">
              {f.prenom} {f.nom}
            </p>
            <p className="pApercuFanfaron">
              <img
                src={f.photoUrl}
                alt={`${f.prenom} ${f.nom}`}
                className="apercuFanfaron"
              />
            </p>

            {selectedId === f.id && (
              <div className="blocDescriptionFanfaron">
                <p className="photoFanfaron">
                  <img
                    src={f.photoUrl}
                    alt={`${f.prenom} ${f.nom}`}
                    className="photoFanfaron"
                  />
                </p>
                <p className="pDescriptionFanfaron">
                  {f.description}
                </p>
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
