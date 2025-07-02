import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Layout
import PageWrapper from      "@components/common/PageWrapper";
    
// Pages publiques     
import { LandingPage } from "@features/public";
import { LoginPage } from '@features/auth';
import { NousPage } from "@features/public";
import { ContactPage } from "@features/public";
import { Symphonies } from "@features/public";
import { Portraits } from "@features/public";

// Pages utilisateurs  
import { UserProfile } from      "@features/profile";
import { ChangePassword } from   "@features/profile";

// Admin
import AdminPanel from       "@components/AdminPanel/pages/mainPanel";
import GestionFanfarons from "@components/AdminPanel/pages/gestionFanfarons";
import GestionAccueil from   "@components/AdminPanel/pages/gestionAccueil";
import GestionCitations from "@components/AdminPanel/pages/gestionCitations";
import GestionUsers from     "@components/AdminPanel/pages/gestionUsers";

// Utilitaires
import { RequireAuth } from      "@features/auth";
import { NotFound } from         "@features/public";

// Wrappers de page
const PublicPage = ({ children }) => (
  <PageWrapper>{children}</PageWrapper>
);

const PrivatePage = ({ children }) => (
  <RequireAuth>
    <PageWrapper>{children}</PageWrapper>
  </RequireAuth>
);

const AdminPage = ({ children }) => (
  <RequireAuth requiredRole="admin">
      <PageWrapper>{children}</PageWrapper>
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