import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { axiosWrapper } from '@api/axiosUtils'
import './Footer.css'

function Footer () {
  const { isAuthenticated, currentUser, logout, isLoading } = useAuth()
  const navigate = useNavigate()

  const [presidentInfo, setPresidentInfo] = useState(null)
  const [loadingPresident, setLoadingPresident] = useState(true)
  const [errorPresident, setErrorPresident] = useState(null)

  /* -------- Récupération du président -------- */
  useEffect(() => {
    const fetchPresident = async () => {
      setLoadingPresident(true)
      setErrorPresident(null)
      try {
        const res = await axiosWrapper({ url: 'api/users/current-president', method: 'get' })
        if (res.data) setPresidentInfo(res.data)
        else throw new Error(res?.error || 'Erreur inconnue')
      } catch (err) {
        console.error('Erreur récupération président :', err)
        setErrorPresident(err.message || 'Erreur de chargement')
      }
      setLoadingPresident(false)
    }
    fetchPresident()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isAdmin = (currentUser?.roles || []).includes('admin')

  return (
    <footer className="footerGrid">
      {/* Titre centré sur toute la largeur */}
      <h1 className="titreFooter">Et sinon&nbsp;?</h1>

      {/* Colonne 1 : adresse */}
      <div className="bloc adresse">
        <strong className='footer-subtitle'>Notre adresse</strong><br />
        La Farigoule<br />
        École Centrale Méditerranée<br />
        38 rue Frédéric Joliot-Curie<br />
        13013 Marseille
      </div>

      {/* Colonne 2 : président */}
      <div className="bloc president">
        <strong className='footer-subtitle'>Contacter notre président(e)</strong><br />
        {loadingPresident
          ? 'Chargement…'
          : errorPresident
            ? <span style={{ color: 'red' }}>Erreur : {errorPresident}</span>
            : presidentInfo
              ? (
                <>
                  {presidentInfo.prenom && presidentInfo.nom
                    ? `${presidentInfo.prenom} ${presidentInfo.nom}`
                    : presidentInfo.surnom}
                  {presidentInfo.tel && <><br />Tél : {presidentInfo.tel}</>}
                </>
              )
              : 'Président non disponible.'}
      </div>

      {/* Colonne 3 : liens fanfarons */}
      <div className="bloc fanfarons">
        <strong className='footer-subtitle'>Pour les fanfarons</strong><br />
        {isAuthenticated ? (
          <>
            Connecté en tant que : {currentUser.surnom}<br />
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="contentPage-button contentPage-button--delete"
              type = 'button'
            >
              Déconnexion
            </button><br />
            {isAdmin && <><Link to="/adminPanel">Panneau d'administration</Link></>}
          </>
        ) : (
          <Link to="/login">Connexion</Link>
        )}
      </div>
    </footer>
  )
}

export default Footer
