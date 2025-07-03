<<<<<<< HEAD:client/src/components/pages/Symphonies.js
// src/components/pages/Symphonies.jsx
import React, { useState, useRef, useEffect } from "react";
import ContentPageLayout from "../layout/ContentPageLayout";
import { armAngleDeg } from "./helpers/armAngle";
import "./Symphonies.css";

// --- Jaquette connue uniquement pour CD 2
import cd2Cover from "../../img/symphonies/cover-cd2.png";
import cd1Cover from "../../img/symphonies/cover-cd1.png";
import image_toneArm from "../../img/symphonies/tonearm.png"
=======
// src/components/pages/Symphonies.js
import React, { useState } from "react";
import { ContentPageLayout } from "@shell"
import "./Symphonies.css";

// Import audio files
import epic from      "@assets/audio/epic.mp3";
import disco from     "@assets/audio/disco.mp3";
import mestizaje from "@assets/audio/mesti.mp3";
import oneTit from    "@assets/audio/onetit.mp3";
import kro from       "@assets/audio/kro.mp3";
import boys from      "@assets/audio/boys.mp3";
>>>>>>> dev-clean:client/src/features/public/pages/Symphonies.js

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

/* ------------------------------------------------------------------ */
/* 3) Sous-composants ------------------------------------------------ */

function AlbumSelector({ albums, albumIdx, setAlbumIdx }) {
  return (
    <nav className="album-tabs" role="tablist">
      {albums.map((alb, i) => (
        <button
          key={alb.id}
          role="tab"
          aria-selected={albumIdx === i}
          className={albumIdx === i ? "active" : ""}
          onClick={() => setAlbumIdx(i)}
        >
          {alb.title}
        </button>
      ))}
    </nav>
  );
}

function Turntable({ cover, isPlaying, angle, onPlayPause }) {
  return (
    <div className="turntable-box">
      <div className="turntable">
        {/* Disque vinyle (cover injectée via CSS custom property) */}
        <div
          className={`vinyl ${isPlaying ? "spinning" : ""}`}
          style={{ "--cover": `url(${cover})` }}
          aria-hidden="true"
        />

        {/* Bras pivotant */}
        <div
        className="tonearm-wrap"  style={{ transform: `rotate(${angle}deg)` }}>
        <img
          src={image_toneArm}
          className="tonearm"
          alt=""
          aria-hidden="true"
        /></div>

        {/* Bouton Play / Pause */}
        <button
          className="btn-play"
          onClick={onPlayPause}
          aria-label={isPlaying ? "Mettre en pause" : "Lecture"}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
      </div>
    </div>
  );
}

function TrackSelector({ album, trackIdx, prev, next }) {
  return (
    <div className="track-selector">
      <button onClick={prev} aria-label="Piste précédente">
        ◀
      </button>
      <span className="track-title" aria-live="polite">
        {album.tracks[trackIdx].title}
      </span>
      <button onClick={next} aria-label="Piste suivante">
        ▶
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3) Composant principal ------------------------------------------- */
export default function Symphonies() {
  const [albumIdx, setAlbumIdx] = useState(0);
  const [trackIdx, setTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const album = albums[albumIdx];
  const currentTrack = album.tracks[trackIdx];

  /* -- (re)charge la bonne piste quand album ou track change -------- */
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = currentTrack.src;
    if (isPlaying) {
      const p = audioRef.current.play();
      if (p) p.catch(console.error);
    }
  }, [albumIdx, trackIdx]); //  eslint-disable-line react-hooks/exhaustive-deps

  /* -- Play / Pause ------------------------------------------------- */
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  /* -- Sélection précédente/suivante -------------------------------- */
  const prevTrack = () =>
    setTrackIdx((i) => (i - 1 + album.tracks.length) % album.tracks.length);
  const nextTrack = () => setTrackIdx((i) => (i + 1) % album.tracks.length);

  /* -- Quand la piste se termine, on enchaîne ----------------------- */
  const handleEnded = () => {
    nextTrack();
    setIsPlaying(true);
  };
  /* Bras vinyle */
  /* -- Angle du bras vinyle ---------------------------------------- */
  const playingAngle = armAngleDeg(trackIdx, album.tracks.length);
  const angle = isPlaying ? playingAngle : 0;

  return (
    <ContentPageLayout title="Symphonies">
      <p>- Entre variété française et reggae bolchévique, le premier album de la Farigoule - les Culs, Vettes et Tanches - sorti en 2012, propose des compositions florales variées.
Ses six pistes déjantées, mettra l'ambiance dans toutes vos soirées.</p>
      <p>- Après trois ans d'une attente interminable et un joli coup de pouce de John Williams, notre second CD est sorti à l'été 2017 !
Vous pourrez vous le procurer sur le Vieux Port dès que vous nous verrez, ou n'importe où d'ailleurs, n'hésitez pas</p>
      {/* Sélecteur de CD */}
      <AlbumSelector
        albums={albums}
        albumIdx={albumIdx}
        setAlbumIdx={(i) => {
          setAlbumIdx(i);
          setTrackIdx(0);
          setIsPlaying(false);
        }}
      />

      {/* Platine */}
      <Turntable
        cover={album.cover}
        isPlaying={isPlaying}
        angle={angle}
        onPlayPause={togglePlay}
      />

      {/* Sélecteur de pistes */}
      <TrackSelector
        album={album}
        trackIdx={trackIdx}
        prev={prevTrack}
        next={nextTrack}
      />

      {/* Élément <audio> masqué (mais ARIA-friendly) */}
      <audio ref={audioRef} hidden onEnded={handleEnded} preload="auto" />
    </ContentPageLayout>
  );
}


