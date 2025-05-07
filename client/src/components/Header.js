import React from 'react'
import { Link } from 'react-router-dom';
import './Header.css';

// Import images from the src directory
import logoFarigouleSrc from '../img/logo-farigoule.png'; // Adjusted path if logo is directly in src/img
import boutonAccueilSrc from '../img/boutons/bouton-accueil.png';
import boutonNousSrc from '../img/boutons/bouton-nous.png';
import boutonSymphoniesSrc from '../img/boutons/bouton-symphonies.png';
import boutonPortraitsSrc from '../img/boutons/bouton-portraits.png';
import boutonContactSrc from '../img/boutons/bouton-contact.png';

// TODO
// Import CSS
// - CSS for hover effects on menu items (replaces boutonsHover.js functionality)
// - Ensure citation data is eventually fetched and passed as props if dynamic

function Header(props) {
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
                <table className="tableauMenu">
                    <thead>
                        <tr>
                            <td><span className="texteAccueil">Accueil</span><br /><Link to="/"><img src={boutonAccueilSrc} alt="Bouton Accueil" className="boutonAccueil" /></Link></td>
                            <td><span className="texteNous">Nous</span><br /><Link to="/nous"><img src={boutonNousSrc} alt="Bouton Nous" className="boutonNous" /></Link></td>
                            <td><span className="texteSymphonies">Symphonies</span><br /><Link to="/symphonies"><img src={boutonSymphoniesSrc} alt="Bouton Symphonies" className="boutonSymphonies" /></Link></td>
                            <td><span className="textePortraits">Portraits</span><br /><Link to="/portraits"><img src={boutonPortraitsSrc} alt="Bouton Portraits" className="boutonPortraits" /></Link></td>
                            <td><span className="texteContact">Contact</span><br /><Link to="/contact"><img src={boutonContactSrc} alt="Bouton Contact" className="boutonContact" /></Link></td>
                        </tr>
                    </thead>
                </table>
            </div>
        </header>
    )
}

Header.defaultProps = {
    citation: "Les fanfarons sont des musiciens qui jouent de la musique.",
    auteurCitation: "Un fanfaron célèbre"
}

export default Header