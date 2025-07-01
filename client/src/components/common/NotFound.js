import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContentPageLayout from '../layout/ContentPageLayout';
import LostImg from '@assets/images/not-found.png';

function NotFound() {
  const navigate = useNavigate();

  return (
    <ContentPageLayout title="Oh non, page introuvable !">
    <div class="not-found-container" style={{ margin: '0 auto' }}>
      <h1 style={{ fontSize: '4rem', margin: '0.5rem 0' }}>Error 404</h1>
      <p style={{ textAlign: 'center' }}>
        <button
        onClick={() => navigate('/')}
        className='contentPage-button contentPage-button--submit' type="submit"
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0056b3'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007bff'}
        >
        Retour en lieu sûr
        </button>

      
        <img
          src={LostImg} alt="Perdu" style={{ maxWidth: '100%', height: 'auto', margin: '1rem auto', display: 'block' }}
        />
      

       <h3> Oula mais où suis je ??? Je ferais mieux de retourner en terrain connu</h3>
      
        <button
          onClick={() => navigate('/')}
          className='contentPage-button contentPage-button--submit' type="submit"
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          Retour en lieu sûr
        </button>
      </p>
    </div>
 
  </ContentPageLayout> 
  );
}

export default NotFound;
