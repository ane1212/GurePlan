/**
 * @file App.jsx
 * @description Componente raíz de la aplicación GurePlan. Gestiona el enrutamiento y el estado global del usuario.
 */

import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import EventSearcher from './components/ui/EventSearcher'
import LanguageSelector from './components/layout/LanguageSelector';
import Auth from './components/login';

// Pages
import Favorites from './pages/Favorites';
import About from './pages/About';
import CardEventDetails from './pages/CardEventDetails';

// Styles
import './App.css'

/**
 * Componente principal App
 * @component
 * @returns {JSX.Element} La estructura principal de la aplicación con navegación y rutas.
 */
function App() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  /** 
   * Estado del usuario actual, inicializado desde localStorage.
   * @type {Object|null}
   */
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    /**
     * Sincroniza el estado del usuario si cambia en otra pestaña.
     */
    const handleStorageChange = () => {
      const stored = localStorage.getItem("currentUser");
      setCurrentUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Cierra la sesión del usuario y redirige al inicio.
   */
  function handleLogout() {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate('/');
  }

  return (
    <div className="app-container">
      <header className="main-nav">
        <div className="nav-left">
          <Link to="/" className="nav-brand">GurePlan</Link>
          <nav className="nav-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>{t('home')}</Link>
            <Link to="/favorites" className={location.pathname === '/favorites' ? 'active' : ''}>{t('favorites')}</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>{t('about')}</Link>
          </nav>
        </div>

        <div className="nav-right">
          <LanguageSelector />

          {currentUser ? (
            <div className="user-profile">
              <span className="username">{currentUser.name}</span>
              <button className="logout-btn" onClick={handleLogout}>
                {t('logout')}
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={() => navigate('/login')}>
              {t('login')}
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              <section className="top-section">
                <div className="welcome-text">
                  <h1>{t('welcome')}</h1>
                  <p>{t('description')}</p>
                </div>
              </section>
              <EventSearcher />
            </>
          } />

          <Route path="/login" element={<Auth onLogin={(user) => setCurrentUser(user)} />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/about" element={<About />} />
          <Route path="/event/:id" element={<CardEventDetails />} />
        </Routes>
      </main>

      <footer className="main-footer">
        <div className="footer-content">
          <p>&copy; 2026 GurePlan - Planes culturales en Euskadi</p>
          <div className="footer-links">
            <Link to="/about">{t('about')}</Link>
            <Link to="/privacy">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App