/**
 * @file eventService.js
 * @description Servicio para la gestión de peticiones a la API de Open Data Euskadi (Eventos Culturales).
 */

import { APIEvent, APIProvince, APIMunicipality, APIType } from '../models/EventModels';

/** @constant {string} URL base de la API de cultura de Euskadi */
const URL_BASE = "https://api.euskadi.eus/culture/events";

/**
 * Realiza una petición fetch a la API.
 * @async
 * @param {string} endpoint - El endpoint al que realizar la petición.
 * @throws {Error} Si la respuesta no es exitosa.
 * @returns {Promise<any>} Los datos en formato JSON.
 */
async function apiFetch(endpoint) {
    const response = await fetch(`${URL_BASE}${endpoint}`);

    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
    }

    return await response.json();
}

/**
 * Obtiene el listado de provincias de Euskadi.
 * @async
 * @returns {Promise<APIProvince[]>} Array de objetos de tipo APIProvince.
 */
export async function provinces() {
    try {
        const data = await apiFetch('/v1.0/provinces');
        return (data.items ?? []).map(item => new APIProvince(item));
    } catch (err) {
        console.error('Error cargando provincias:', err);
        return [];
    }
}

/**
 * Genera un mapa de provincias para facilitar la búsqueda por ID.
 * @async
 * @private
 * @returns {Promise<Map<string, APIProvince>>} Mapa con ID de provincia como clave.
 */
async function fetchProvinceMap() {
    const provinceList = await provinces();
    return new Map(provinceList.map(p => [p.id, p]));
}

/**
 * Obtiene un listado filtrado de eventos.
 * @async
 * @param {Object} [filters={}] - Filtros de búsqueda.
 * @param {number} [filters.elements] - Número de elementos por página.
 * @param {number} [filters.page] - Número de página.
 * @param {number} [filters.day] - Día del evento.
 * @param {number} [filters.month] - Mes del evento.
 * @param {string} [filters.municipalityId] - ID del municipio (NORA code).
 * @param {string} [filters.provinceId] - ID de la provincia (NORA code).
 * @param {string} [filters.type] - Tipo de evento.
 * @param {number} [filters.year] - Año del evento.
 * @returns {Promise<APIEvent[]>} Array de eventos normalizados.
 */
export async function events({
    elements,
    page,
    day,
    month,
    municipalityId,
    provinceId,
    type,
    year,
} = {}) {
    try {
        const provinceMap = await fetchProvinceMap();

        const params = new URLSearchParams();
        if (elements != null) params.set('_elements', elements);
        if (page != null) params.set('_page', page);
        if (day != null) params.set('day', day);
        if (month != null) params.set('month', month);
        if (municipalityId != null) params.set('municipalityNoraCode', municipalityId);
        if (provinceId != null) params.set('provinceNoraCode', provinceId);
        if (type != null) params.set('type', type);
        if (year != null) params.set('year', year);

        const data = await apiFetch(`/v1.0/events?${params.toString()}`);

        return (data.items ?? []).map(item => new APIEvent(item, provinceMap));
    } catch (err) {
        console.error('Error cargando eventos:', err);
        return [];
    }
}

/**
 * Obtiene los detalles de un evento específico por su ID.
 * @async
 * @param {string|number} id - ID del evento.
 * @returns {Promise<APIEvent|null>} El evento encontrado o null si hay error.
 */
export async function eventById(id) {
    try {
        const provinceMap = await fetchProvinceMap();
        const data = await apiFetch(`/v1.0/events/${id}`);

        return new APIEvent(data, provinceMap);
    } catch (err) {
        console.error('Error cargando evento:', err);
        return null;
    }
}

/**
 * Obtiene el catálogo de tipos de eventos disponibles.
 * @async
 * @returns {Promise<APIType[]>} Array de tipos de eventos.
 */
export async function eventTypes() {
    try {
        const data = await apiFetch('/v1.0/eventType');
        return data.map(item => new APIType(item));
    } catch (err) {
        console.error('Error cargando tipos:', err);
        return [];
    }
}

/**
 * Obtiene el listado completo de municipios de Euskadi.
 * @async
 * @returns {Promise<APIMunicipality[]>} Array de municipios.
 */
export async function municipalities() {
    try {
        const data = await apiFetch('/v1.0/municipalities?_elements=309&_page=1');
        return (data.items ?? []).map(item => new APIMunicipality(item));
    } catch (err) {
        console.error('Error cargando municipios:', err);
        return [];
    }
}