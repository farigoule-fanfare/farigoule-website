// Copyright © FINANCE SECURITY GmbH - All rights reserved.
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

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
import UserProfile from "./components/pages/UserProfile";
import RequireAuth from "./components/utils/RequireAuth";


export function RoutesComponent(props) {
    const location = useLocation()

    // Scroll to top on redirect or refresh
    useEffect(() => {
        const scrollTop = setTimeout(function () {
            window.scrollTo(0, 0);
        }, 500);
        return () => {
            clearTimeout(scrollTop);
        }
    }, [location]);

    return (
        <div id="route" className="main-content">
            <Routes>
                {/* Homepage*/}
                <Route path="/">
                    <Route index={true} element={
                        <PageWrapper privatePage={false}>
                            < LandingPage />
                        </PageWrapper>
                    } />
                    <Route path="gaga" element={<PageWrapper privatePage={false}>
                        < LandingPage />
                    </PageWrapper>
                    } />
                    
                    {/* Login Page Route */}
                    <Route path="login" element={<LoginPage />} />

                    {/* Admin Panel Route (protected) */}
                    <Route path="adminPanel" element={
                        <RequireAuth>
                            <PageWrapper privatePage={true}>
                                <AdminPanel />
                            </PageWrapper>
                        </RequireAuth>
                    } />

                    {/* Admin Panel Route (protected) */}
                    <Route path="gestionFanfarons" element={
                        <RequireAuth>
                            <PageWrapper privatePage={true}>
                                <GestionFanfarons />
                            </PageWrapper>
                        </RequireAuth>
                    } />

                    {/* Nous Page Route */}
                    <Route path="nous" element={
                        <PageWrapper privatePage={false}>
                            <NousPage />
                        </PageWrapper>
                    } />

                    {/* Contact Page Route */}
                    <Route path="contact" element={
                        <PageWrapper privatePage={false}>
                            <ContactPage />
                        </PageWrapper>
                    } />
                    
                    {/* Symphonies Page Route */}
                    <Route path="symphonies" element={
                        <PageWrapper privatePage={false}>
                            <Symphonies />
                        </PageWrapper>
                    } />

                    {/* Portraits Page Route */}
                    <Route path="portraits" element={
                        <PageWrapper privatePage={false}>
                            <Portraits />
                        </PageWrapper>
                    } />

                    {/* User Profile Route (protected) */}
                    <Route path="profile" element={
                        <RequireAuth>
                            <PageWrapper privatePage={true}>
                                <UserProfile />
                            </PageWrapper>
                        </RequireAuth>
                    } />

                    {/* Catch-all for this level */}
                    <Route path="*" element={
                        <PageWrapper privatePage={false}>
                            <NotFound />
                        </PageWrapper>}
                    />
                </Route>

                {/* CHAT */}
                <Route path='/chat' element={
                    <PageWrapper privatePage={true}>
                        <Chat />
                    </PageWrapper>
                } />

                {/* 404 error component */}
                <Route path="*" element={
                    <PageWrapper privatePage={false}>
                        <NotFound />
                    </PageWrapper>}
                />
            </Routes>
        </div>
    );
}

export default RoutesComponent;
