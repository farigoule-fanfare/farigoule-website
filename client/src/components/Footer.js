import React from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Footer.css'

// president: {nom: String, phone: String}
function Footer({ president }) {
    const { isAuthenticated, currentUser, logout, isLoading } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    // Determine if the current user is an admin
    const isAdmin = currentUser && currentUser.roles && currentUser.roles.split(',').map(role => role.trim()).includes('admin')

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
                            {president.nom} <br />
                            Tél : {president.phone}
                        </td>
                        <td>
                            {isAuthenticated ? (
                                <>
                                    Connecté en tant que : {currentUser?.surnom} <br />
                                    <button onClick={handleLogout} disabled={isLoading} className="logout-button-footer">
                                        Déconnexion
                                    </button>
                                    <br />
                                    <Link to="/chat">Accès au Chat</Link>
                                    {isAdmin && (
                                        <>
                                            <br /><Link to="/admin">Panneau d'administration</Link>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Link to="/login">Connexion</Link>
                                    <br />
                                    <span style={{color: 'grey'}}>(Accès au Chat réservé)</span>
                                </> 
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </footer>
    )
}

// Footer.defaultProps = {
//     president: { nom: "Prénom Nom", phone: "00 00 00 00 00" },
//     isConnected: false,
//     isAdmin: false // Default isAdmin to false
// }

Footer.propTypes = {
    president: PropTypes.object.isRequired,
}

export default Footer