import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import CardWeather from './components/ui/CardWeather';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './components/layout/LanguageSelector';

function App() {
  const { t } = useTranslation();
  return (
    <>
      <h1>Holaa</h1>
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
    </>
  )
}

export default App