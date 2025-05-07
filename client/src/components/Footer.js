import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

// president: {nom: String, phone: String}
// isAdmin: boolean (new prop to decide if admin link is shown)
function Footer({ president, isConnected, isAdmin }) {
    return (
        <footer>
            <h1>Et sinon ?</h1>
            <table className="tableauFooter">
                <tbody>
                    <tr>
                        <th>Notre adresse</th>
                        <th>Contacter notre président</th>
                        <th>Pour les fanfarons</th>
                    </tr>
                    <tr>
                        <td>La Farigoule<br />École Centrale Marseille<br />38 rue Frédéric Joliot-Curie<br />13013 Marseille</td>
                        <td>
                            {/* TODO ajouter président */}
                            {president.nom} <br />
                            Tél : {president.phone}
                        </td>
                        <td><Link to="/chat">Accès fanfarons</Link>
                            {!!isConnected &&
                                <>
                                    <br />(Connecté)</>}
                            {isAdmin && // Conditionally show admin link
                                <>
                                    <br /><Link to="/admin">Accès admin</Link>
                                </>}
                        </td>
                    </tr>
                </tbody>
            </table>
        </footer>
    )
}

Footer.defaultProps = {
    president: { nom: "Prénom Nom", phone: "00 00 00 00 00" },
    isConnected: false,
    isAdmin: false // Default isAdmin to false
}

export default Footer