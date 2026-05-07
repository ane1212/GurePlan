import { useState, useEffect } from 'react'
import './App.css'
import CardWeather from './components/ui/CardWeather';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './components/layout/LanguageSelector';

function App() {
  const { t } = useTranslation();
import CardEvent from './components/ui/CardEvent'
import { events } from './components/services/eventService'

function App() {
  const [eventList, setEventList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await events({ elements: 10, page: 1, year: 2026 })
      setEventList(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p>Cargando eventos...</p>

  return (
    <>
      <h1>GurePlan</h1>
      <CardWeather onWeatherLoad={(condition) => console.log('Clima cargado:', condition)} />
      <div className="App">
        <LanguageSelector />

        <main style={{ padding: '20px', textAlign: 'center' }}>
          <h1>{t('welcome')}</h1>
          <p>{t('description')}</p>

          <button className="contact-btn">
            {t('contact')}
          </button>
        </main>
      </div>
      {eventList.map(event => (
        <CardEvent key={event.id} event={event} />
      ))}
    </>
  )
}

export default App