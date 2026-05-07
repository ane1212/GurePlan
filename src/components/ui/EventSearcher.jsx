import { useState, useEffect, useRef } from 'react'
import { events, municipalities, eventTypes } from '../services/eventService'
import { fetchWeather, isBadWeather } from '../services/weatherService'
// CardEvent lo construye otro compañero. Cuando esté listo, descomentar:
// import CardEvent from '../ui/CardEvent'

// ---------------------------------------------------------------------------
// Constantes
// Sin cambios respecto al original.
// ---------------------------------------------------------------------------

const DEFAULT_LAT = 43.263
const DEFAULT_LON = -2.935

const INDOOR_TYPES = [
  'teatro', 'cine', 'exposición', 'exposicion',
  'música', 'musica', 'conferencia', 'danza',
  'ópera', 'opera', 'circo', 'infantil',
]

// ---------------------------------------------------------------------------
// isIndoor
// Función pura sin cambios. Comprueba si un evento es de interior
// comparando su tipo con la lista INDOOR_TYPES.
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
  // Se cargan una sola vez al montar el componente (useEffect con []).
  const [municipalityList, setMunicipalityList] = useState([])
  const [typeList, setTypeList] = useState([])

  // --- Estado de los filtros activos ---
  // Cada vez que el usuario cambia un filtro, React actualiza este estado
  // y el segundo useEffect se dispara automáticamente para buscar eventos.
  // En el original esto lo gestionaba applyFilters() llamado manualmente.
  const [selectedMunicipality, setSelectedMunicipality] = useState('todos')
  const [selectedType, setSelectedType] = useState('todos')
  const [selectedDate, setSelectedDate] = useState(
    // Valor inicial: fecha de hoy en formato YYYY-MM-DD, igual que listDate()
    new Date().toISOString().split('T')[0]
  )

  // --- Estado de los resultados ---
  const [eventList, setEventList] = useState([])
  const [weatherData, setWeatherData] = useState(null)
  const [weatherBanner, setWeatherBanner] = useState('good')
  const [loading, setLoading] = useState(false)
  const [selectedLanguages, setSelectedLanguages] = useState([])  // vacío = todos los idiomas

  // --- Mapa de coordenadas por municipio ---
  // useRef en lugar de useState porque este Map solo se consulta,
  // nunca necesita provocar un re-render al actualizarse.
  const municipalityCoords = useRef(new Map())

  // ---------------------------------------------------------------------------
  // handleLanguageChange
  // Gestiona el estado del array selectedLanguages cuando el usuario
  // marca o desmarca un checkbox de idioma.
  // Si el idioma ya estaba en el array lo quita; si no estaba lo añade.
  // ---------------------------------------------------------------------------

  function handleLanguageChange(langCode) {
    setSelectedLanguages(prev =>
      prev.includes(langCode)
        ? prev.filter(l => l !== langCode)
        : [...prev, langCode]
    )
  }

  // ---------------------------------------------------------------------------
  // useEffect de inicialización — equivale a DOMContentLoaded del original.
  // Se ejecuta una sola vez al montar el componente (array de deps vacío []).
  // Carga municipios y tipos para poblar los selects.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    async function init() {
      // Carga municipios
      const allMunicipalities = await municipalities()

      // Construye el mapa de coordenadas igual que en el original
      allMunicipalities.forEach(m => {
        if (m.lat && m.lon) {
          municipalityCoords.current.set(String(m.id), { lat: m.lat, lon: m.lon })
        }
      })

      // Bilbao primero, igual que listMunicipalities() del original
      const bilbao = allMunicipalities.find(
        m => m.name?.toLowerCase() === 'bilbao'
      )
      const ordered = [
        ...(bilbao ? [bilbao] : []),
        ...allMunicipalities.filter(m => !bilbao || m.id !== bilbao.id),
      ]
      setMunicipalityList(ordered)

      // Carga tipos de evento
      const allTypes = await eventTypes()
      setTypeList(allTypes)
    }

    init()
  }, [])

  // ---------------------------------------------------------------------------
  // useEffect de filtros — equivale a applyFilters() del original.
  // Se ejecuta cada vez que el usuario cambia municipio, tipo o fecha.
  // Las dependencias del array le dicen a React exactamente cuándo repetirlo.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    async function applyFilters() {
      setLoading(true)

      // Construye los parámetros de fecha igual que en el original
      let day = null, month = null, year = null
      if (selectedDate) {
        const [y, m, d] = selectedDate.split('-')
        day = parseInt(d)
        month = parseInt(m)
        year = parseInt(y)
      }

      const municipalityId = selectedMunicipality !== 'todos' ? selectedMunicipality : null
      const type = selectedType !== 'todos' ? selectedType : null

      // Llama a la API de eventos
      const results = await events(30, 1, day, month, municipalityId, null, type, year)

      // Obtiene el código del tiempo según las coordenadas disponibles,
      // con la misma lógica de prioridad que el original
      let weather = null
      if (municipalityId && municipalityCoords.current.has(municipalityId)) {
        const { lat, lon } = municipalityCoords.current.get(municipalityId)
        weather = await fetchWeather(lat, lon)
      } else if (results.length > 0 && results[0].lat && results[0].lon) {
        weather = await fetchWeather(results[0].lat, results[0].lon)
      } else {
        weather = await fetchWeather(DEFAULT_LAT, DEFAULT_LON)
      }

      setWeatherData(weather)

      // Filtro de idioma — aplicado en el frontend sobre los resultados
      // porque la API no acepta este parámetro.
      // Si selectedLanguages está vacío se muestran todos los idiomas.
      let filteredResults = results
      if (selectedLanguages.length > 0) {
        filteredResults = results.filter(e =>
          e.language && selectedLanguages.includes(e.language)
        )
      }

      // Lógica del banner y filtro de interior — sin cambios respecto al original
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
  }, [selectedMunicipality, selectedType, selectedDate, selectedLanguages])

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section className="event-searcher">

      {/* --- Filtros ---
          En el original cada filtro era un custom select construido con DOM.
          Aquí son elementos <select> nativos de HTML con onChange,
          que es la forma correcta en React. */}
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

        {/* Filtro de idioma — checkboxes porque se pueden seleccionar varios.
            Vacío = todos los idiomas. Cada cambio llama a handleLanguageChange,
            que añade o quita el código del array selectedLanguages. */}
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

      {/* --- Banner del tiempo ---
          En el original showWeatherBanner() creaba y modificaba un div
          con getElementById. Aquí es JSX condicional puro. */}
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

      {/* --- Lista de eventos ---
          En el original renderEvents() volcaba HTML en un div con innerHTML.
          Aquí es un .map() sobre el estado eventList.
          Cuando CardEvent esté listo, sustituir el <p> provisional por:
          <CardEvent key={event.id} event={event} /> */}
      <div id="view-container">
        {loading && <p>Cargando eventos...</p>}

        {!loading && eventList.length === 0 && (
          <p>No se encontraron eventos.</p>
        )}

        {!loading && eventList.map(event => (
          // TODO: reemplazar por <CardEvent key={event.id} event={event} />
          //       cuando el componente esté disponible
          <p key={event.id}>{event.title}</p>
        ))}
      </div>

    </section>
  )
}

export default EventSearcher