/**
* @file i18n.js
* @description Configuración central de internacionalización (i18n) para el proyecto
React.
* Utiliza i18next y react-i18next con soporte para Castellano, Euskera e Inglés.
*/
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
/**
* @typedef {Object} TranslationResource
* @property {Object} translation - Objeto que contiene los pares clave-valor de las
traducciones.
*/
/**
* @type {Object.}
* Diccionario de recursos de traducción.
*/
const resources = {
    es: {
        translation: {
            "welcome": "Bienvenido a nuestro proyecto",
            "description": "Esta es una aplicación React con soporte multiidioma.",
            "change_to": "Cambiar idioma",
            "home": "Inicio",
            "contact": "Contacto"

        }
    },
    en: {
        translation: {
            "welcome": "Welcome to our project",
            "description": "This is a React application with multi-language support.",
            "change_to": "Change language",
            "home": "Home",
            "contact": "Contact"
        }
    },
    eu: {
        translation: {
            "welcome": "Ongi etorri gure proiektura",
            "description": "Hau hizkuntza anitzeko euskarria duen React aplikazioa da.",
            "change_to": "Hizkuntza aldatu",
            "home": "Hasiera",
            "contact": "Kontaktua"
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
            escapeValue: false // React ya protege contra ataques XSS
        }
    });
export default i18n;