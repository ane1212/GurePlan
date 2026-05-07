import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FavButton from './FavButton';

export default function CardEvent({ event, onAuthRequired }) {
    const navigate = useNavigate();

    return (
        <article className="card" onClick={() => navigate(`/event/${event.id}`)} style={{ cursor: 'pointer' }}>
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