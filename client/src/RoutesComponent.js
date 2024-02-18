// Copyright © FINANCE SECURITY GmbH - All rights reserved.
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import PageWrapper from "./components/PageWrapper";
import NotFound from "@components/NotFound";
import LandingPage from "@components/LandingPage";
import Chat from "@components/Chat";

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

                    <Route path="*" element={
                        <PageWrapper privatePage={false}>
                            <NotFound />
                        </PageWrapper>}
                    />
                </Route>

                {/* CHAT */}
                <Route path='/chat' element={<PageWrapper privatePage={true}>
                    <Chat />
                </PageWrapper>} />


                {/* 404 error component */}
                <Route index={true} element={
                    <PageWrapper privatePage={false}>
                        <NotFound />
                    </PageWrapper>}
                />
            </Routes>
        </div>
    );
}

export default RoutesComponent;
