// Copyright © FINANCE SECURITY GmbH - All rights reserved.
import React, { useEffect, useState, lazy, Suspense } from "react";
import PropTypes from "prop-types";

import Loading from "@components/utils/Loading";
import {axiosWrapper} from '@api/axiosUtils';

const Header = lazy(() => import("@components/Header"));
const Footer = lazy(() => import("@components/Footer"));
const RequireAuth = lazy(() => import("@components/utils/RequireAuth"));

// TODO envoyer si l'utilisateur est connecté ou non + 
// TODO infos président
function PageWrapper(props) {
    const [citationsArray, setCitationsArray] = useState([]);
    const [citationObject, setCitationObject] = useState({ citation: "", auteurCitation: "" });
    const [president] = useState({ nom: "", phone: "" });

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
                    // Immediately set a random citation from the fetched array
                    const randomIndex = Math.floor(Math.random() * allCitations.length);
                    setCitationObject(allCitations[randomIndex]); 
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
        getPresident(); // Assuming this is intended to run on mount too
    }, []); // Empty dependency array: runs only once on mount

    // Effect to cycle through citationsArray every 10 seconds
    useEffect(() => {
        if (citationsArray.length === 0) return; // Don't run interval if no citations

        const interval = setInterval(() => {
            let randomIndex = Math.floor(Math.random() * citationsArray.length);
            // Simple way to try to avoid immediate repeat if more than one citation
            // Ensure citationObject.citation is not undefined before comparing
            if (citationObject.citation !== undefined && citationsArray[randomIndex].citation === citationObject.citation) {
                randomIndex = (randomIndex + 1) % citationsArray.length;
            }
            setCitationObject(citationsArray[randomIndex]);
        }, 10000); // Cycle every 10 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [citationsArray, citationObject.citation]); // Dependencies for re-evaluating cycle logic

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
