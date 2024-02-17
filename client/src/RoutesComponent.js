// Copyright © FINANCE SECURITY GmbH - All rights reserved.
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import PageWrapper from "./components/PageWrapper";
import NotFound from "@components/NotFound";
import LandingPage from "@components/LandingPage";

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
                {/* 404 error component */}
                <Route index={true} element={
                    <PageWrapper privatePage={false}>
                        <NotFound />
                    </PageWrapper>}
                />

                {/* Homepage*/}
                <Route path="/">
                    <Route index={true} element={
                        <PageWrapper privatePage={false}>
                            < LandingPage />
                        </PageWrapper>
                    } />
                    <Route path="*" element={
                        <PageWrapper privatePage={false}>
                            <NotFound />
                        </PageWrapper>}
                    />
                </Route>
            </Routes>
        </div>
    );
}

export default RoutesComponent;
