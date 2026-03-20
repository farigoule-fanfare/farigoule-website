import React, { lazy, Suspense } from "react";
import PropTypes from "prop-types";

import Loading from "../components/Loading";

const Header = lazy(() => import("../components/Header"));
const Footer = lazy(() => import("../components/Footer"));


function PageWrapper({ children }) {
  const Content = (
    <div id="pageWrapperContainer" className="wrapper">
      <Header />

      <main className="wrapper-content">{children}</main>

      <Footer />
    </div>
  );
  return <Suspense fallback={<Loading />}>{Content}</Suspense>;
}

PageWrapper.propTypes = { children: PropTypes.node.isRequired };
export default PageWrapper;
