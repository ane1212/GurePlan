/**
 * @component LanguageSelector
 * @description Componente funcional que permite al usuario alternar entre los idiomas disponibles (ES, EN, EU).
 * @returns {JSX.Element} Un contenedor con botones de cambio de idioma.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n, t } = useTranslation();

    /**
     * Cambia el idioma actual de la aplicación.
     * @function changeLanguage
     * @param {string} lng - Código del idioma (e.g., 'es', 'en', 'eu').
     */
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="language-selector">
            <span>{t('change_to')}:</span>

            <button
                onClick={() => changeLanguage('es')}
                style={{ cursor: 'pointer',}}
            >
                Castellano
            </button>

            <button
                onClick={() => changeLanguage('en')}
                style={{ cursor: 'pointer',}}
            >
                English
            </button>

            <button
                onClick={() => changeLanguage('eu')}
                style={{ cursor: 'pointer',}}
            >
                Euskara
            </button>
        </div>
    );
};

export default LanguageSelector;