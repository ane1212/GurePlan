import { APIEvent, APIProvince, APIMunicipality, APIType } from '../models/EventModels';

const URL_BASE = "https://api.euskadi.eus/culture/events";

async function apiFetch(endpoint) {
    const response = await fetch(`${URL_BASE}${endpoint}`);

    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
    }

    return await response.json();
}

export async function provinces() {
    try {
        const data = await apiFetch('/v1.0/provinces');
        return (data.items ?? []).map(item => new APIProvince(item));
    } catch (err) {
        console.error('Error cargando provincias:', err);
        return [];
    }
}

async function fetchProvinceMap() {
    const provinceList = await provinces();
    return new Map(provinceList.map(p => [p.id, p]));
}

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

export async function eventTypes() {
    try {
        const data = await apiFetch('/v1.0/eventType');
        return data.map(item => new APIType(item));
    } catch (err) {
        console.error('Error cargando tipos:', err);
        return [];
    }
}

export async function municipalities() {
    try {
        const data = await apiFetch('/v1.0/municipalities?_elements=309&_page=1');
        return (data.items ?? []).map(item => new APIMunicipality(item));
    } catch (err) {
        console.error('Error cargando municipios:', err);
        return [];
    }
}