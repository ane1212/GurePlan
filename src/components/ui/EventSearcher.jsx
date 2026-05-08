import { useState, useEffect, useRef } from "react";
import { events, municipalities, eventTypes } from "../services/eventService";
import CardEvent from '../ui/CardEvent';
import CardWeather from './CardWeather';

const DEFAULT_LAT = 43.2627;
const DEFAULT_LON = -2.9253; // Bilbao

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

  function handleLanguageChange(langCode) {
    setSelectedLanguages((prev) =>
      prev.includes(langCode)
        ? prev.filter((l) => l !== langCode)
        : [...prev, langCode],
    );
  }

  // 1. Carga inicial de municipios y tipos
  useEffect(() => {
    async function init() {
      try {
        const allMunicipalities = await municipalities();
        allMunicipalities.forEach((m) => {
          if (m.lat && m.lon) {
            municipalityCoords.current.set(String(m.id), {
              lat: m.lat,
              lon: m.lon,
            });
          }
        });
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
    async function applyFilters() {
      const municipalityId = selectedMunicipality !== "todos" ? selectedMunicipality : null;

      // ACTUALIZACIÓN DEL CLIMA
      let coords = { lat: DEFAULT_LAT, lon: DEFAULT_LON };
      if (municipalityId) {
        const cached = municipalityCoords.current.get(municipalityId);
        if (cached) {
          coords = cached;
        } else {
          const found = municipalityList.find(m => String(m.id) === municipalityId);
          if (found && found.lat && found.lon) {
            coords = { lat: found.lat, lon: found.lon };
          }
        }
      }
      setCurrentCoords(coords);

      // CARGA DE EVENTOS
      setLoading(true);

      let day = null, month = null, year = null;
      if (selectedDate) {
        const [y, m, d] = selectedDate.split("-");
        day = parseInt(d); month = parseInt(m); year = parseInt(y);
      }

      const type = selectedType !== "todos" ? selectedType : null;

      try {
        const results = await events({
          elements: 30,
          page: 1,
          day,
          month,
          municipalityId,
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