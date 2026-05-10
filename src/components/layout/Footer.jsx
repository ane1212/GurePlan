import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-content">
                <p>GurePlan © 2026</p>
                <div className="footer-links">
                    <Link to="/about">Acerca de</Link>
                    <Link to="/privacy">Privacidad</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;