// src/layout/AdminLayout.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // adapte selon ton hook
import ContentPageLayout from './ContentPageLayout';
import './AdminPageLayout.css';                     // styles pour .admin-panel-*

export default function AdminLayout({ title, children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { to: '/gestionAccueil', label: "Gestion page d'accueil" },
    { to: '/gestionCitations', label: 'Gestion des citations' },
    { to: '/gestionFanfarons', label: 'Gestion des fanfarons' },
    { to: '/gestionUsers',    label: 'Gestion des utilisateurs' },
    { action: handleLogout,    label: 'Déconnexion' }
  ];

  return (
    <ContentPageLayout title={title} hideSocialLinks>
      <div className="admin-panel-container">
        {/* ======= Menu latéral ======= */}
        <aside className="admin-panel-menu">
          <nav className="menuAdminContainer">
            {menuItems.map((item, idx) =>
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
                  onKeyPress={e => e.key === 'Enter' && item.action()}
                >
                  {item.label}
                </div>
              )
            )}
          </nav>
        </aside>

        {/* ======= Contenu spécifique ======= */}
        <section className="admin-panel-content">
          {children}
        </section>
      </div>
    </ContentPageLayout>
  );
}
