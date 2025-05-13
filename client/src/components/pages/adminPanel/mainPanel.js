// MenuAdminPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import ContentPageLayout from '../../layout/ContentPageLayout';
import './adminPanel.css';

export default function MenuAdminPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { to: '/gestion-accueil', label: "Gestion page d'accueil" },
    { to: '/citations', label: 'Gestion des citations' },
    { to: '/gestionFanfarons', label: 'Gestion des fanfarons' },
    { to: '/stats-visites', label: 'Statistiques du site' },
    { action: handleLogout, label: 'Déconnexion' }
  ];

  return (
    <ContentPageLayout title="Menu Administration" hideSocialLinks>
      <nav className="menuAdminContainer">
        {menuItems.map((item, idx) => (
          item.to ? (
            <Link key={idx} className="menuItem" to={item.to}>
              {item.label}
            </Link>
          ) : (
            <div
              key={idx}
              className="menuItem logoutItem"
              onClick={item.action}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && item.action()}
            >
              {item.label}
            </div>
          )
        ))}
      </nav>
    </ContentPageLayout>
  );
}