import React, { useState, useEffect } from 'react';
// Importamos las funciones y constantes actualizadas desde tu servicio
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
                // Cambio: Ahora usamos getLocalWeather según tu última actualización
                const data = await getLocalWeather(lat, lon);

                if (data) {
                    setWeather(data);
                    // Obtenemos la configuración del clima (texto e icono)
                    const { icon } = getWeatherDescription(data.weathercode);

                    // Notificamos al componente padre para que pueda cambiar fondos o estilos
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

        // Intentar obtener la ubicación real o usar Bilbao como fallback
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchData(pos.coords.latitude, pos.coords.longitude),
                () => fetchData(43.2627, -2.9253) // Fallback: Bilbao
            );
        } else {
            fetchData(43.2627, -2.9253);
        }
    }, [onWeatherLoad]);

    if (loading) return <div className="card-weather loading">Cargando clima...</div>;
    if (error || !weather) return <div className="card-weather error">Clima no disponible</div>;

    // Obtenemos la traducción y la clave del icono
    const { text, icon } = getWeatherDescription(weather.weathercode);

    return (
        <div className={`card-weather ${icon}`}>
            <div className="weather-info">
                {/* Renderizado seguro del string SVG definido en el servicio */}
                <div
                    className="weather-icon"
                    dangerouslySetInnerHTML={{ __html: WEATHER_ICONS[icon] }}
                />

                <h3>{text}</h3>

                <div className="weather-stats">
                    {/* Cambio: Usamos weather.temp porque así lo mapeaste en el servicio */}
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