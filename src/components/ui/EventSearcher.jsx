/**
 * @file EventSearcher.jsx
 * @description Componente principal para la búsqueda y filtrado de eventos culturales en Euskadi.
 */

import { useState, useEffect, useRef } from "react";
import { events, municipalities, eventTypes } from "../../services/eventService";
import CardEvent from '../ui/CardEvent';
import CardWeather from './CardWeather';

/** @constant {number} Latitud por defecto (Bilbao) */
const DEFAULT_LAT = 43.2627;
/** @constant {number} Longitud por defecto (Bilbao) */
const DEFAULT_LON = -2.9253;

/**
 * Componente EventSearcher
 * @component
 * @description Gestiona la interfaz de búsqueda, incluyendo filtros de municipio, tipo, fecha e idioma.
 * También coordina la actualización de la información meteorológica basada en la selección del usuario.
 */
function EventSearcher() {
  const [municipalityList, setMunicipalityList] = useState([]);
  const [typeList, setTypeList] = useState([]);

  const [selectedMunicipality, setSelectedMunicipality] = useState("todos");
  const [selectedType, setSelectedType] = useState("todos");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [eventList, setEventList] = useState([]);
  const [currentCoords, setCurrentCoords] = useState({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
  const [loading, setLoading] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const municipalityCoords = useRef(new Map());

  // Nombre del municipio para mostrar en el CardWeather
  const selectedMunicipalityName = municipalityList.find(
    (m) => String(m.id) === selectedMunicipality
  )?.name || "Euskadi";

  /**
   * Maneja el cambio de selección de idiomas.
   * @param {string} langCode - Código del idioma (ES, EU, EN).
   */
  function handleLanguageChange(langCode) {
    setSelectedLanguages((prev) =>
      prev.includes(langCode)
        ? prev.filter((l) => l !== langCode)
        : [...prev, langCode],
    );
  }

  // 1. Carga inicial de municipios y tipos
  useEffect(() => {
    /**
     * Inicializa los datos de los selectores de búsqueda.
     * @async
     */
    async function init() {
      try {
        const allMunicipalities = await municipalities();
        setMunicipalityList(allMunicipalities);

        const allTypes = await eventTypes();
        setTypeList(allTypes);
      } catch (error) {
        console.error("Error en init:", error);
      }
    }
    init();
  }, []);

  // 2. Efecto de filtrado y actualización de clima
  useEffect(() => {
    /**
     * Aplica los filtros seleccionados y recupera los eventos de la API.
     * También gestiona el posicionamiento geográfico para el componente del clima.
     * @async
     */
    async function applyFilters() {
      const municipalityId = selectedMunicipality !== "todos" ? selectedMunicipality : null;

      // ACTUALIZACIÓN DEL CLIMA
      if (municipalityId === "todos") {
        setCurrentCoords({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
      }

      // CARGA DE EVENTOS
      setLoading(true);
      try {
        let day = null, month = null, year = null;
        if (selectedDate) {
          const [y, m, d] = selectedDate.split("-");
          day = parseInt(d); month = parseInt(m); year = parseInt(y);
        }

        const type = selectedType !== "todos" ? selectedType : null;

        const results = await events({
          elements: 30,
          page: 1,
          day,
          month,
          municipalityId: municipalityId === "todos" ? null : municipalityId,
          type,
          year,
        });

        let filteredResults = results;
        if (selectedLanguages.length > 0) {
          filteredResults = results.filter(
            (e) => e.language && selectedLanguages.includes(e.language.toUpperCase()),
          );
        }
        setEventList(filteredResults);

        // Si hemos encontrado eventos y el municipio no tenía coordenadas, las extraemos del primer evento
        if (filteredResults.length > 0 && municipalityId && municipalityId !== "todos") {
          const firstEvent = filteredResults[0];
          if (firstEvent.lat && firstEvent.lon) {
            setCurrentCoords({ lat: firstEvent.lat, lon: firstEvent.lon });
          }
        } else if (municipalityId && municipalityId !== "todos") {
          // FALLBACK: Si no hay eventos, buscamos las coordenadas por el nombre del municipio
          try {
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(selectedMunicipalityName)}&count=1&language=es&format=json`);
            const geoData = await geoRes.json();
            if (geoData.results && geoData.results.length > 0) {
              const { latitude, longitude } = geoData.results[0];
              setCurrentCoords({ lat: latitude, lon: longitude });
            }
          } catch (err) {
            console.error("Error en geocoding fallback:", err);
          }
        } else if (municipalityId === "todos") {
          setCurrentCoords({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
        }
      } catch (error) {
        console.error("Error cargando eventos:", error);
      } finally {
        setLoading(false);
      }
    }

    applyFilters();
  }, [selectedMunicipality, selectedType, selectedDate, selectedLanguages, municipalityList]);

  return (
    <section className="event-searcher-container">
      <div className="searcher-main">
        <aside className="filters-sidebar">
          <div className="filter-group">
            <label>Municipio</label>
            <select
              value={selectedMunicipality}
              onChange={(e) => setSelectedMunicipality(e.target.value)}
              className="custom-select"
            >
              <option value="todos">Todos los municipios</option>
              {municipalityList.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Tipo de Evento</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="custom-select"
            >
              <option value="todos">Cualquier tipo</option>
              {typeList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Fecha</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="custom-input-date"
            />
          </div>

          <div className="filter-group">
            <label>Idiomas</label>
            <div className="language-options">
              {[
                { code: "ES", label: "Español" },
                { code: "EU", label: "Euskera" },
                { code: "EN", label: "Inglés" },
              ].map(({ code, label }) => (
                <label key={code} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(code)}
                    onChange={() => handleLanguageChange(code)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <main className="results-content">
          <div className="weather-container-top" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <CardWeather
              key={`${currentCoords.lat}-${currentCoords.lon}-${selectedMunicipality}`}
              lat={currentCoords.lat}
              lon={currentCoords.lon}
              municipalityName={selectedMunicipalityName}
            />
          </div>

          <div className="events-grid">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Buscando experiencias...</p>
              </div>
            ) : eventList.length === 0 ? (
              <div className="empty-state">
                <p>No se han encontrado eventos para estos filtros.</p>
              </div>
            ) : (
              eventList.map((event) => (
                <CardEvent key={event.id} event={event} />
              ))
            )}
          </div>
        </main>
      </div>
    </section>
  );
}

export default EventSearcher;