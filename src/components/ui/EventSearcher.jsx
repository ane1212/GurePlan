import { useState, useEffect, useRef } from 'react'
import { events, municipalities, eventTypes } from '../services/eventService'
import { getLocalWeather } from '../services/weatherService'
// CardEvent lo construye otro compañero. Cuando esté listo, descomentar:
// import CardEvent from '../ui/CardEvent'

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const DEFAULT_LAT = 43.263
const DEFAULT_LON = -2.935

const INDOOR_TYPES = [
  'teatro', 'cine', 'exposición', 'exposicion',
  'música', 'musica', 'conferencia', 'danza',
  'ópera', 'opera', 'circo', 'infantil',
]

// ---------------------------------------------------------------------------
// isBadWeather
// Definida aquí porque weatherService.js no la exporta.
// Devuelve true si el código WMO indica mal tiempo.
// ---------------------------------------------------------------------------

function isBadWeather(code) {
  if (code == null) return false
  return (
    (code >= 45 && code <= 48) ||
    (code >= 51 && code <= 67) ||
    (code >= 71 && code <= 77) ||
    (code >= 80 && code <= 86) ||
    (code >= 95 && code <= 99)
  )
}

// ---------------------------------------------------------------------------
// isIndoor
// ---------------------------------------------------------------------------

function isIndoor(event) {
  if (!event.type) return false
  return INDOOR_TYPES.some(t => event.type.toLowerCase().includes(t))
}

// ---------------------------------------------------------------------------
// EventSearcher
// ---------------------------------------------------------------------------

