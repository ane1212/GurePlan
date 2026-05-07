import React from 'react';
/**
 * Componente funcional que renderiza el pie de página de la aplicación.
 * Muestra el copyright actualizado y un enlace a la sección de información.
 * 
 * @component
 * @example
 * return (
 *   <Footer />
 * )
 * 
 * @returns {React.JSX.Element} El elemento JSX que representa el footer.
 */
const Footer = () => {
    return (
        <footer>
            <p>GurePlan © 2026</p>
            <p>
                <a href="about.html">Acerca de</a>
            </p>
        </footer>
    );
};

export default Footer;