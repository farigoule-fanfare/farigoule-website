import React, { lazy, Suspense } from "react";
import PropTypes from "prop-types";

import Loading from "@components/common/Loading";

const Header = lazy(() => import("@components/common/Header"));
const Footer = lazy(() => import("@components/common/Footer"));
const RequireAuth = lazy(() => import("@components/common/RequireAuth"));

/**
 * PageWrapper : enveloppe générique d’une page
 * ─ Structure : Header / Main / Footer
 * ─ Code-splitting : Header, Footer, RequireAuth chargés paresseusement
 * ─ Option « privatePage » : encapsule le contenu dans <RequireAuth>
 *   avec « requiredRole » si nécessaire.
 * NB : Le Header et le Footer gèrent désormais eux-mêmes leurs données
 *      (citations, président, etc.). Le wrapper reste purement structurel.
 */
function PageWrapper({ children, privatePage = false, requiredRole }) {
  const Content = (
    <div id="pageWrapperContainer" className="wrapper">
      <Header />

      <main className="wrapper-content">{children}</main>

      <Footer />
    </div>
  );

  return (
    <Suspense fallback={<Loading />}> 
      {privatePage ? (
        <RequireAuth requiredRole={requiredRole}>{Content}</RequireAuth>
      ) : (
        Content
      )}
    </Suspense>
  );
}

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  privatePage: PropTypes.bool,
  requiredRole: PropTypes.string,
};

export default PageWrapper;
