// src/components/pages/Symphonies.jsx
import React, { useState, useRef, useEffect } from "react";
import ContentPageLayout from "../layout/ContentPageLayout";
import "./Symphonies.css";

// --- Jaquette connue uniquement pour CD 2
import cd2Cover from "../../img/cover-cd2.png";
import cd1Cover from "../../img/cover-cd1.jpg";

// === PISTES CD 1 (déjà présentes dans ton ancien fichier) ===
import epic      from "../../mp3/cd1/epic.mp3";
import disco     from "../../mp3/cd1/disco.mp3";
import mestizaje from "../../mp3/cd1/mesti.mp3";
import oneTit    from "../../mp3/cd1/onetit.mp3";
import kro       from "../../mp3/cd1/kro.mp3";
import boys      from "../../mp3/cd1/boys.mp3";

// === PISTES CD 2 (fichiers .m4a que tu viens d’ajouter) ===
import prodigy    from "../../mp3/cd2/2_Prodigy.m4a";
import letsGet    from "../../mp3/cd2/3_Let_s Get.m4a";
import biture     from "../../mp3/cd2/4_Biture.m4a";
import passtime   from "../../mp3/cd2/5_Passtime.m4a";
import jalousie   from "../../mp3/cd2/6_Jalousie.m4a";
import backataone from "../../mp3/cd2/7_Backataone.m4a";
import n99        from "../../mp3/cd2/8_99.m4a";
import fastFuse   from "../../mp3/cd2/1_FastFuse.m4a";

// --------------------
// 1) On décrit les deux albums dans un tableau :
const albums = [
  {
    id: "cd1",
    title: "CD 1 – Les Culs, Vettes et Tanches",
    cover: cd1Cover,
    tracks: [
      { n: 1, title: "Epic Sax Guy",    src: epic      },
      { n: 2, title: "Disco Disco !",   src: disco     },
      { n: 3, title: "Mestizaje",       src: mestizaje },
      { n: 4, title: "One-Tit",         src: oneTit    },
      { n: 5, title: "I Wanna Kro",     src: kro       },
      { n: 6, title: "Boys Boys Boys",  src: boys      },
    ],
  },
  {
    id: "cd2",
    title: "CD 2 – Allo ? Maman ?",
    cover: cd2Cover,
    placeholderClass: "",
    tracks: [
      { n: 1, title: "Fast Fuse",     src: fastFuse   },
      { n: 2, title: "Prodigy",       src: prodigy    },
      { n: 3, title: "Let’s Get",     src: letsGet    },
      { n: 4, title: "Biture",        src: biture     },
      { n: 5, title: "Passtime",      src: passtime   },
      { n: 6, title: "Jalousie",      src: jalousie   },
      { n: 7, title: "Backataone",    src: backataone },
      { n: 8, title: "99",            src: n99        },
    ],
  },
];
// --------------------

const Symphonies = () => {
  const [albumIdx, setAlbumIdx]   = useState(0);        // 0 → CD 1
  const [current, setCurrent]     = useState(null);     // index piste en cours
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const album = albums[albumIdx];

  // ↻ change de piste
  useEffect(() => {
    if (current !== null) {
      audioRef.current.src = album.tracks[current].src;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [current, album]);

  const togglePlay = (idx) => {
    if (current === idx) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrent(idx);
    }
  };

  return (
    <ContentPageLayout title="Symphonies">
      {/* --- Sélecteur d’albums --- */}
      <nav className="album-tabs" role="tablist">
        {albums.map((alb, i) => (
          <button
            key={alb.id}
            role="tab"
            aria-selected={albumIdx === i}
            className={albumIdx === i ? "active" : ""}
            onClick={() => { setAlbumIdx(i); setCurrent(null); }}
          >
            {alb.title}
          </button>
        ))}
      </nav>

      {/* --- Grille de pistes --- */}
      <div
        className={`tracks-grid`}
        style={album.cover ? { "--cover-url": `url(${album.cover})` } : {}}
      >
        {album.tracks.map((track, idx) => (
          <button
            key={track.n}
            className={`track-card ${
              current === idx && isPlaying ? "playing" : ""
            }`}
            onClick={() => togglePlay(idx)}
            aria-label={
              current === idx && isPlaying
                ? `Mettre ${track.title} en pause`
                : `Écouter ${track.title}`
            }
          >
            <span className="track-number">{track.n}</span>
            <span className="track-title">{track.title}</span>
            <span className="track-icon" aria-hidden="true" />
          </button>
        ))}
      </div>

      {/* lecteur audio caché */}
      <audio ref={audioRef} hidden controls />
    </ContentPageLayout>
  );
};

export default Symphonies;
