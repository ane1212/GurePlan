import React from 'react';

const About = () => {
    return (
        <div className="about-container welcome-section">
            <h1>Sobre GurePlan</h1>
            <p>GurePlan es una plataforma diseñada para ayudarte a descubrir la vibrante oferta cultural de Euskadi.</p>
            
            <div style={{ marginTop: '3rem', textAlign: 'left', maxWidth: '800px', margin: '3rem auto' }}>
                <h3>¿Qué ofrecemos?</h3>
                <p>Acceso directo a la agenda cultural de Euskadi, filtrado por municipio, tipo de evento y fecha. Además, te recomendamos los mejores planes según el clima local.</p>
                
                <h3>Tecnología</h3>
                <p>Construido con React, integrando la API oficial de Euskadi.eus y Open-Meteo para datos meteorológicos en tiempo real.</p>
            </div>
        </div>
    );
};

export default About;
