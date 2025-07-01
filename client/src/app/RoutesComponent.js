import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Layout
import PageWrapper from "../components/common/PageWrapper";

// Pages publiques
import LandingPage from "@components/LandingPage";
import LoginPage from "../components/auth/LoginPage";
import NousPage from "../components/pages/NousPage";
import ContactPage from "../components/pages/ContactPage";
import Symphonies from "../components/pages/Symphonies";
import Portraits from "../components/pages/Portraits";

// Pages utilisateurs
import UserProfile from "../components/pages/UserProfile";
import ChangePassword from '../components/pages/ChangePassword';

// Admin
import AdminPanel from "../components/AdminPanel/pages/mainPanel";
import GestionFanfarons from "../components/AdminPanel/pages/gestionFanfarons";
import GestionAccueil from "../components/AdminPanel/pages/gestionAccueil";
import GestionCitations from "../components/pages/adminPanel/gestionCitations";
import GestionUsers from "../components/AdminPanel/pages/gestionUsers";

// Utilitaires
import RequireAuth from "../components/utils/RequireAuth";
import NotFound from "@components/NotFound";

// Restriction admin
function AdminRoute({ children }) {
  const { currentUser } = useAuth();
  const roles = currentUser?.roles || [];
  if (!roles.includes("admin")) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Wrappers de page
const PublicPage = ({ children }) => (
  <PageWrapper privatePage={false}>{children}</PageWrapper>
);

const PrivatePage = ({ children }) => (
  <RequireAuth>
    <PageWrapper privatePage>{children}</PageWrapper>
  </RequireAuth>
);

const AdminPage = ({ children }) => (
  <RequireAuth>
    <AdminRoute>
      <PageWrapper privatePage>{children}</PageWrapper>
    </AdminRoute>
  </RequireAuth>
);

export function RoutesComponent() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div id="route" className="main-content">
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<PublicPage><LandingPage /></PublicPage>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/nous" element={<PublicPage><NousPage /></PublicPage>} />
        <Route path="/contact" element={<PublicPage><ContactPage /></PublicPage>} />
        <Route path="/symphonies" element={<PublicPage><Symphonies /></PublicPage>} />
        <Route path="/portraits" element={<PublicPage><Portraits /></PublicPage>} />

        {/* Routes privées (utilisateur connecté) */}
        <Route path="/profile" element={<PrivatePage><UserProfile /></PrivatePage>} />
        <Route path="/change-password" element={<PrivatePage><ChangePassword /></PrivatePage>} />

        {/* Routes admin */}
        <Route path="/adminPanel" element={<AdminPage><AdminPanel /></AdminPage>} />
        <Route path="/gestionAccueil" element={<AdminPage><GestionAccueil /></AdminPage>} />
        <Route path="/gestionCitations" element={<AdminPage><GestionCitations /></AdminPage>} />
        <Route path="/gestionFanfarons" element={<AdminPage><GestionFanfarons /></AdminPage>} />
        <Route path="/gestionUsers" element={<AdminPage><GestionUsers /></AdminPage>} />

        {/* 404 */}
        <Route path="*" element={<PublicPage><NotFound /></PublicPage>} />
      </Routes>
    </div>
  );
}

export default RoutesComponent;