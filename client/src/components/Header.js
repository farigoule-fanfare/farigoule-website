import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import './Header.css';

// Import images from the src directory
import logoFarigouleSrc from '../img/logo-farigoule.png'; // Adjusted path if logo is directly in src/img
import boutonAccueilSrc from '../img/boutons/bouton-accueil.png';
import boutonAccueilHoverSrc from '../img/boutons/bouton-accueil-hover.png';
import boutonNousSrc from '../img/boutons/bouton-nous.png';
import boutonNousHoverSrc from '../img/boutons/bouton-nous-hover.png';
import boutonSymphoniesSrc from '../img/boutons/bouton-symphonies.png';
import boutonSymphoniesHoverSrc from '../img/boutons/bouton-symphonies-hover.png';
import boutonPortraitsSrc from '../img/boutons/bouton-portraits.png';
import boutonPortraitsHoverSrc from '../img/boutons/bouton-portraits-hover.png';
import boutonContactSrc from '../img/boutons/bouton-contact.png';
import boutonContactHoverSrc from '../img/boutons/bouton-contact-hover.png';

// TODO
// Import CSS
// - CSS for hover effects on menu items (replaces boutonsHover.js functionality)
// - Ensure citation data is eventually fetched and passed as props if dynamic

function Header(props) {
    const [isAccueilHovered, setIsAccueilHovered] = useState(false);
    const [isNousHovered, setIsNousHovered] = useState(false);
    const [isSymphoniesHovered, setIsSymphoniesHovered] = useState(false);
    const [isPortraitsHovered, setIsPortraitsHovered] = useState(false);
    const [isContactHovered, setIsContactHovered] = useState(false);

    const { isAuthenticated, currentUser, logout, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/'); // Redirect to homepage after logout
    };

    return (
        <header>
            <p className="blocLogo">
                <img src={logoFarigouleSrc} alt="Logo de la Farigoule" className="logoFarigoule" />
            </p>
            <div className="blocHeader">
                <blockquote className="blocCitation">
                    <p className="citation">{props.citation}</p>
                    <p className="auteurCitation">{props.auteurCitation}</p>
                </blockquote>

                {/* Auth Status Display */}
                <div className="auth-status-header">
                    {isAuthenticated ? (
                        <>
                            <span>Bienvenue, {currentUser?.surnom}!</span>
                            <button onClick={handleLogout} disabled={isLoading} className="logout-button-header">
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="login-link-header">Connexion</Link>
                    )}
                </div>

                <table className="tableauMenu">
                    <thead>
                        <tr>
                            <td 
                                onMouseEnter={() => setIsAccueilHovered(true)}
                                onMouseLeave={() => setIsAccueilHovered(false)}
                            >
                                <span className="texteAccueil">Accueil</span><br />
                                <Link to="/">
                                    <img src={isAccueilHovered ? boutonAccueilHoverSrc : boutonAccueilSrc} alt="Bouton Accueil" className="boutonAccueil" />
                                </Link>
                            </td>
                            <td
                                onMouseEnter={() => setIsNousHovered(true)}
                                onMouseLeave={() => setIsNousHovered(false)}
                            >
                                <span className="texteNous">Nous</span><br />
                                <Link to="/nous">
                                    <img src={isNousHovered ? boutonNousHoverSrc : boutonNousSrc} alt="Bouton Nous" className="boutonNous" />
                                </Link>
                            </td>
                            <td
                                onMouseEnter={() => setIsSymphoniesHovered(true)}
                                onMouseLeave={() => setIsSymphoniesHovered(false)}
                            >
                                <span className="texteSymphonies">Symphonies</span><br />
                                <Link to="/symphonies">
                                    <img src={isSymphoniesHovered ? boutonSymphoniesHoverSrc : boutonSymphoniesSrc} alt="Bouton Symphonies" className="boutonSymphonies" />
                                </Link>
                            </td>
                            <td
                                onMouseEnter={() => setIsPortraitsHovered(true)}
                                onMouseLeave={() => setIsPortraitsHovered(false)}
                            >
                                <span className="textePortraits">Portraits</span><br />
                                <Link to="/portraits">
                                    <img src={isPortraitsHovered ? boutonPortraitsHoverSrc : boutonPortraitsSrc} alt="Bouton Portraits" className="boutonPortraits" />
                                </Link>
                            </td>
                            <td
                                onMouseEnter={() => setIsContactHovered(true)}
                                onMouseLeave={() => setIsContactHovered(false)}
                            >
                                <span className="texteContact">Contact</span><br />
                                <Link to="/contact">
                                    <img src={isContactHovered ? boutonContactHoverSrc : boutonContactSrc} alt="Bouton Contact" className="boutonContact" />
                                </Link>
                            </td>
                        </tr>
                    </thead>
                </table>
            </div>
        </header>
    )
}

Header.propTypes = {
    citation: PropTypes.string.isRequired,
    auteurCitation: PropTypes.string.isRequired,
}

export default Header