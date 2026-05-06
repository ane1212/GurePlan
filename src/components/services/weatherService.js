const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export const getLocalWeather = async (lat, lon) => {
  try {
    // Pedimos explícitamente temperatura, código de estado y velocidad del viento
    const url = `${BASE_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error en la petición');
    
    const data = await response.json();
    
    return {
      temp: data.current_weather.temperature,
      windspeed: data.current_weather.windspeed, // Velocidad del viento
      weathercode: data.current_weather.weathercode, // Estado
      time: data.current_weather.time // Hora local del reporte
    };
  } catch (error) {
    console.error("Error en weatherService:", error);
    return null;
  }
};