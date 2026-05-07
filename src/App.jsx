import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import CardWeather from './components/ui/CardWeather';

function App() {

  return (
    <>
      <h1>Holaa</h1>
      <CardWeather onWeatherLoad={(condition) => console.log('Clima cargado:', condition)} />
    </>
  )
}

export default App