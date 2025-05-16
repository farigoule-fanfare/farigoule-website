import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { axiosWrapper } from '@api/axiosUtils'
import './Footer.css'

function Footer() {
  const { isAuthenticated, currentUser, logout, isLoading } = useAuth()
  const navigate = useNavigate()

  const [presidentInfo, setPresidentInfo] = useState(null)
  const [loadingPresident, setLoadingPresident] = useState(true)
  const [errorPresident, setErrorPresident] = useState(null)
  const tableRef = useRef(null)

  useEffect(() => {
    // Fetch current president
    const fetchPresident = async () => {
      setLoadingPresident(true)
      setErrorPresident(null)
      try {
        const response = await axiosWrapper({
          url: 'users/current-president',
          method: 'get'
        })
        if (response.data) setPresidentInfo(response.data)
        else throw new Error(response?.error || 'Erreur inconnue')
      } catch (err) {
        console.error('Erreur récupération président :', err)
        setErrorPresident(err.message || 'Erreur de chargement')
      }
      setLoadingPresident(false)
    }
    fetchPresident()

    // Center table second column
    const centerOnSecondCol = () => {
      const table = tableRef.current
      if (!table) return
      const th2 = table.querySelector('th:nth-child(2)')
      if (!th2) return
      const thRect = th2.getBoundingClientRect()
      const headerCenter = thRect.left + thRect.width / 2
      const windowCenter = window.innerWidth / 2
      table.style.transform = `translateX(${windowCenter - headerCenter}px)`
    }
    window.addEventListener('load', centerOnSecondCol)
    window.addEventListener('resize', centerOnSecondCol)
    centerOnSecondCol()
    return () => {
      window.removeEventListener('load', centerOnSecondCol)
      window.removeEventListener('resize', centerOnSecondCol)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // Determine admin status correctly
  const roles = currentUser?.roles || []
  const isAdmin = roles.includes('admin')

  return (
    <footer>
      <h1>Et sinon ?</h1>
      <table ref={tableRef} className="tableauFooter">
        <tbody>
          <tr>
            <th>Notre adresse</th>
            <th>Contacter notre président</th>
            <th>Pour les fanfarons</th>
          </tr>
          <tr>
            <td>
              La Farigoule<br />École Centrale Marseille<br />38 rue Frédéric Joliot-Curie<br />13013 Marseille
            </td>
            <td>
              {loadingPresident ? (
                <p>Chargement président...</p>
              ) : errorPresident ? (
                <p style={{ color: 'red' }}>Erreur : {errorPresident}</p>
              ) : presidentInfo ? (
                <>
                  {presidentInfo.prenom && presidentInfo.nom
                    ? `${presidentInfo.prenom} ${presidentInfo.nom}`
                    : presidentInfo.surnom}
                  {presidentInfo.tel && (
                    <><br />Tél : {presidentInfo.tel}</>
                  )}
                </>
              ) : (
                <p>Président non disponible.</p>
              )}
            </td>
            <td>
              {isAuthenticated ? (
                <>
                  Connecté en tant que : {currentUser.surnom}<br />
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="logout-button-footer"
                  >
                    Déconnexion
                  </button>
                  <br />
                  <Link to="/chat">Accès au Chat</Link>
                  {isAdmin && (
                    <><br /><Link to="/adminPanel">Panneau d'administration</Link></>
                  )}
                </>
              ) : (
                <Link to="/login">Connexion</Link>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </footer>
  )
}

export default Footer
