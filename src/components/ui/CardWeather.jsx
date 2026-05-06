import React, { useState, useEffect } from 'react';
import { getLocalWeather } from '../services/weatherService';

const CardWeather = ({ onWeatherLoad }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const translateWeather = (code) => {
    if (code === 0) return { label: 'Despejado', icon: '☀️', class: 'clear' };
    if (code <= 3) return { label: 'Nublado', icon: '⛅', class: 'clouds' };
    if (code >= 51 && code <= 67) return { label: 'Lloviendo', icon: '🌧️', class: 'rain' };
    if (code >= 71 && code <= 77) return { label: 'Nevando', icon: '❄️', class: 'snow' };
    if (code >= 95) return { label: 'Tormenta', icon: '⛈️', class: 'thunder' };
    return { label: 'Variable', icon: '☁️', class: 'clouds' };
  };

  useEffect(() => {
    const fetchData = async (lat, lon) => {
      try {
        const data = await getLocalWeather(lat, lon);
        if (data) {
          setWeather(data);
          if (onWeatherLoad) onWeatherLoad(translateWeather(data.weathercode).class);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchData(pos.coords.latitude, pos.coords.longitude),
      () => fetchData(43.2627, -2.9253) // Bilbao como fallback
    );
  }, [onWeatherLoad]);

  if (loading) return <div className="card-weather">Cargando...</div>;
  if (!weather) return <div className="card-weather">Clima no disponible</div>;

  const status = translateWeather(weather.weathercode);

  return (
    <div className={`card-weather ${status.class}`}>
      <div className="weather-info">
        <span style={{ fontSize: '2rem' }}>{status.icon}</span>
        <h3>{status.label}</h3>
        <p><strong>Temp:</strong> {Math.round(weather.temp)}°C</p>
        <p><strong>Viento:</strong> {weather.windspeed} km/h</p>
        <p><small>Hora: {weather.time.split('T')[1]}</small></p>
      </div>
    </div>
  );
};

export default CardWeather;