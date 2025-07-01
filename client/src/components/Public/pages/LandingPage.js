import React, { useState, useEffect } from 'react';
import ContentPageLayout from '../../layout/ContentPageLayout';
import Slider from 'react-slick';
import { axiosWrapper } from '../../../api/axiosUtils';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './LandingPage.css'; 

const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(`${dateString}T00:00:00`);
        const formatted = date.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString;
    }
};

function LandingPage() {
    const [diapos, setDiapos] = useState([]);
    const [upcomingContrats, setUpcomingContrats] = useState([]);
    const [pastContrats, setPastContrats] = useState([]);
    const [loading, setLoading] = useState({ diapos: true, contrats: true });
    const [error, setError] = useState({ diapos: null, contrats: null });

    useEffect(() => {
        const fetchDiapos = async () => {
            try {
                setLoading(prev => ({ ...prev, diapos: true }));
                setError(prev => ({ ...prev, diapos: null }));
                const response = await axiosWrapper({ method: 'get', url: 'api/diapos?limit=6&order=desc' });
                setDiapos(response.data);
            } catch (err) {
                console.error("LandingPage Error fetching diapos:", err);
                setError(prev => ({ ...prev, diapos: err.message }));
            } finally {
                setLoading(prev => ({ ...prev, diapos: false }));
            }
        };
        fetchDiapos();
    }, []);

    useEffect(() => {
        const fetchContrats = async () => {
            try {
                setLoading(prev => ({ ...prev, contrats: true }));
                setError(prev => ({ ...prev, contrats: null }));

                const [upcomingRes, pastRes] = await Promise.all([
                    axiosWrapper({ method: 'get', url: 'api/contrats/upcoming' }),
                    axiosWrapper({ method: 'get', url: 'api/contrats/past' })
                ]);

                setUpcomingContrats(upcomingRes.data);

                const needPast = Math.max(0, 4 - upcomingRes.data.length);
                setPastContrats(pastRes.data.slice(-needPast));

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
            <section className="blocCarousel">
                {loading.diapos && <p>Chargement du carousel...</p>}
                {error.diapos && <p className="error-message">Erreur carousel: {error.diapos}</p>}
                {!loading.diapos && !error.diapos && (
                    diapos.length > 0 ? (
                        <Slider {...sliderSettings}>
                            {diapos.map(item => (
                                <div key={item.id} className="carousel-slide">
                                    <img src={item.imageUrl} alt={item.description} className='carousel-picture'/>
                                    {item.description && <p className="carousel-caption">{item.description}</p>}
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <p>Aucune image à afficher dans le carousel.</p>
                    )
                )}
            </section>

            <section className="blocDatesDeezer">
                <div className="dates-container">
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
                            <p><br />Aucune date à venir pour le moment.</p>
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
                </div>
                <div className="deezer-container">
                    <h2>Notre répertoire</h2>
                    <div className="deezer-embed">
                        <iframe
                            title="deezer-widget"
                            src="https://widget.deezer.com/widget/light/playlist/12284699171"
                            width="100%"
                            height="380"
                            frameBorder="0"
                            allowTransparency="true"
                            allow="encrypted-media; clipboard-write"
                        ></iframe>
                    </div>
                </div>
            </section>
        </ContentPageLayout>
    );
}

export default LandingPage;