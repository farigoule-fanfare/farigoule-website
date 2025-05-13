import React from 'react';
import { useNavigate } from 'react-router-dom';
import LostImg from '../img/not-found.png'; // remplacez 'lost.png' par le nom de votre fichier

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '4rem', margin: '0.5rem 0' }}>Error 404</h1>
      <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>Not found</h2>
      <img
        src={LostImg}
        alt="Perdu"
        style={{ maxWidth: '100%', height: 'auto', margin: '1rem 0' }}
      />
      
       <h3> Oula mais où suis je ??? Je ferais mieux de retourner en terrain connu</h3>
      
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0056b3'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007bff'}
      >
        Retour en lieu sûr
      </button>
    </div>
  );
}

export default NotFound;
