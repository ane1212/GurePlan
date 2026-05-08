/**
 * @file EventModels.js
 * @description Modelos de datos para normalizar las respuestas de la API de Open Data Euskadi.
 */

import { stripVideos } from '../utils/stripVideos.jsx';

/**
 * Representa un evento cultural.
 * @class
 */
export class APIEvent {
    /**
     * @param {Object} event - Objeto crudo devuelto por la API.
     * @param {Map<number, APIProvince>} provinceMap - Mapa de provincias para resolución de nombres.
     */
    constructor(event, provinceMap) {
        /** @property {string|number} ID único del evento */
        this.id = event.id;
        /** @property {string} Título del evento en castellano */
        this.title = event?.nameEs ?? '';
        /** @property {string} Descripción filtrada (sin vídeos) */
        this.description = stripVideos(event?.descriptionEs ?? '');
        /** @property {string} Fecha de inicio formateada */
        this.startDate = new Date(event.startDate).toLocaleDateString() ?? '';
        /** @property {string} Fecha de fin formateada */
        this.endDate = new Date(event.endDate).toLocaleDateString() ?? '';
        /** @property {string} Nombre del municipio */
        this.municipality = event?.municipalityEs ?? '';
        /** @property {string} URL de la imagen principal */
        this.images = event?.images?.[0]?.imageUrl || './assets/img/no-photo.png';
        /** @property {string} Tipo de evento */
        this.type = event?.typeEs ?? '';
        /** @property {string} Precio o información de entrada */
        this.price = event?.priceEs ?? '';
        /** @property {string} URL de compra de entradas */
        this.purchaseUrl = event?.purchaseUrlEs ?? '';
        /** @property {string} Horario del evento */
        this.hour = event?.openingHoursEs ?? '';
        /** @property {APIProvince|string} Objeto provincia relacionado */
        this.province = provinceMap.get(Number(event.provinceNoraCode)) || '';
        /** @property {number|null} Latitud geográfica */
        this.lat = event?.municipalityLatitude ?? null;
        /** @property {number|null} Longitud geográfica */
        this.lon = event?.municipalityLongitude ?? null;
        /** @property {string} Idioma principal del evento */
        this.language = event?.lang ?? 'ES';
    }
}

/**
 * Representa una provincia vasca.
 * @class
 */
export class APIProvince {
    /**
     * @param {Object} province - Datos de la provincia de la API.
     */
    constructor(province) {
        /** @property {string|number} ID (NORA code) */
        this.id = province?.provinceId;
        /** @property {string} Nombre en castellano */
        this.name = province?.nameEs;
        this.latitude = null;
        this.longitude = null;
    }
}

/**
 * Representa un municipio vasco.
 * @class
 */
export class APIMunicipality {
    /**
     * @param {Object} municipality - Datos del municipio de la API.
     */
    constructor(municipality) {
        /** @property {string|number} ID (NORA code) */
        this.id = municipality?.municipalityId;
        /** @property {string} Nombre en castellano */
        this.name = municipality?.nameEs;
        /** @property {number} Latitud */
        this.lat = municipality?.latitude;
        /** @property {number} Longitud */
        this.lon = municipality?.longitude;
    }
}

/**
 * Representa un tipo de categoría de evento.
 * @class
 */
export class APIType {
    /**
     * @param {Object} type - Datos del tipo de la API.
     */
    constructor(type) {
        /** @property {string|number} ID del tipo */
        this.id = type?.id;
        /** @property {string} Nombre descriptivo */
        this.name = type?.nameEs;
    }
}