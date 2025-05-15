// Copyright © FINANCE SECURITY GmbH - All rights reserved.
import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import PageWrapper from "./components/PageWrapper";
import NotFound from "@components/NotFound";
import LandingPage from "@components/LandingPage";
import Chat from "@components/Chat";
import LoginPage from "./components/auth/LoginPage";
import NousPage from "./components/pages/NousPage";
import ContactPage from "./components/pages/ContactPage";
import Symphonies from "./components/pages/Symphonies";
import Portraits from "./components/pages/portraits/Portraits";
import AdminPanel from "./components/pages/adminPanel/mainPanel";
import GestionFanfarons from "./components/pages/adminPanel/gestionFanfarons";
import GestionAccueil from "./components/pages/adminPanel/gestionAccueil";
import GestionCitations from "./components/pages/adminPanel/gestionCitations";
import GestionUsers from "./components/pages/adminPanel/gestionUsers";
import UserProfile from "./components/pages/UserProfile";
import RequireAuth from "./components/utils/RequireAuth";
import ChangePassword from './components/pages/ChangePassword';

// Wrapper to restrict access to admin-only routes
function AdminRoute({ children }) {
  const { currentUser } = useAuth();
  const roles = currentUser?.roles || [];
  if (!roles.includes('admin')) {
    // Redirect non-admin users to home or a not-authorized page
    return <Navigate to="/" replace />;
  }
  return children;
}

export function RoutesComponent(props) {
    const location = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        const scrollTop = setTimeout(() => window.scrollTo(0, 0), 500);
        return () => clearTimeout(scrollTop);
    }, [location]);

    return (
        <div id="route" className="main-content">
            <Routes>
                {/* Public routes */}
                <Route path="/">
                    <Route
                        index
                        element={
                            <PageWrapper privatePage={false}>
                                <LandingPage />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="gaga"
                        element={
                            <PageWrapper privatePage={false}>
                                <LandingPage />
                            </PageWrapper>
                        }
                    />
                    <Route path="login" element={<LoginPage />} />

                    {/* Admin pages protected by both authentication and admin role */}
                    <Route
                        path="adminPanel"
                        element={
                            <RequireAuth>
                              <AdminRoute>
                                <PageWrapper privatePage={true}>
                                  <AdminPanel />
                                </PageWrapper>
                              </AdminRoute>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="gestionAccueil"
                        element={
                            <RequireAuth>
                              <AdminRoute>
                                <PageWrapper privatePage={true}>
                                  <GestionAccueil />
                                </PageWrapper>
                              </AdminRoute>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="gestionCitations"
                        element={
                            <RequireAuth>
                              <AdminRoute>
                                <PageWrapper privatePage={true}>
                                  <GestionCitations />
                                </PageWrapper>
                              </AdminRoute>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="gestionFanfarons"
                        element={
                            <RequireAuth>
                              <AdminRoute>
                                <PageWrapper privatePage={true}>
                                  <GestionFanfarons />
                                </PageWrapper>
                              </AdminRoute>
                            </RequireAuth>
                        }
                    />

                    <Route
                        path="gestionUsers"
                        element={
                            <RequireAuth>
                              <AdminRoute>
                                <PageWrapper privatePage={true}>
                                  <GestionUsers />
                                </PageWrapper>
                              </AdminRoute>
                            </RequireAuth>
                        }
                    />
                    

                    {/* Other public pages */}
                    <Route
                        path="nous"
                        element={
                            <PageWrapper privatePage={false}>
                                <NousPage />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="contact"
                        element={
                            <PageWrapper privatePage={false}>
                                <ContactPage />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="symphonies"
                        element={
                            <PageWrapper privatePage={false}>
                                <Symphonies />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="portraits"
                        element={
                            <PageWrapper privatePage={false}>
                                <Portraits />
                            </PageWrapper>
                        }
                    />

                    {/* Profile page (authenticated users) */}
                    <Route
                        path="profile"
                        element={
                            <RequireAuth>
                                <PageWrapper privatePage={true}>
                                    <UserProfile />
                                </PageWrapper>
                            </RequireAuth>
                        }
                    />

                    {/* Change password page (authenticated users) */}
                    <Route
                        path="change-password"
                        element={
                            <RequireAuth>
                                <PageWrapper privatePage={true}>
                                    <ChangePassword />
                                </PageWrapper>
                            </RequireAuth>
                        }
                    />

                    {/* Catch-all for this level */}
                    <Route
                        path="*"
                        element={
                            <PageWrapper privatePage={false}>
                                <NotFound />
                            </PageWrapper>
                        }
                    />
                </Route>

                {/* Chat (authenticated users) */}
                <Route
                    path="/chat"
                    element={
                        <RequireAuth>
                            <PageWrapper privatePage={true}>
                                <Chat />
                            </PageWrapper>
                        </RequireAuth>
                    }
                />

                {/* Global 404 */}
                <Route
                    path="*"
                    element={
                        <PageWrapper privatePage={false}>
                            <NotFound />
                        </PageWrapper>
                    }
                />
            </Routes>
        </div>
    );
}

export default RoutesComponent;
