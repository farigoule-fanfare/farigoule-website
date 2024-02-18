import React from 'react'

// TODO
// Import images
// Import CSS
function Header(props) {
    return (
        <header>
            <p className="blocLogo"><img src="img/logo-farigoule.png" alt="Logo de la Farigoule" className="logoFarigoule" /></p>
            <div className="blocHeader">
                <blockquote className="blocCitation">
                    <p className="citation">{props.citation}</p>
                    <p className="auteurCitation">{props.auteurCitation}</p>
                </blockquote>
                <table className="tableauMenu">
                    <thead>
                        <tr>
                            <td><span className="texteAccueil">Accueil</span><br /><a href="index.php"><img src="img/boutons/bouton-accueil.png" alt="Bouton Accueil" className="boutonAccueil" /></a></td>
                            <td><span className="texteNous">Nous</span><br /><a href="nous.php"><img src="img/boutons/bouton-nous.png" alt="Bouton Nous" className="boutonNous" /></a></td>
                            <td><span className="texteSymphonies">Symphonies</span><br /><a href="symphonies.php"><img src="img/boutons/bouton-symphonies.png" alt="Bouton Symphonies" className="boutonSymphonies" /></a></td>
                            <td><span className="textePortraits">Portraits</span><br /><a href="portraits.php"><img src="img/boutons/bouton-portraits.png" alt="Bouton Portraits" className="boutonPortraits" /></a></td>
                            <td><span className="texteContact">Contact</span><br /><a href="contact.php"><img src="img/boutons/bouton-contact.png" alt="Bouton Contact" className="boutonContact" /></a></td>
                        </tr>
                    </thead>
                </table>
            </div>
        </header>
    )
}

Header.defaultProps = {
    citation: "",
    auteurCitation: ""
}

export default Header