import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './components/layout/Header.jsx'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Footer from './components/layout/Footer.jsx'
import './i18n.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <App />
      <Footer />
    </BrowserRouter>
  </StrictMode>,
)