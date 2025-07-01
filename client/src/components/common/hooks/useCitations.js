import { useEffect, useState } from "react";
import { axiosWrapper } from "@services/axiosUtils";

export default function useCitations() {
  const [{ citation, auteur }, setCitation] = useState({
    citation: "",
    auteur: "",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchCitation = async () => {
      try {
        const res = await axiosWrapper({
          url: "api/citations",
          method: "get",
        });

        if (!res?.data) throw new Error("Réponse vide ou indéfinie");

        // Adaptation aux clés retournées par ton back-end
        const quote  = res.data.citation        ?? res.data.quote  ?? "";
        const author = res.data.auteurCitation  ?? res.data.author ?? "";

        if (isMounted) setCitation({ citation: quote, auteur: author });
      } catch (err) {
        /* eslint-disable-next-line no-console */
        console.error("Erreur récupération citation :", err);
      }
    };

    fetchCitation();                    // 1er appel immédiat
    const id = setInterval(fetchCitation, 10_000); // puis toutes les 10 s

    return () => {
      isMounted = false;
      clearInterval(id);                // nettoyage interval
    };
  }, []);

  return { citation, auteur };          // ↩️ à consommer dans <Header/>
}
