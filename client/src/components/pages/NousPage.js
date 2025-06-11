import React from 'react';
import ContentPageLayout from '../layout/ContentPageLayout';
import nousImage from '@img/nous.jpg'; 
import './NousPage.css';

const NousPage = () => {
  return (
    <ContentPageLayout title="Nous">
      <div class="presentation-fanfare">
        <h2>🎺 La Farigoule</h2>
        <p>
          <strong>La Farigoule</strong> — fanfare déjantée, festive et haute en couleurs — fait vibrer Marseille et tout le sud-est de la France ! Composée d’élèves ingénieurs de l’École Centrale Méditerranée, notre troupe burlesque mêle passion musicale et joie communicative.
        </p>

        <p>
          Oubliez les fanfares sages au pas cadencé. Avec nous, c’est une métamorphose : <strong>du rock, de la pop, de l’électro, de la variété, des musiques de films, de pub, et même des adaptations vitaminées d’autres brass bands</strong>. Et tout ça, au travers de morceaux originaux concoctés avec amour.
        </p>

        <h3>🎉 La Farigoule, c’est :</h3>
        <ul>
          <li>Des musiciens au cœur aussi grand que leur groove</li>
          <li>Des prestations dans les rues de Marseille — Canebière, Vieux-Port, parc Longchamp et au-delà</li>
          <li>Une énergie explosive, une ambiance burlesque, et des costumes débridés</li>
          <li>Et surtout, la fête, partout, pour tout le monde !</li>
        </ul>
        <p className="pPhotoFarigoule">
          <img src={nousImage} alt="Présentation de la Farigoule" className="photoFarigoule" />
        </p>
        <h3>🎷 Vous voulez nous faire jouer à votre événement ?</h3>
        <p>
          C’est possible où vous voulez (ou presque) et quand vous voulez (vraiment). Nous proposons aussi des <strong>prestations privées sur demande</strong>.
        </p>
        <p>
          Pour nous contacter :
        </p>
        <ul>
          <li>
            👉 rendez-vous sur la page <a href="/contact">Contact</a>
          </li>
          <li>
            👉 ou directement sur notre Instagram{' '}
            <a href="https://instagram.com/la_farigoule_fanfare" target="_blank" rel="noopener noreferrer">
              @la_farigoule_fanfare
            </a>
          </li>
        </ul>


        <h3>📸 Sur ce site, vous trouverez :</h3>
        <ul>
          <li>Le <strong>portrait de nos fanfarons</strong></li>
          <li>Des <strong>photos</strong> hautes en couleurs</li>
          <li>Et un <strong>extrait mp3 de notre CD</strong> pour embarquer dans l’univers  de la Farigoule</li>
        </ul>

       <p style={{ fontWeight: 'bold', fontSize: '1.2em', marginTop: '1em', textAlign: 'center'}}> 🧡 On est la Farigoule et on vous aime !</p>
      </div>
    </ContentPageLayout>
  );
};

export default NousPage; 