import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Layout
import { PageWrapper } from      "@shell";
    
// Pages publiques     
import { LandingPage } from      "@features/public";
import { NousPage } from         "@features/public";
import { ContactPage } from      "@features/public";
import { Symphonies } from       "@features/public";
import { Portraits } from        "@features/public";
import { NotFound } from         "@features/public";

// Pages auth  
import { UserProfile } from      "@features/profile";
import { ChangePassword } from   "@features/profile";
import { Annuaire } from         "@features/annuaire";

// Pages admin
import { AdminHome } from        "@features/admin";
import { GestionFanfarons } from "@features/admin";
import { GestionAccueil } from   "@features/admin";
import { GestionCitations } from "@features/admin";
import { GestionUsers } from     "@features/admin";

// Utilitaires
import { RequireAuth } from      "@features/auth";
import { LoginPage } from        '@features/auth';

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
        <Route path="/annuaire" element={<PrivatePage><Annuaire /></PrivatePage>} />

        {/* Routes admin */}
        <Route path="/adminPanel" element={<AdminPage><AdminHome /></AdminPage>} />
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