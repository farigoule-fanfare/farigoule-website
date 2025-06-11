import React from 'react';
import ContentPageLayout from '../layout/ContentPageLayout';
import './ContactPage.css';

const ContactPage = () => {
  return (
    <ContentPageLayout title="Envoyer un message">
      <div className="container-contact-page">
        <p className="pTexteContact">
          En bas de chaque page du site Web, vous trouverez le numéro de téléphone du/de la président(e) de la Farigoule, si vous voulez lui faire une déclaration d&apos;amour. Vous pouvez aussi nous envoyer un message directement sur Instagram ou sur notre page Facebook, en utilisant les boutons sur votre droite !
        </p>
      </div>
    </ContentPageLayout>
  );
};

export default ContactPage; 