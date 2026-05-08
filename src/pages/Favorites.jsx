import React, { useState, useEffect } from 'react';
import { getFavorites } from '../components/services/localStorageService';
import CardEvent from '../components/ui/CardEvent';

const Favorites = () => {
    const [favs, setFavs] = useState([]);

    useEffect(() => {
        setFavs(getFavorites());
    }, []);

    return (
        <div className="favorites-container">
            <header className="page-header">
                <h1>Mis Favoritos</h1>
                <p>Eventos que has guardado para ver más tarde</p>
            </header>

            {favs.length === 0 ? (
                <div className="empty-state">
                    <p>Aún no tienes eventos favoritos. ¡Explora el buscador y añade algunos!</p>
                </div>
            ) : (
                <div className="events-grid">
                    {favs.map(event => (
                        <CardEvent key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
