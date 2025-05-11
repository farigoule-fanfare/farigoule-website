import React, { useState, useEffect } from 'react';
import ContentPageLayout from './layout/ContentPageLayout';
import Slider from 'react-slick';
import { axiosWrapper } from '../api/axiosUtils';

// Import slick carousel CSS
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Import a CSS file for LandingPage specific styles (including carousel captions)
import './LandingPage.css'; 

// Helper to format date (can be moved to a utils file)
const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        // Assuming dateString is YYYY-MM-DD
        const date = new Date(`${dateString}T00:00:00`); // Avoid timezone issues by setting time
        const formatted = date.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString; // Return original string if formatting fails
    }
};

function LandingPage() {
    const [diapos, setDiapos] = useState([]);
    const [upcomingContrats, setUpcomingContrats] = useState([]);
    const [pastContrats, setPastContrats] = useState([]);
    const [loading, setLoading] = useState({ diapos: true, contrats: true });
    const [error, setError] = useState({ diapos: null, contrats: null });

    // Fetch Diapos
    useEffect(() => {
        const fetchDiapos = async () => {
            try {
                setLoading(prev => ({ ...prev, diapos: true }));
                setError(prev => ({ ...prev, diapos: null }));
                const response = await axiosWrapper({ method: 'get', url: 'api/diapos' });
                if (response.success && response.data) {
                    setDiapos(response.data);
                } else {
                    throw new Error(response.message || 'Failed to fetch diapos');
                }
            } catch (err) {
                console.error("LandingPage Error fetching diapos:", err);
                setError(prev => ({ ...prev, diapos: err.message }));
            } finally {
                setLoading(prev => ({ ...prev, diapos: false }));
            }
        };
        fetchDiapos();
    }, []);

    // Fetch Contrats
    useEffect(() => {
        const fetchContrats = async () => {
            try {
                setLoading(prev => ({ ...prev, contrats: true }));
                setError(prev => ({ ...prev, contrats: null }));
                
                const [upcomingRes, pastRes] = await Promise.all([
                    axiosWrapper({ method: 'get', url: 'api/contrats/upcoming' }),
                    axiosWrapper({ method: 'get', url: 'api/contrats/past' }) // Default limit is 3
                ]);

                if (upcomingRes.success && upcomingRes.data) {
                    setUpcomingContrats(upcomingRes.data);
                } else {
                    console.error("Failed to fetch upcoming contrats:", upcomingRes.message);
                    setError(prev => ({ ...prev, contrats: (prev.contrats ? prev.contrats + "; " : "") + "Upcoming fetch failed" }));
                }
                
                if (pastRes.success && pastRes.data) {
                    setPastContrats(pastRes.data);
                } else {
                     console.error("Failed to fetch past contrats:", pastRes.message);
                     setError(prev => ({ ...prev, contrats: (prev.contrats ? prev.contrats + "; " : "") + "Past fetch failed" }));
                }

            } catch (err) {
                console.error("LandingPage Error fetching contrats:", err);
                 setError(prev => ({ ...prev, contrats: err.message }));
            } finally {
                 setLoading(prev => ({ ...prev, contrats: false }));
            }
        };
        fetchContrats();
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        adaptiveHeight: true
    };

    return (
        <ContentPageLayout title="Où avez-vous vu nos danseurs moldaves ?">
            <div className="landing-page-content">
                <section className="blocCarousel">
                    {loading.diapos && <p>Chargement du carousel...</p>}
                    {error.diapos && <p className="error-message">Erreur carousel: {error.diapos}</p>}
                    {!loading.diapos && !error.diapos && (
                        diapos.length > 0 ? (
                            <Slider {...sliderSettings}>
                                {diapos.map(item => (
                                    <div key={item.id} className="carousel-slide">
                                        {/* Use item.imageUrl which includes the full path */}
                                        <img src={item.imageUrl} alt={item.description} style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}/>
                                        {item.description && <p className="carousel-caption">{item.description}</p>}
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <p>Aucune image à afficher dans le carousel.</p>
                        )
                    )}
                </section>

                <section className="blocDates">
                    <h2>Nos prochaines dates</h2>
                    {loading.contrats && <p>Chargement des dates...</p>}
                    {error.contrats && <p className="error-message">Erreur dates: {error.contrats}</p>}
                    {!loading.contrats && !error.contrats && (
                        upcomingContrats.length > 0 ? (
                            upcomingContrats.map(contrat => (
                                <p key={contrat.id}>
                                    <span className="date">{formatDate(contrat.date)}</span><br />
                                    {contrat.lieu}
                                    {contrat.description && <><br /><span className="description">{contrat.description}</span></>}
                                </p>
                            ))
                        ) : (
                            <p>Aucune date à venir pour le moment.</p>
                        )
                    )}
                    
                    <h2>Et avant ?</h2>
                    {!loading.contrats && !error.contrats && (
                         pastContrats.length > 0 ? (
                            pastContrats.map(contrat => (
                                <p key={contrat.id}>
                                    <span className="date">{formatDate(contrat.date)}</span><br />
                                    {contrat.lieu}
                                    {contrat.description && <><br /><span className="description">{contrat.description}</span></>}
                                </p>
                            ))
                        ) : (
                            <p>Aucune date passée récente.</p>
                        )
                    )}
                </section>
            </div>
        </ContentPageLayout>
    );
}

export default LandingPage;