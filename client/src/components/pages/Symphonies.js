// src/components/pages/Symphonies.js
import React, { useState } from "react";
import "./Symphonies.css";

// Import audio files
import epic from "../../mp3/epic.mp3";
import disco from "../../mp3/disco.mp3";
import mestizaje from "../../mp3/mesti.mp3";
import oneTit from "../../mp3/onetit.mp3";
import kro from "../../mp3/kro.mp3";
import boys from "../../mp3/boys.mp3";


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
    <div className="container">
      <h1 className="premierTitre">Symphonies</h1>

      <p className="blocSocial">
        <a href="https://www.facebook.com/FanfareLaFarigoule" target="_blank" rel="noopener noreferrer">
          <img src="/img/boutons/bouton-facebook.png" alt="Facebook" className="boutonFacebook" />
        </a>
        <a href="https://twitter.com/lafarigoule" target="_blank" rel="noopener noreferrer">
          <img src="/img/boutons/bouton-twitter.png" alt="Twitter" className="boutonTwitter" />
        </a>
        <a href="https://www.youtube.com/user/FanfareLaFarigoule" target="_blank" rel="noopener noreferrer">
          <img src="/img/boutons/bouton-youtube.png" alt="YouTube" className="boutonYoutube" />
        </a>
      </p>

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
  );
};

export default Symphonies;
