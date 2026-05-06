// ---------------------------------------------------------------------------
// Iconos SVG del tiempo
// Sin cambios respecto al original. Son strings estáticos que luego
// CardWeather.jsx renderizará con dangerouslySetInnerHTML, ya que son
// SVGs inline que no cambian nunca.
// ---------------------------------------------------------------------------

const WEATHER_ICONS = {
  sun: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
  cloud_sun: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M17.66 6.34l1.41-1.41"/><path d="M13 16a5 5 0 1 0-9.9-1H3a3 3 0 0 0 0 6h10a3 3 0 0 0 0-6z"/></svg>`,
  cloud: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
  fog: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M2 12h20M2 16h20M2 20h20"/></svg>`,
  drizzle: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M8 19v2M8 13v2M12 21v2M12 15v2M16 19v2M16 13v2"/></svg>`,
  rain: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M11 13v8M8 16v4M14 16v4"/></svg>`,
  snow: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M8 15h.01M12 15h.01M16 15h.01M10 19h.01M14 19h.01"/></svg>`,
  storm: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M13 12l-3 7h5l-3 7"/></svg>`,
};

// ---------------------------------------------------------------------------
// getWeatherDescription
// Sin cambios respecto al original. Recibe un código numérico de la API
// Open-Meteo y devuelve un objeto { text, icon } con la descripción y el
// SVG correspondiente. No toca el DOM.
// ---------------------------------------------------------------------------

export function getWeatherDescription(code) {
  if (code == null) return { text: "Sin datos", icon: WEATHER_ICONS.cloud };
  switch (true) {
    case code === 0:               return { text: "Cielo despejado",        icon: WEATHER_ICONS.sun };
    case code === 1:               return { text: "Mayormente despejado",   icon: WEATHER_ICONS.cloud_sun };
    case code === 2:               return { text: "Parcialmente nublado",   icon: WEATHER_ICONS.cloud_sun };
    case code === 3:               return { text: "Nublado",                icon: WEATHER_ICONS.cloud };
    case code >= 45 && code <= 48: return { text: "Niebla",                 icon: WEATHER_ICONS.fog };
    case code >= 51 && code <= 55: return { text: "Llovizna",               icon: WEATHER_ICONS.drizzle };
    case code >= 56 && code <= 57: return { text: "Llovizna helada",        icon: WEATHER_ICONS.drizzle };
    case code >= 61 && code <= 65: return { text: "Lluvia",                 icon: WEATHER_ICONS.rain };
    case code >= 66 && code <= 67: return { text: "Lluvia helada",          icon: WEATHER_ICONS.rain };
    case code >= 71 && code <= 75: return { text: "Nieve",                  icon: WEATHER_ICONS.snow };
    case code === 77:              return { text: "Aguanieve",               icon: WEATHER_ICONS.snow };
    case code >= 80 && code <= 82: return { text: "Chubascos",              icon: WEATHER_ICONS.rain };
    case code >= 85 && code <= 86: return { text: "Chubascos de nieve",     icon: WEATHER_ICONS.snow };
    case code >= 95 && code <= 99: return { text: "Tormenta",               icon: WEATHER_ICONS.storm };
    default: return { text: `Desconocido (${code})`, icon: WEATHER_ICONS.cloud };
  }
}

// ---------------------------------------------------------------------------
// isBadWeather
// Sin cambios respecto al original. Devuelve true si el código indica
// mal tiempo. EventSearcher la usará para decidir si filtrar por
// eventos de interior.
// ---------------------------------------------------------------------------

export function isBadWeather(code) {
  if (code == null) return false;
  return (
    (code >= 45 && code <= 48) ||
    (code >= 51 && code <= 67) ||
    (code >= 71 && code <= 77) ||
    (code >= 80 && code <= 86) ||
    (code >= 95 && code <= 99)
  );
}

// ---------------------------------------------------------------------------
// fetchWeather
// Aquí está el cambio principal respecto al original.
//
// ANTES: loadWeatherByCoordinates hacía el fetch Y escribía el resultado
// en el DOM con getElementById("weather-info").innerHTML.
//
// AHORA: fetchWeather solo hace el fetch y devuelve los datos procesados.
// No sabe nada de cómo se van a pintar. Esa responsabilidad pasa a
// CardWeather.jsx, que recibirá estos datos como props.
// ---------------------------------------------------------------------------

export async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const weather = data.current_weather;
    const { text, icon } = getWeatherDescription(weather.weathercode);

    // Devuelve un objeto con todo lo que CardWeather.jsx necesita para
    // renderizar, más el weathercode que EventSearcher usa para isBadWeather.
    return {
      temperature: weather.temperature,
      windspeed: weather.windspeed,
      weathercode: weather.weathercode,
      text,
      icon,
    };
  } catch (error) {
    console.error("Error al obtener el clima:", error);
    return null;
  }
}