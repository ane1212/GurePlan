import { stripVideos } from '../utils/stripVideos.jsx';

export class APIEvent {
    constructor(event, provinceMap) {
        this.id = event.id;
        this.title = event?.nameEs ?? '';
        this.description = stripVideos(event?.descriptionEs ?? '');
        this.startDate = new Date(event.startDate).toLocaleDateString() ?? '';
        this.endDate = new Date(event.endDate).toLocaleDateString() ?? '';
        this.municipality = event?.municipalityEs ?? '';
        this.images = event?.images?.[0]?.imageUrl || './assets/img/no-photo.png';
        this.type = event?.typeEs ?? '';
        this.price = event?.priceEs ?? '';
        this.purchaseUrl = event?.purchaseUrlEs ?? '';
        this.hour = event?.openingHoursEs ?? '';
        this.province = provinceMap.get(Number(event.provinceNoraCode)) || '';
        this.lat = event?.municipalityLatitude ?? null;
        this.lon = event?.municipalityLongitude ?? null;
    }
}

export class APIProvince {
    constructor(province) {
        this.id = province?.provinceId;
        this.name = province?.nameEs;
        this.latitude = null;
        this.longitude = null;
    }
}

export class APIMunicipality {
    constructor(municipality) {
        this.id = municipality?.municipalityId;
        this.name = municipality?.nameEs;
        this.lat = municipality?.latitude;
        this.lon = municipality?.longitude;
    }
}

export class APIType {
    constructor(type) {
        this.id = type?.id;
        this.name = type?.nameEs;
    }
}