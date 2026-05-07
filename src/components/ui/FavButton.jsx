import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isFavorite, toggleFavorites } from '../services/localStorageService';


export default function FavButton({ event, onAuthRequired }) {
    const navigate = useNavigate();
    const [faved, setFaved] = useState(() => isFavorite(event.id));
    const [bumping, setBumping] = useState(false);

    function handleClick(e) {
        e.stopPropagation();

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            onAuthRequired ? onAuthRequired() : navigate('/login');
            return;
        }

        const result = toggleFavorites(event);
        if (result.success) setFaved(result.isFavorite);

        setBumping(true);
        setTimeout(() => setBumping(false), 100);
    }

    return (
        <button
            className={`icon-fav ${faved ? 'active' : ''}`}
            onClick={handleClick}
            aria-label={faved ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            style={{ transform: bumping ? 'scale(0.9)' : 'scale(1)', transition: 'transform 0.1s' }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
        </button>
    );
}