import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventById } from '../../components/services/eventService';
import CardWeather from '../../components/ui/CardWeather';
import FavButton from '../../components/ui/FavButton';
import { useTranslation } from 'react-i18next';

const CardEventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            const data = await eventById(id);
            setEvent(data);
            setLoading(false);
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="details-loading">
                <div className="spinner"></div>
                <p>Cargando detalles del evento...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="details-error">
                <h2>Evento no encontrado</h2>
                <button onClick={() => navigate('/')} className="back-btn">Volver al buscador</button>
            </div>
        );
    }

    return (
        <div className="event-details-page">
            <button onClick={() => navigate(-1)} className="back-link">
                &larr; Volver
            </button>

            <div className="details-container">
                <div className="details-main">
                    <div className="details-header">
                        <div className="header-info">
                            <span className="event-type-tag">{event.type}</span>
                            <h1>{event.title}</h1>
                            <p className="event-location-full">
                                {event.municipality}, {event.province?.name}
                            </p>
                        </div>
                        <FavButton event={event} />
                    </div>

                    <div className="details-image-container">
                        <img src={event.images} alt={event.title} className="details-image" />
                    </div>

                    <div className="details-content">
                        <section className="details-description">
                            <h3>Sobre este evento</h3>
                            <div dangerouslySetInnerHTML={{ __html: event.description }} />
                        </section>

                        <aside className="details-sidebar">
                            <div className="info-card">
                                <h3>Cuándo y Dónde</h3>
                                <div className="info-item">
                                    <span className="icon">📅</span>
                                    <div>
                                        <p><strong>Fecha:</strong> {event.startDate} - {event.endDate}</p>
                                        <p><strong>Horario:</strong> {event.hour || 'Consultar'}</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <span className="icon">📍</span>
                                    <p>{event.municipality}</p>
                                </div>
                                <div className="info-item">
                                    <span className="icon">🎫</span>
                                    <p><strong>Precio:</strong> {event.price || 'Gratis / Consultar'}</p>
                                </div>
                                
                                {event.purchaseUrl && (
                                    <a href={event.purchaseUrl} target="_blank" rel="noopener noreferrer" className="buy-btn">
                                        Comprar Entradas
                                    </a>
                                )}
                            </div>

                            {/* Integración del Clima en Detalles */}
                            {event.lat && event.lon && (
                                <CardWeather 
                                    lat={event.lat} 
                                    lon={event.lon} 
                                    municipalityName={event.municipality} 
                                />
                            )}
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardEventDetails;
