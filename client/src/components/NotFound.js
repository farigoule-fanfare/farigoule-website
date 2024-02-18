import React from 'react'
import { useNavigate } from 'react-router-dom'

function NotFound() {
    const navigate = useNavigate()

    return (
        <>
            <div>Tu t'es perdu l'ami !</div>
            <button onClick={() => navigate('/')}>Retour à l'accueil</button>
        </>
    )
}

export default NotFound