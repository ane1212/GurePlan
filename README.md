# GurePlan (Planes-Fav) 🌟

**GurePlan** es una aplicación web moderna diseñada para ayudar a los usuarios a descubrir, explorar y guardar planes culturales en Euskadi de forma sencilla e intuitiva. La plataforma centraliza la oferta cultural de **Open Data Euskadi**, facilitando la toma de decisiones sobre qué hacer en el tiempo libre.

El proyecto está dirigido a cualquier persona que quiera organizar su ocio sin complicaciones: desde quienes buscan actividades para el fin de semana hasta los que desean guardar ideas para una fecha concreta. La aplicación resuelve el problema de la dispersión de información, integrando datos en tiempo real y condiciones meteorológicas para una planificación completa.

---

##  Estructura de la App (Vistas)

La aplicación es una **Single Page Application (SPA)** con navegación fluida entre sus rutas principales:

- **Inicio (`/`)**: Catálogo principal de planes en formato de tarjetas. Permite explorar, filtrar por municipio/tipo y ver el clima actual.
- **Login (`/login`)**: Gestión de acceso y registro de usuarios. Los datos de sesión se mantienen de forma segura en `localStorage`.
- **Detalle del Plan (`/event/:id`)**: Vista ampliada con descripción completa, imágenes, datos de interés y pronóstico meteorológico local mediante la API de **Open-Meteo**.
- **Favoritos (`/favorites`)**: Sección personalizada donde el usuario puede consultar y gestionar sus planes guardados.

---

## Características Principales 

- **Filtro Inteligente**: Algoritmo de clasificación basado en la Agenda Cultural de Euskadi.
- **Geolocalización y Clima**: Detección de coordenadas para mostrar el pronóstico en tiempo real en el lugar del evento.
- **Gestión de Favoritos**: Sistema de persistencia vinculado al perfil de usuario local.
- **Multi-idioma**: Soporte completo para **Euskera, Castellano e Inglés** (i18next).
- **Diseño Premium & Responsive**: Interfaz moderna optimizada para móviles y escritorio siguiendo un enfoque *Mobile First*.

---

## Stack Tecnológico

- **Frontend**: [React 19](https://react.dev/) y [Vite 8](https://vitejs.dev/).
- **Enrutamiento**: [React Router 7](https://reactrouter.com/).
- **Internacionalización**: [i18next](https://www.i18next.com/).
- **Estilos**: Vanilla CSS3 con variables, Flexbox y Grid.
- **APIs externas**: 
  - [Open Data Euskadi](http://opendata.euskadi.eus/) (Cultura).
  - [Open-Meteo](https://open-meteo.com/) (Tiempo).
- **Herramientas**: GitHub y Jira.

---

## Estructura del Proyecto

```text
GurePlan/
├── public/                  # Recursos estáticos (imágenes, iconos)
├── src/
│   ├── components/          # Componentes UI (Cards, Searcher, Buttons)
│   ├── layout/              # Elementos comunes (Header, Footer, Nav)
│   ├── models/              # Modelos de datos y clases (APIEvent, etc.)
│   ├── pages/               # Vistas principales de la aplicación
│   ├── services/            # Lógica de APIs (eventService, weatherService)
│   ├── utils/               # Funciones de ayuda y formateo
│   ├── App.jsx              # Configuración de rutas y estado global
│   └── i18n.js              # Configuración de idiomas
└── README.md                # Documentación del proyecto
```

---

## Cómo ejecutarlo

A diferencia de una web estática, este proyecto utiliza **Node.js** para gestionar sus dependencias:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/ane1212/proyecto-planes-fav.git
   cd GurePlan
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   *La app estará disponible en `http://localhost:5173`*

---

## Autores

- **Ane Jauregui**
- **Marcos Salinas**
- **Frank Rocha**
- **Olatz Gonzalez**

---
© 2026 GurePlan - Fomentando la cultura en Euskadi.