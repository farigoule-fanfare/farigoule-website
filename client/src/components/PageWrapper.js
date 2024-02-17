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
    const [citationsArray, setCitationsArray] = useState([])
    const [citationObject, setCitationObject] = useState({ index: 0, citation: "", auteurCitation: "" })
    const location = useLocation()

    // TODO load citations from server
    // TODO load infos président depuis la liste des fanfarons avec le numéro de téléphone
    useEffect(() => {

    })

    // Toutes les x secondes change la citation active en lisant dans l'array des citations
    useEffect(() => {
        const interval = setInterval(() => {
            if (citationsArray.length > 0) {
                const newIndex = citationObject.index + 1 >= citationsArray.length ? 0 : citationObject.index + 1
                setCitationObject(citationsArray[newIndex])
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [citationsArray])

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
                        president={{}}
                        isConnected={false}
                    />
                </div>
            </RequireAuth>
        </Suspense>
    );
}

PageWrapper.propTypes = {
    privatePage: PropTypes.bool,
    requiredRole: PropTypes.array
};

PageWrapper.defaultProps = {
    privatePage: true,
    requiredRole: ["fanfaron"], //oneOf["fanfaron", "admin"]
};

export default PageWrapper;
