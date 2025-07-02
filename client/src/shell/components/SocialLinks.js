import React, { useState } from 'react';
import './SocialLinks.css'; // We'll create this CSS file next

// Import social media button images (normal and hover states)
import facebookIcon from '@assets/images/boutons/bouton-facebook.png';
import facebookIconHover from '@assets/images/boutons/bouton-facebook-hover.png';
import youtubeIcon from '@assets/images/boutons/bouton-youtube.png';
import youtubeIconHover from '@assets/images/boutons/bouton-youtube-hover.png';
// import instagramIcon from '@assets/images/boutons/bouton-instagram.png';
import instagramIcon from '@assets/images/boutons/bouton-instagram.png';
import instagramIconHover from '@assets/images/boutons/bouton-instagram-hover.png';

// Define a type or key for managing hover states if not using individual states
const SOCIAL_KEYS = {
  FACEBOOK: 'facebook',
  YOUTUBE: 'youtube',
  INSTAGRAM: 'instagram',
};

const socialLinksData = [
    {
        key: SOCIAL_KEYS.FACEBOOK,
        href: "https://www.facebook.com/FanfareLaFarigoule",
        alt: "Facebook La Farigoule",
        iconSrc: facebookIcon,
        iconHoverSrc: facebookIconHover,
        className: "social-icon-facebook"
    },
    // Twitter Removed
    // {
    //     href: "https://twitter.com/lafarigoule",
    //     alt: "Twitter La Farigoule",
    //     iconSrc: twitterIcon,
    //     className: "social-icon-twitter"
    // },
    {
        key: SOCIAL_KEYS.YOUTUBE,
        href: "http://www.youtube.com/@la_farigoule_fanfare",
        alt: "YouTube La Farigoule",
        iconSrc: youtubeIcon,
        iconHoverSrc: youtubeIconHover,
        className: "social-icon-youtube"
    },
    {
        key: SOCIAL_KEYS.INSTAGRAM,
        href: "https://www.instagram.com/la_farigoule_fanfare/",
        alt: "Instagram La Farigoule",
        iconSrc: instagramIcon,
        iconHoverSrc: instagramIconHover,
        className: "social-icon-instagram"
    }
];

function SocialLinks() {
    // Use a single state object to manage hover states for all icons
    const [hoveredStates, setHoveredStates] = useState({
        [SOCIAL_KEYS.FACEBOOK]: false,
        [SOCIAL_KEYS.YOUTUBE]: false,
        [SOCIAL_KEYS.INSTAGRAM]: false,
    });

    const handleMouseEnter = (key) => {
        setHoveredStates(prev => ({ ...prev, [key]: true }));
    };

    const handleMouseLeave = (key) => {
        setHoveredStates(prev => ({ ...prev, [key]: false }));
    };

    return (
        <div className="social-links-container">
            {socialLinksData.map(link => (
                <a 
                    key={link.key} // Use the defined key
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`social-link ${link.className}`}
                    aria-label={link.alt}
                    onMouseEnter={() => handleMouseEnter(link.key)}
                    onMouseLeave={() => handleMouseLeave(link.key)}
                >
                    <img 
                        src={hoveredStates[link.key] ? link.iconHoverSrc : link.iconSrc} 
                        alt={link.alt} 
                        className="social-icon-img" 
                    />
                </a>
            ))}
        </div>
    );
}

export default SocialLinks; 