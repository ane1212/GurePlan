/**
 * @file CardEvent.jsx
 * @description Componente de tarjeta para visualizar un resumen de un evento cultural.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FavButton from './FavButton';

/**
 * Componente CardEvent
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {import('../../models/EventModels').APIEvent} props.event - Objeto evento a mostrar.
 * @param {Function} [props.onAuthRequired] - Callback opcional cuando se requiere autenticación para marcar favoritos.
 * @returns {JSX.Element} Renderiza la tarjeta del evento.
 */
export default function CardEvent({ event, onAuthRequired }) {
    const navigate = useNavigate();

    /**
     * Navega a la página de detalles del evento.
     * @private
     */
    const handleNavigate = () => {
        navigate(`/event/${event.id}`);
    };

    return (
        <article className="card" onClick={handleNavigate} style={{ cursor: 'pointer' }}>
            <div className="card-header">
                <img src={event.images} className="card-img" alt={event.title} />

                <FavButton event={event} onAuthRequired={onAuthRequired} />

                <div className="type-badge">
                    <span>{event.type || 'Evento'}</span>
                </div>
            </div>

            <div className="card-content">
                <div className="content-top">
                    <h2 className="card-title">{event.title}</h2>
                    <p className="card-location">{event.municipality} — {event.province?.name}</p>
                    <p className="card-date">{event.startDate} - {event.endDate}</p>
                </div>
            </div>
        </article>
    );
}