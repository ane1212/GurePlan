import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventById } from '../services/eventService';
import FavButton from '../components/ui/FavButton';

const CardEventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEvent() {
            setLoading(true);
            const data = await eventById(id);
            if (data) {
                setEvent(data);
            }
            setLoading(false);
        }
        loadEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Cargando detalles del evento...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="empty-state">
                <p>No se pudo encontrar el evento solicitado.</p>
                <button onClick={() => navigate('/')} className="btn-auth">Volver al inicio</button>
            </div>
        );
    }

    return (
        <div className="event-details-container">
            <div className="details-hero">
                <img src={event.images} alt={event.title} />
                <FavButton event={event} />
            </div>

            <div className="details-content">
                <div className="details-header">
                    <div>
                        <span className="type-badge" style={{ position: 'static', marginBottom: '1rem', display: 'inline-block' }}>
                            {event.type}
                        </span>
                        <h1>{event.title}</h1>
                    </div>
                    {event.price && (
                        <div className="price-tag" style={{ fontSize: '1.5rem', fontWeight: '700', color: '#6366f1' }}>
                            {event.price}
                        </div>
                    )}
                </div>

                <div className="details-info-grid">
                    <div className="info-item">
                        <h4>Fecha</h4>
                        <p>{event.startDate} - {event.endDate}</p>
                    </div>
                    <div className="info-item">
                        <h4>Ubicación</h4>
                        <p>{event.municipality} ({event.province?.name})</p>
                    </div>
                    <div className="info-item">
                        <h4>Horario</h4>
                        <p>{event.hour || 'Consultar disponibilidad'}</p>
                    </div>
                </div>

                <div className="details-description">
                    <h3>Sobre este evento</h3>
                    <div dangerouslySetInnerHTML={{ __html: event.description }} />
                </div>

                {event.purchaseUrl && (
                    <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                        <a
                            href={event.purchaseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-auth"
                            style={{ display: 'inline-block', textDecoration: 'none' }}
                        >
                            Comprar Entradas / Ver más
                        </a>
                    </div>
                )}

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button onClick={() => navigate(-1)} className="btn-auth" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>
                        &larr; Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardEventDetails;
