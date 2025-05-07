// Copyright © FINANCE SECURITY GmbH - All rights reserved.
import React, { useEffect, useState, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

import Loading from "@components/utils/Loading";
import { axiosWrapper } from "../api/axiosUtils"; // Import axiosWrapper

const Header = lazy(() => import("@components/Header"));
const Footer = lazy(() => import("@components/Footer"));
const RequireAuth = lazy(() => import("@components/utils/RequireAuth"));

// TODO load citations
// TODO envoyer si l'utilisateur est connecté ou non + infos président
function PageWrapper(props) {
    const [citationsArray, setCitationsArray] = useState([]);
    const [citationObject, setCitationObject] = useState({ citation: "", auteurCitation: "" });
    const [president, setPresident] = useState({ nom: "", phone: "" });
    const location = useLocation();

    // Fetch all citations on initial component mount
    useEffect(() => {
        const fetchAllCitations = async () => {
            try {
                const response = await axiosWrapper({
                    url: "api/citations", // Path after REACT_APP_RESTAPI_SERVER_URI
                    method: "get"
                });

                if (response && response.success && response.data && response.data.length > 0) {
                    const allCitations = response.data;
                    setCitationsArray(allCitations);
                    // Set initial random citation only if not already set by header's default or previous state
                    if (citationObject.citation === undefined) {
                        const randomIndex = Math.floor(Math.random() * allCitations.length);
                        setCitationObject(allCitations[randomIndex]);
                    }
                } else {
                    console.warn("No citations fetched or API call was not successful. Response:", response);
                    setCitationsArray([]); // Ensure it's an empty array if fetch fails or no data
                }
            }
            catch (e) {
                console.error("Error in fetchAllCitations calling axiosWrapper:", e);
                setCitationsArray([]); // Ensure it's an empty array on error
            }
        };

        fetchAllCitations();
        getPresident();
    }, [citationObject.citation]); // Depend on citationObject.citation to re-run if it was initially undefined

    // Effect to cycle through citationsArray every 10 seconds
    useEffect(() => {
        if (citationsArray.length === 0) return; // Don't run interval if no citations

        const interval = setInterval(() => {
            if (citationsArray.length > 0) {
                let randomIndex = Math.floor(Math.random() * citationsArray.length);
                // Simple way to try to avoid immediate repeat if more than one citation
                if (citationsArray.length > 1 && citationObject.citation && citationsArray[randomIndex].citation === citationObject.citation) {
                    randomIndex = (randomIndex + 1) % citationsArray.length;
                }
                setCitationObject(citationsArray[randomIndex]);
            }
        }, 10000); // Cycle every 10 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    // Ensure citationObject.citation is part of dependency array if it influences selection logic
    }, [citationsArray, citationObject.citation]);

    // TODO load infos président depuis la liste des fanfarons avec le numéro de téléphone
    const getPresident = async () => {
        try {
            // TODO: Implement president fetching
        }
        catch (e) {
            // console.error("Failed to fetch president info:", e);
        }
    }

    const pageContent = (
        <div id="pageWrapperContainer" className="wrapper">
            <Header
                citation={citationObject.citation}
                auteurCitation={citationObject.auteurCitation}
            />
            <main className={"wrapper-content"}>
                {props.children}
            </main>
            <Footer
                president={president}
                // isConnected and isAdmin will be updated in the next step using useAuth()
                // isConnected={false} 
                // isAdmin={false} 
            />
        </div>
    );

    return (
        <Suspense fallback={<Loading />}>
            {props.privatePage ? (
                <RequireAuth requiredRole={props.requiredRole}>
                    {pageContent}
                </RequireAuth>
            ) : (
                pageContent
            )}
        </Suspense>
    );
}

PageWrapper.propTypes = {
    privatePage: PropTypes.bool,
    requiredRole: PropTypes.string //oneOf["fanfaron", "admin"] - comment indicates previous thought, actual is string
};

export default PageWrapper;
