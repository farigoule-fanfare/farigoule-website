import React from 'react'

// TODO
// Import images
// Import CSS
function Header(props) {
    return (
        <header>
            <p class="blocLogo"><img src="img/logo-farigoule.png" alt="Logo de la Farigoule" class="logoFarigoule" /></p>
            <div class="blocHeader">
                <blockquote class="blocCitation">
                    <p class="citation">{props.citation}</p>
                    <p class="auteurCitation">{props.auteurCitation}</p>
                </blockquote>
                <table class="tableauMenu">
                    <tr>
                        <td><span class="texteAccueil">Accueil</span><br /><a href="index.php"><img src="img/boutons/bouton-accueil.png" alt="Bouton Accueil" class="boutonAccueil" /></a></td>
                        <td><span class="texteNous">Nous</span><br /><a href="nous.php"><img src="img/boutons/bouton-nous.png" alt="Bouton Nous" class="boutonNous" /></a></td>
                        <td><span class="texteSymphonies">Symphonies</span><br /><a href="symphonies.php"><img src="img/boutons/bouton-symphonies.png" alt="Bouton Symphonies" class="boutonSymphonies" /></a></td>
                        <td><span class="textePortraits">Portraits</span><br /><a href="portraits.php"><img src="img/boutons/bouton-portraits.png" alt="Bouton Portraits" class="boutonPortraits" /></a></td>
                        <td><span class="texteContact">Contact</span><br /><a href="contact.php"><img src="img/boutons/bouton-contact.png" alt="Bouton Contact" class="boutonContact" /></a></td>
                    </tr>
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