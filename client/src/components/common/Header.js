import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@features/auth';
import useCitations from './hooks/useCitations';
import './Header.css';

import logoFarigouleSrc from '@assets/images/logo-farigoule.png';
import boutonAccueilSrc from '@assets/images/boutons/bouton-accueil.png';
import boutonAccueilHoverSrc from '@assets/images/boutons/bouton-accueil-hover.png';
import boutonNousSrc from '@assets/images/boutons/bouton-nous.png';
import boutonNousHoverSrc from '@assets/images/boutons/bouton-nous-hover.png';
import boutonSymphoniesSrc from '@assets/images/boutons/bouton-symphonies.png';
import boutonSymphoniesHoverSrc from '@assets/images/boutons/bouton-symphonies-hover.png';
import boutonPortraitsSrc from '@assets/images/boutons/bouton-portraits.png';
import boutonPortraitsHoverSrc from '@assets/images/boutons/bouton-portraits-hover.png';
import boutonContactSrc from '@assets/images/boutons/bouton-contact.png';
import boutonContactHoverSrc from '@assets/images/boutons/bouton-contact-hover.png';

function Header() {
    const [isAccueilHovered, setIsAccueilHovered] = useState(false);
    const [isNousHovered, setIsNousHovered] = useState(false);
    const [isSymphoniesHovered, setIsSymphoniesHovered] = useState(false);
    const [isPortraitsHovered, setIsPortraitsHovered] = useState(false);
    const [isContactHovered, setIsContactHovered] = useState(false);
    const { citation, auteurCitation } = useCitations(); 
    const { isAuthenticated, currentUser, logout, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };
    const handleGoProfile = () => navigate('/profile');

    return (
        <header>
            <p className="blocLogo">
                <img src={logoFarigouleSrc} alt="Logo de la Farigoule" className="logoFarigoule" />
            </p>
            <div className="blocHeader">
                <blockquote className="blocCitation">
                    <p className="citation">{citation}</p>
                    <p className="auteurCitation">{auteurCitation}</p>
                </blockquote>

                <div className="auth-status-header">
                    {isAuthenticated && (
                        <>
                            <span className="auth-user">Bienvenue, {currentUser?.surnom} !</span>
                            <button onClick={handleGoProfile} className="contentPage-button contentPage-button--edit" type="button">
                                Mon profil
                            </button>
                            <button onClick={handleLogout} disabled={isLoading} className="contentPage-button contentPage-button--delete" type="button">
                                Déconnexion
                            </button>
                        </>
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-4 md:flex-nowrap md:justify-between tableauMenu">
                    {[{
                        title: 'Accueil', link: '/', img: boutonAccueilSrc, hover: boutonAccueilHoverSrc, isHovered: isAccueilHovered, setHovered: setIsAccueilHovered, className: 'boutonAccueil'
                    }, {
                        title: 'Nous', link: '/nous', img: boutonNousSrc, hover: boutonNousHoverSrc, isHovered: isNousHovered, setHovered: setIsNousHovered, className: 'boutonNous'
                    }, {
                        title: 'Symphonies', link: '/symphonies', img: boutonSymphoniesSrc, hover: boutonSymphoniesHoverSrc, isHovered: isSymphoniesHovered, setHovered: setIsSymphoniesHovered, className: 'boutonSymphonies'
                    }, {
                        title: 'Portraits', link: '/portraits', img: boutonPortraitsSrc, hover: boutonPortraitsHoverSrc, isHovered: isPortraitsHovered, setHovered: setIsPortraitsHovered, className: 'boutonPortraits'
                    }, {
                        title: 'Contact', link: '/contact', img: boutonContactSrc, hover: boutonContactHoverSrc, isHovered: isContactHovered, setHovered: setIsContactHovered, className: 'boutonContact'
                    }].map(({ title, link, img, hover, isHovered, setHovered, className }) => (
                        <div key={title} className="flex flex-col items-center" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                            <span className="text-sm font-semibold">{title}</span>
                            <Link to={link}>
                                <img src={isHovered ? hover : img} alt={`Bouton ${title}`} className={className} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </header>
    );
}

Header.propTypes = {};

export default Header;
