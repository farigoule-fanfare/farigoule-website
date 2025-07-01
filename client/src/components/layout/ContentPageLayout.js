import React from 'react';
import PropTypes from 'prop-types';
import SocialLinks from '@components/common/SocialLinks';
import './ContentPageLayout.css'; // We'll create this CSS file next

function ContentPageLayout({ title, children, hideSocialLinks = false, }) {
    return (
        <div className="content-page-layout">
            <div className="content-page-header">
                {title && <h1 className="content-page-title">{title}</h1>}
                <div className="content-page-social">
                  { !hideSocialLinks && <SocialLinks /> }
               </div>
            </div>
            <div className="content-page-main">
                {children}
            </div>
        </div>
    );
}

ContentPageLayout.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default ContentPageLayout; 