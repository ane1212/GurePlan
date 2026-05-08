import React, { useState, useEffect } from "react";
import {
  getLocalWeather,
  getWeatherDescription,
  WEATHER_ICONS,
} from "../services/weatherService";

/**
 * Componente CardWeather
 */
const CardWeather = ({ lat, lon, municipalityName, onWeatherLoad }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    // Console log para ver qué coordenadas recibe (el usuario puede verlo en F12)
    console.log(`[CardWeather] Solicitando clima para: ${municipalityName} (${lat}, ${lon})`);

    const fetchData = async (targetLat, targetLon) => {
      try {
        setLoading(true);
        // Añadimos un timestamp a la petición interna si fuera necesario, 
        // pero getLocalWeather ya hace un fetch.
        const data = await getLocalWeather(targetLat, targetLon);

        if (data) {
          setWeather(data);
          const { icon } = getWeatherDescription(data.weathercode);
          if (onWeatherLoad) onWeatherLoad(icon);
          setError(false);
          setLastUpdated(new Date().toLocaleTimeString());
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

    if (lat !== undefined && lon !== undefined) {
      fetchData(lat, lon);
    }
  }, [lat, lon, municipalityName]); // Sensible a cambios en nombre y coordenadas

  if (loading)
    return <div className="card-weather loading">Actualizando clima...</div>;
  if (error || !weather)
    return <div className="card-weather error">Clima no disponible</div>;

  const { text, icon } = getWeatherDescription(weather.weathercode);

  return (
    <div className={`card-weather ${icon}`}>
      <div className="weather-info">
        <div className="weather-header" style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
            Clima en {municipalityName || 'Euskadi'}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            className="weather-icon"
            dangerouslySetInnerHTML={{ __html: WEATHER_ICONS[icon] }}
          />
          <h3>{text}</h3>
        </div>

        <div className="weather-stats">
          <p>
            <strong>Temp:</strong> {Math.round(weather.temp)}°C
          </p>
          <p>
            <strong>Viento:</strong> {weather.windspeed} km/h
          </p>
        </div>
        
        <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
            <small style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Actualizado: {lastUpdated}
            </small>
        </div>
      </div>
    </div>
  );
};

export default CardWeather;
