// src/components/pages/Symphonies.js
import React, { useState } from "react";
import ContentPageLayout from "../../layout/ContentPageLayout";
import "./Symphonies.css";

// Import audio files
import epic from      "@assets/audio/epic.mp3";
import disco from     "@assets/audio/disco.mp3";
import mestizaje from "@assets/audio/mesti.mp3";
import oneTit from    "@assets/audio/onetit.mp3";
import kro from       "@assets/audio/kro.mp3";
import boys from      "@assets/audio/boys.mp3";


const audioMap = {
  epic,
  disco,
  mestizaje,
  "one-tit": oneTit,
  kro,
  boys,
};

const tracks = [
  { id: "cdEpic", name: "Epic Sax Guy", key: "epic" },
  { id: "cdDisco", name: "Disco Disco !", key: "disco" },
  { id: "cdMesti", name: "Mestizaje", key: "mestizaje" },
  { id: "cdOneTit", name: "One-Tit", key: "one-tit" },
  { id: "cdKro", name: "I Wanna Kro", key: "kro" },
  { id: "cdBoys", name: "Boys Boys Boys", key: "boys" },
];

const Symphonies = () => {
  const [audioSrc, setAudioSrc] = useState("");

  return (
  <ContentPageLayout title="Symphonies">
    <div className="container-symphonies-page">
    <p>
      Entre variété française et reggae bolchévique, l&apos;album de la Farigoule - les Culs, Vettes et Tanches -
      propose des compositions florales variées ainsi qu&apos;une jaquette en plastique recyclable.
      <br />
      Notre superbe Compact-Disc, avec ses six pistes déjantées, mettra l&apos;ambiance dans toutes vos soirées.
    </p>

    <ol>
      {tracks.map((track) => (
        <li key={track.id}>
          <button
            onClick={() => setAudioSrc(audioMap[track.key])}
            className="trackButton"
          >
            {track.name}
          </button>
        </li>
      ))}
    </ol>

    <audio controls id="lecteurCD" src={audioSrc} autoPlay />
    </div>
  </ContentPageLayout>
);

};

export default Symphonies;
