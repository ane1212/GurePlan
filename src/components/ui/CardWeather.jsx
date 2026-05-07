import React, { useState, useEffect } from 'react';
import { getLocalWeather, getWeatherDescription, WEATHER_ICONS } from '../services/weatherService';

/**
 * Componente CardWeather
 * Muestra la información climática obtenida a través de weatherService.
 * 
 * @param {Object} props
 * @param {Function} props.onWeatherLoad - Callback para enviar la clase del clima (icon) al padre.
 */
const CardWeather = ({ onWeatherLoad }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        /**
         * Llama al servicio para obtener los datos climáticos procesados.
         */
        const fetchData = async (lat, lon) => {
            try {
                setLoading(true);
                const data = await getLocalWeather(lat, lon);

                if (data) {
                    setWeather(data);
                    const { icon } = getWeatherDescription(data.weathercode);

                    if (onWeatherLoad) onWeatherLoad(icon);
                    setError(false);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Error cargando datos del clima:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchData(pos.coords.latitude, pos.coords.longitude),
                () => fetchData(43.2627, -2.9253)
            );
        } else {
            fetchData(43.2627, -2.9253);
        }
    }, [onWeatherLoad]);

    if (loading) return <div className="card-weather loading">Cargando clima...</div>;
    if (error || !weather) return <div className="card-weather error">Clima no disponible</div>;


    const { text, icon } = getWeatherDescription(weather.weathercode);

    return (
        <div className={`card-weather ${icon}`}>
            <div className="weather-info">
                <div
                    className="weather-icon"
                    dangerouslySetInnerHTML={{ __html: WEATHER_ICONS[icon] }}
                />

                <h3>{text}</h3>

                <div className="weather-stats">
                    <p><strong>Temp:</strong> {Math.round(weather.temp)}°C</p>
                    <p><strong>Viento:</strong> {weather.windspeed} km/h</p>
                    <p>
                        <small>Hora: {weather.time ? weather.time.split('T')[1] : '--:--'}</small>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CardWeather;