import React from 'react';
import ContentPageLayout from '../layout/ContentPageLayout';
import nousImage from '@img/nous.jpg'; 
import './nousPage.css';

const NousPage = () => {
  return (
    <ContentPageLayout title="Nous">
      <div className="container-nous-page">
        <p className="pTexteFarigoule">
          La Farigoule, fanfare de l&apos;École Centrale Marseille, ce sont des fanfarons qui envoient du steak chaque fois qu&apos;ils vont craquer sur la Cannebière, le Vieux-Port ou le Parc Borély. Notre joyeuse fanfare burlesque anime prodigieusement les rues de Marseille et de ses alentours.
        </p>

        <p className="pTexteFarigoule">
          Pour nous faire jouer : c&apos;est facile, où vous voulez (à quelques exceptions près quand même) et quand vous voulez (là, aucune restriction), il suffit de nous contacter. Ouais mais pour nous contacter on fait comment ? Bah, il suffit de cliquer sur le piston en haut à droite !
        </p>

        <p className="pPhotoFarigoule">
          <img src={nousImage} alt="Présentation de la Farigoule" className="photoFarigoule" />
        </p>

        <p className="pTexteFarigoule">
          Vous trouverez sur ce site de la joie et de la bonne humeur ainsi que quelques infos utiles et toutes plus folles les unes que les autres. Appuyez sur les pistons, vous allez voir, c&apos;est trop bieng !
        </p>
      </div>
    </ContentPageLayout>
  );
};

export default NousPage; 