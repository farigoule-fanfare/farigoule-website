import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {axiosWrapper} from '@api/axiosUtils';
import './Footer.css'

function Footer() {
    const { isAuthenticated, currentUser, logout, isLoading } = useAuth()
    const navigate = useNavigate()

    const [presidentInfo, setPresidentInfo] = useState(null)
    const [loadingPresident, setLoadingPresident] = useState(true)
    const [errorPresident, setErrorPresident] = useState(null)

    useEffect(() => {
        const fetchPresident = async () => {
            setLoadingPresident(true)
            setErrorPresident(null)
            try {
                const response = await axiosWrapper({
                    url: 'users/current-president',
                    method: 'get'
                });

                if (response.data) {
                    setPresidentInfo(response.data)
                } else {
                    throw new Error(response?.error ?? "unknwon error")
                }
            } catch (err) {
                console.error("Erreur lors de la récupération du président:", err)
                setErrorPresident(err.message || 'Erreur de chargement du président.')
                setPresidentInfo(null)
            }
            setLoadingPresident(false)
        }

        fetchPresident()
    }, [])

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
                            {loadingPresident ? (
                                <p>Chargement président...</p>
                            ) : errorPresident ? (
                                <p style={{ color: 'red' }}>Erreur: {errorPresident}</p>
                            ) : presidentInfo ? (
                                <>
                                    {presidentInfo.prenom && presidentInfo.nom 
                                        ? `${presidentInfo.prenom} ${presidentInfo.nom}` 
                                        : presidentInfo.surnom}
                                    {presidentInfo.tel && (
                                        <>
                                            <br />
                                            Tél : {presidentInfo.tel}
                                        </>
                                    )}
                                </>
                            ) : (
                                <p>Président actuel non disponible.</p>
                            )}
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

Footer.propTypes = {
    // No specific props are required for this component
}

export default Footer