import React from 'react'

// president: {nom: String, phone: String}
function Footer({ president, isConnected }) {
    return (
        <footer>
            <h1>Et sinon ?</h1>
            <table class="tableauFooter">
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
                    <td><a href="chat.php">Accès fanfarons</a>
                        {!!isConnected &&
                            <>
                                <br />Connecté</>}

                    </td>
                </tr>
            </table>
        </footer>
    )
}

Footer.defaultProps = {
    president: { nom: "Prénom Nom", phone: "00 00 00 00 00" },
    isConnected: false
}

export default Footer