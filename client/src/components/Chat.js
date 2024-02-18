import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@context/auth'


// TODO: si pas connecté, déplace vers "login"
function Chat(props) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user?.loading && !user?.id) {
      navigate('/')
    }

    // TODO get chat

    // Do not include "navigate" in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleSendMessage = () => {
    // TODO send message
  }


  return (
    <div className="container">
      <h1>Bonjour {user.pseudo}, bienvenye dans la Chatte</h1>
      <p className="lienDeconnexion"><button onClick={() => { logout() }}>Déconnexion</button></p>
      <div id="formulaireChat">
        {/* TODO send message */}
        <p><label for="message">Message</label> : <input type="text" name="message" id="message" maxlength="500" /></p>
      </div>
      <section className="conversation">
        {/* TODO display liste messages*/}
      </section>
      <section className="listeConnectes">
        {/* TODO display liste connectés*/}
      </section>
    </div>
  )
}

export default Chat