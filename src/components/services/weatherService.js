/**
 * @file weatherService.js
 * Lógica de negocio y peticiones a la API de Open-Meteo.
 */

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Diccionario de iconos SVG.
 */
export const WEATHER_ICONS = {
    sun: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
    cloud_sun: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M17.66 6.34l1.41-1.41"/><path d="M13 16a5 5 0 1 0-9.9-1H3a3 3 0 0 0 0 6h10a3 3 0 0 0 0-6z"/></svg>`,
    cloud: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
    fog: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M2 12h20M2 16h20M2 20h20"/></svg>`,
    drizzle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M8 19v2M8 13v2M12 21v2M12 15v2M16 19v2M16 13v2"/></svg>`,
    rain: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M11 13v8M8 16v4M14 16v4"/></svg>`,
    snow: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M8 15h.01M12 15h.01M16 15h.01M10 19h.01M14 19h.01"/></svg>`,
    storm: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M13 12l-3 7h5l-3 7"/></svg>`,
};

/**
 * Mapea el código de Open-Meteo a descripción e icono.
 * @param {number} code - Código WMO.
 * @returns {{text: string, icon: string}}
 */
export function getWeatherDescription(code) {
    if (code === 0) return { text: "Despejado", icon: "sun" };
    if (code <= 3) return { text: "Nublado", icon: "cloud_sun" };
    if (code >= 45 && code <= 48) return { text: "Niebla", icon: "fog" };
    if (code >= 51 && code <= 57) return { text: "Llovizna", icon: "drizzle" };
    if (code >= 61 && code <= 67) return { text: "Lluvia", icon: "rain" };
    if (code >= 71 && code <= 77) return { text: "Nieve", icon: "snow" };
    if (code >= 80 && code <= 82) return { text: "Chubascos", icon: "rain" };
    if (code >= 95) return { text: "Tormenta", icon: "storm" };
    return { text: "Variable", icon: "cloud" };
}

/**
 * Obtiene el clima local por coordenadas.
 */
export const getLocalWeather = async (lat, lon) => {
    try {
        const url = `${BASE_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto&_=${new Date().getTime()}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la petición');

        const data = await response.json();
        const { temperature, windspeed, weathercode, time } = data.current_weather;

        return { temp: temperature, windspeed, weathercode, time };
    } catch (error) {
        console.error("Error en weatherService:", error);
        return null;
    }
};

export const isBadWeather = (code) => {
    return code >= 51;
};