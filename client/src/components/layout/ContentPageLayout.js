import React from 'react';
import PropTypes from 'prop-types';
import SocialLinks from '../utils/SocialLinks'; // Assuming SocialLinks is in utils
import './ContentPageLayout.css'; // We'll create this CSS file next

function ContentPageLayout({ title, children }) {
    return (
        <div className="content-page-layout">
            <div className="content-page-header">
                {title && <h1 className="content-page-title">{title}</h1>}
                <SocialLinks />
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