function EventSearcher() {

  // --- Estado de los selects ---
  const [municipalityList, setMunicipalityList] = useState([])
  const [typeList, setTypeList] = useState([])

  // --- Estado de los filtros activos ---
  const [selectedMunicipality, setSelectedMunicipality] = useState('todos')
  const [selectedType, setSelectedType] = useState('todos')
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [selectedLanguages, setSelectedLanguages] = useState([])

  // --- Estado de los resultados ---
  const [eventList, setEventList] = useState([])
  const [weatherData, setWeatherData] = useState(null)
  const [weatherBanner, setWeatherBanner] = useState('good')
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showResetMessage, setShowResetMessage] = useState(false)

  // --- Mapa de coordenadas por municipio ---
  const municipalityCoords = useRef(new Map())

  // ---------------------------------------------------------------------------
  // useEffect de reset de página
  // Observa solo los filtros, NO currentPage, para evitar bucle infinito.
  // Cuando el usuario cambia un filtro: vuelve a página 1 y muestra el aviso
  // 3 segundos. El return limpia el timer si el componente se desmonta antes.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    setCurrentPage(1)
    setShowResetMessage(true)
    const timer = setTimeout(() => setShowResetMessage(false), 3000)
    return () => clearTimeout(timer)
  }, [selectedMunicipality, selectedType, selectedDate, selectedLanguages])

  // ---------------------------------------------------------------------------
  // handleLanguageChange
  // ---------------------------------------------------------------------------

  function handleLanguageChange(langCode) {
    setSelectedLanguages(prev =>
      prev.includes(langCode)
        ? prev.filter(l => l !== langCode)
        : [...prev, langCode]
    )
  }

  // ---------------------------------------------------------------------------
  // useEffect de inicialización — se ejecuta solo al montar.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    async function init() {
      const allMunicipalities = await municipalities()

      allMunicipalities.forEach(m => {
        if (m.lat && m.lon) {
          municipalityCoords.current.set(String(m.id), { lat: m.lat, lon: m.lon })
        }
      })

      const bilbao = allMunicipalities.find(
        m => m.name?.toLowerCase() === 'bilbao'
      )
      const ordered = [
        ...(bilbao ? [bilbao] : []),
        ...allMunicipalities.filter(m => !bilbao || m.id !== bilbao.id),
      ]
      setMunicipalityList(ordered)

      const allTypes = await eventTypes()
      setTypeList(allTypes)
    }

    init()
  }, [])

  // ---------------------------------------------------------------------------
  // useEffect de filtros — se ejecuta cuando cambia un filtro o la página.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    async function applyFilters() {
      setLoading(true)

      let day = null, month = null, year = null
      if (selectedDate) {
        const [y, m, d] = selectedDate.split('-')
        day = parseInt(d)
        month = parseInt(m)
        year = parseInt(y)
      }

      const municipalityId = selectedMunicipality !== 'todos' ? selectedMunicipality : null
      const type = selectedType !== 'todos' ? selectedType : null

      const results = await events(30, currentPage, day, month, municipalityId, null, type, year)

      // Obtiene el tiempo con getLocalWeather (nombre real en weatherService.js)
      let weather = null
      if (municipalityId && municipalityCoords.current.has(municipalityId)) {
        const { lat, lon } = municipalityCoords.current.get(municipalityId)
        weather = await getLocalWeather(lat, lon)
      } else if (results.length > 0 && results[0].lat && results[0].lon) {
        weather = await getLocalWeather(results[0].lat, results[0].lon)
      } else {
        weather = await getLocalWeather(DEFAULT_LAT, DEFAULT_LON)
      }

      setWeatherData(weather)

      // Filtro de idioma en frontend
      let filteredResults = results
      if (selectedLanguages.length > 0) {
        filteredResults = results.filter(e =>
          e.language && selectedLanguages.includes(e.language)
        )
      }

      // Banner del tiempo y filtro de interior
      // getLocalWeather devuelve el campo como "weathercode"
      const weatherCode = weather?.weathercode ?? null
      if (isBadWeather(weatherCode) && type === null) {
        const indoorResults = filteredResults.filter(e => isIndoor(e))
        if (indoorResults.length > 0) {
          setEventList(indoorResults)
          setWeatherBanner('bad')
        } else {
          setEventList(filteredResults)
          setWeatherBanner('bad-no-indoor')
        }
      } else {
        setEventList(filteredResults)
        setWeatherBanner('good')
      }

      setLoading(false)
    }

    applyFilters()
  }, [selectedMunicipality, selectedType, selectedDate, selectedLanguages, currentPage])

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section className="event-searcher">

      <div className="filters">

        {/* Filtro de municipio */}
        <div id="municipalities-container">
          <select
            value={selectedMunicipality}
            onChange={e => setSelectedMunicipality(e.target.value)}
          >
            <option value="todos">Todos</option>
            {municipalityList.map(m => (
              <option key={m.id} value={String(m.id)}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de tipo de evento */}
        <div id="type-container">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
          >
            <option value="todos">Todos</option>
            {typeList.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de fecha */}
        <div id="date-filter">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Filtro de idioma */}
        <div id="language-filter">
          {[
            { code: 'ES', label: 'Español' },
            { code: 'EU', label: 'Euskera' },
            { code: 'EN', label: 'Inglés'  },
          ].map(({ code, label }) => (
            <label key={code}>
              <input
                type="checkbox"
                checked={selectedLanguages.includes(code)}
                onChange={() => handleLanguageChange(code)}
              />
              {label}
            </label>
          ))}
        </div>

      </div>

      {/* Banner del tiempo */}
      {weatherBanner === 'bad' && (
        <div className="weather-banner weather-banner--bad">
          <span>Hoy llueve, te recomendamos solo planes de interior como teatro, cine o exposiciones</span>
        </div>
      )}
      {weatherBanner === 'bad-no-indoor' && (
        <div className="weather-banner weather-banner--bad">
          <span>Hoy llueve, no hemos encontrado planes de interior disponibles, mostrando todos</span>
        </div>
      )}
      {weatherBanner === 'good' && (
        <div className="weather-banner weather-banner--good">
          <span>Buen tiempo, te mostramos todos los planes disponibles</span>
        </div>
      )}

      {/* Aviso de reset de página */}
      {showResetMessage && (
        <div className="reset-message">
          Has cambiado un filtro, mostrando resultados desde la página 1.
        </div>
      )}

      {/* Lista de eventos */}
      <div id="view-container">
        {loading && <p>Cargando eventos...</p>}

        {!loading && eventList.length === 0 && (
          <p>No se encontraron eventos.</p>
        )}

        {!loading && eventList.map(event => (
          // TODO: reemplazar por <CardEvent key={event.id} event={event} />
          <p key={event.id}>{event.title}</p>
        ))}
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>

        <span>Página {currentPage}</span>

        <button
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={eventList.length < 30}
        >
          Siguiente
        </button>
      </div>

    </section>
  )
}

export default EventSearcher