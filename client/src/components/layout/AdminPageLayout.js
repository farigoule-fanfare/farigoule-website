import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@features/auth';
import ContentPageLayout from './ContentPageLayout';
import './AdminPageLayout.css';

export default function AdminLayout({ title, children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
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
                  onKeyDown={e => e.key === 'Enter' && item.action()}
                >
                  {item.label}
                </div>
              )
            )}
          </nav>
        </aside>

        <section className="admin-panel-content">
            {children}
        </section>
      </div>
    </ContentPageLayout>
  );
}
