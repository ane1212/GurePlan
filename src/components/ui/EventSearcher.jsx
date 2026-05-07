import { useState, useEffect, useRef } from "react";
import { events, municipalities, eventTypes } from "../services/eventService";
import { getLocalWeather, isBadWeather } from "../services/weatherService";
import CardEvent from '../ui/CardEvent'

const DEFAULT_LAT = 43.263;
const DEFAULT_LON = -2.935;

const INDOOR_TYPES = [
  "teatro",
  "cine",
  "exposición",
  "exposicion",
  "música",
  "musica",
  "conferencia",
  "danza",
  "ópera",
  "opera",
  "circo",
  "infantil",
];

function isIndoor(event) {
  if (!event.type) return false;
  return INDOOR_TYPES.some((t) => event.type.toLowerCase().includes(t));
}

function EventSearcher() {
  const [municipalityList, setMunicipalityList] = useState([]);
  const [typeList, setTypeList] = useState([]);

  const [selectedMunicipality, setSelectedMunicipality] = useState("todos");
  const [selectedType, setSelectedType] = useState("todos");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [eventList, setEventList] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherBanner, setWeatherBanner] = useState("good");
  const [loading, setLoading] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const municipalityCoords = useRef(new Map());

  function handleLanguageChange(langCode) {
    setSelectedLanguages((prev) =>
      prev.includes(langCode)
        ? prev.filter((l) => l !== langCode)
        : [...prev, langCode],
    );
  }

  useEffect(() => {
    async function init() {
      const allMunicipalities = await municipalities();

      allMunicipalities.forEach((m) => {
        if (m.lat && m.lon) {
          municipalityCoords.current.set(String(m.id), {
            lat: m.lat,
            lon: m.lon,
          });
        }
      });

      const bilbao = allMunicipalities.find(
        (m) => m.name?.toLowerCase() === "bilbao",
      );
      const ordered = [
        ...(bilbao ? [bilbao] : []),
        ...allMunicipalities.filter((m) => !bilbao || m.id !== bilbao.id),
      ];
      setMunicipalityList(ordered);

      const allTypes = await eventTypes();
      setTypeList(allTypes);
    }

    init();
  }, []);

  useEffect(() => {
    async function applyFilters() {
      setLoading(true);

      let day = null,
        month = null,
        year = null;
      if (selectedDate) {
        const [y, m, d] = selectedDate.split("-");
        day = parseInt(d);
        month = parseInt(m);
        year = parseInt(y);
      }

      const municipalityId =
        selectedMunicipality !== "todos" ? selectedMunicipality : null;
      const type = selectedType !== "todos" ? selectedType : null;

      // FIX: Passing an object as expected by the service
      const results = await events({
        elements: 30,
        page: 1,
        day,
        month,
        municipalityId,
        type,
        year,
      });

      let weather = null;
      if (municipalityId && municipalityCoords.current.has(municipalityId)) {
        const { lat, lon } = municipalityCoords.current.get(municipalityId);
        weather = await getLocalWeather(lat, lon);
      } else if (results.length > 0 && results[0].lat && results[0].lon) {
        weather = await getLocalWeather(results[0].lat, results[0].lon);
      } else {
        weather = await getLocalWeather(DEFAULT_LAT, DEFAULT_LON);
      }

      setWeatherData(weather);

      let filteredResults = results;
      if (selectedLanguages.length > 0) {
        filteredResults = results.filter(
          (e) => e.language && selectedLanguages.includes(e.language.toUpperCase()),
        );
      }

      const weatherCode = weather?.weathercode ?? null;
      if (isBadWeather(weatherCode) && type === null) {
        const indoorResults = filteredResults.filter((e) => isIndoor(e));
        if (indoorResults.length > 0) {
          setEventList(indoorResults);
          setWeatherBanner("bad");
        } else {
          setEventList(filteredResults);
          setWeatherBanner("bad-no-indoor");
        }
      } else {
        setEventList(filteredResults);
        setWeatherBanner("good");
      }

      setLoading(false);
    }

    applyFilters();
  }, [selectedMunicipality, selectedType, selectedDate, selectedLanguages]);

  return (
    <section className="event-searcher-container">
      <header className="searcher-header">
        <h1>Descubre Planes en Euskadi</h1>
        <p>Encuentra los mejores eventos culturales cerca de ti</p>
      </header>

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
          <div className="weather-status">
            {weatherBanner === "bad" && (
              <div className="banner banner--bad">
                <i className="icon-warning">☔</i>
                <div>
                  <strong>Día lluvioso</strong>
                  <p>Te recomendamos planes de interior (teatro, cine, expos...)</p>
                </div>
              </div>
            )}
            {weatherBanner === "bad-no-indoor" && (
              <div className="banner banner--bad">
                <i className="icon-warning">☔</i>
                <div>
                  <strong>Día lluvioso</strong>
                  <p>No hay planes de interior hoy, ¡lleva paraguas!</p>
                </div>
              </div>
            )}
            {weatherBanner === "good" && (
              <div className="banner banner--good">
                <i className="icon-success"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
                </i>
                <div>
                  <strong>¡Buen tiempo!</strong>
                  <p>Disfruta de cualquier plan hoy.</p>
                </div>
              </div>
            )}
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
