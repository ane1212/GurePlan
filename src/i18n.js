import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    es: {
        translation: {
            "welcome": "Descubre Planes en Euskadi",
            "description": "Encuentra los mejores eventos culturales cerca de ti",
            "home": "Inicio",
            "favorites": "Favoritos",
            "about": "Acerca de",
            "login": "Entrar",
            "logout": "Salir",
            "contact": "Contacto",
            "municipality": "Municipio",
            "event_type": "Tipo de Evento",
            "date": "Fecha",
            "languages": "Idiomas",
            "all": "Todos"
        }
    },
    en: {
        translation: {
            "welcome": "Discover Plans in Euskadi",
            "description": "Find the best cultural events near you",
            "home": "Home",
            "favorites": "Favorites",
            "about": "About Us",
            "login": "Login",
            "logout": "Logout",
            "contact": "Contact",
            "municipality": "Municipality",
            "event_type": "Event Type",
            "date": "Date",
            "languages": "Languages",
            "all": "All"
        }
    },
    eu: {
        translation: {
            "welcome": "GurePlanak Euskadin",
            "description": "Aurkitu zure inguruko kultur ekitaldirik onenak",
            "home": "Hasiera",
            "favorites": "Gogokoak",
            "about": "Guri buruz",
            "login": "Sartu",
            "logout": "Irten",
            "contact": "Kontaktua",
            "municipality": "Udalerria",
            "event_type": "Ekitaldi Mota",
            "date": "Data",
            "languages": "Hizkuntzak",
            "all": "Guztiak"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;