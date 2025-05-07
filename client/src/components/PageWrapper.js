// Copyright © FINANCE SECURITY GmbH - All rights reserved.
import React, { useEffect, useState, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

import Loading from "@components/utils/Loading";

const Header = lazy(() => import("@components/Header"));
const Footer = lazy(() => import("@components/Footer"));
const RequireAuth = lazy(() => import("@components/utils/RequireAuth"));

// TODO load citations
// TODO envoyer si l'utilisateur est connecté ou non + infos président
function PageWrapper(props) {
    const [citationsArray, setCitationsArray] = useState([]);
    const [citationObject, setCitationObject] = useState({ citation: undefined, auteurCitation: undefined });
    const [president, setPresident] = useState({ nom: "", phone: "" });
    const location = useLocation();

    // Fetch all citations on initial component mount
    useEffect(() => {
        const fetchAllCitations = async () => {
            try {
                // TODO: Replace with actual API call to fetch all citations
                // const response = await fetch('/api/citations'); // Example API endpoint
                // if (!response.ok) {
                //     throw new Error(`HTTP error! status: ${response.status}`);
                // }
                // const allCitations = await response.json(); 

                // MOCK DATA for now until API is ready:
                const allCitations = [
                    { citation: "La musique est la langue des émotions.", auteurCitation: "Emmanuel Kant" },
                    { citation: "Sans la musique, la vie serait une erreur.", auteurCitation: "Friedrich Nietzsche" },
                    { citation: "On ne vend pas la musique, on la partage.", auteurCitation: "Leonard Bernstein" }
                ];

                if (allCitations && allCitations.length > 0) {
                    setCitationsArray(allCitations);
                    setCitationObject(allCitations[0]); // Set the first one initially
                }
            }
            catch (e) {
                console.error("Failed to fetch citations:", e);
            }
        };

        fetchAllCitations();
        getPresident(); // Assuming this is another async fetch
    }, []);

    // Effect to cycle through citationsArray every 10 seconds
    useEffect(() => {
        if (citationsArray.length === 0) return; // Don't run interval if no citations

        const interval = setInterval(() => {
            if (citationsArray.length > 0) {
                let randomIndex = Math.floor(Math.random() * citationsArray.length);
                // If there's more than one citation, try to ensure the new one is different from the current one.
                // This is a simple attempt; for a very small number of items, it might occasionally pick the same one if the first random pick is the current one.
                if (citationsArray.length > 1 && citationsArray[randomIndex].citation === citationObject.citation) {
                    randomIndex = (randomIndex + 1) % citationsArray.length; // Pick the next one as a simple way to change it
                }
                setCitationObject(citationsArray[randomIndex]);
            }
        }, 10000); // Cycle every 10 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [citationsArray, citationObject.citation]); // Add citationObject.citation to dependency to help with the non-repeat logic

    // TODO load infos président depuis la liste des fanfarons avec le numéro de téléphone
    const getPresident = async () => {
        try {
            // setPresident()
        }
        catch (e) {
            // console.error("Failed to fetch president info:", e);
        }
    }

    return (
        <Suspense fallback={<Loading />}>
            <RequireAuth
                key={location.key}
                privatePage={props.privatePage}
                requiredRole={props.requiredRole}
            >
                {/* Main content */}
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
                        isConnected={false} // TODO: This needs to be dynamic
                        isAdmin={false} // TODO: This needs to be dynamic (e.g., from user context)
                    />
                </div>
            </RequireAuth>
        </Suspense>
    );
}

PageWrapper.propTypes = {
    privatePage: PropTypes.bool,
    requiredRole: PropTypes.array //oneOf["fanfaron", "admin"]
};

export default PageWrapper;
