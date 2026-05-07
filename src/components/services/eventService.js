const URL_BASE = "https://api.euskadi.eus/culture/events";

// ---------------------------------------------------------------------------
// Clases de datos
// Modelan la respuesta de la API en objetos con solo los campos que usamos.
// No han cambiado respecto a apiPlanes.js porque no tocan el DOM.
// ---------------------------------------------------------------------------

class APIEvent {
  constructor(event, provinceMap) {
    this.id = event.id;
    this.title = event?.nameEs ?? "";
    this.description = stripVideos(event?.descriptionEs ?? "");
    this.startDate = new Date(event.startDate).toLocaleDateString() ?? "";
    this.endDate = new Date(event.endDate).toLocaleDateString() ?? "";
    this.municipality = event?.municipalityEs ?? "";
    this.images = event?.images?.[0]?.imageUrl || "./assets/img/no-photo.png";
    this.type = event?.typeEs ?? "";
    this.price = event?.priceEs ?? "";
    this.purchaseUrl = event?.purchaseUrlEs ?? "";
    this.hour = event?.openingHoursEs ?? "";
    this.province = provinceMap.get(Number(event.provinceNoraCode)) || "";
    this.lat = event?.municipalityLatitude ?? null;
    this.lon = event?.municipalityLongitude ?? null;
    // Campo nuevo: idioma en que se celebra el evento.
    // La API lo devuelve como código en mayúsculas: 'ES', 'EU', 'EN'.
    this.language = event?.language ?? null;
  }
}

class APIProvince {
  constructor(province) {
    this.id = province?.provinceId;
    this.name = province?.nameEs;
    this.latitude = null;
    this.longitude = null;
  }
}

class APIMunicipalities {
  constructor(municipality) {
    this.id = municipality?.municipalityId;
    this.name = municipality?.nameEs;
    this.lat = municipality?.latitude;
    this.lon = municipality?.longitude;
  }
}

class APIType {
  constructor(type) {
    this.id = type?.id;
    this.name = type?.nameEs;
  }
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

// Elimina iframes y vídeos embebidos de las descripciones HTML que devuelve
// la API, para no romper el layout al renderizarlas.
function stripVideos(html = "") {
  return html
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<video[\s\S]*?<\/video>/gi, "");
}

// ---------------------------------------------------------------------------
// Funciones de acceso a la API
// En el proyecto anterior se llamaban desde DOMContentLoaded o desde
// applyFilters(). En React se llamarán desde useEffect dentro de los
// componentes que las necesiten.
// ---------------------------------------------------------------------------

export async function provinces() {
  try {
    const res = await fetch(`${URL_BASE}/v1.0/provinces`);
    const data = await res.json();
    return data.items.map((item) => new APIProvince(item));
  } catch (err) {
    console.error("Error cargando provincias:", err);
    return [];
  }
}

export async function municipalities() {
  try {
    const res = await fetch(`${URL_BASE}/v1.0/municipalities?_elements=309&_page=1`);
    const data = await res.json();
    return data.items.map((item) => new APIMunicipalities(item));
  } catch (err) {
    console.error("Error cargando municipios:", err);
    return [];
  }
}

export async function eventTypes() {
  try {
    const res = await fetch(`${URL_BASE}/v1.0/eventType`);
    const data = await res.json();
    return data.map((item) => new APIType(item));
  } catch (err) {
    console.error("Error cargando tipos:", err);
    return [];
  }
}

export async function events(elemets, page, day, month, municipalityId, provinceId, type, year) {
  try {
    const provinceList = await provinces();
    const provinceMap = new Map(provinceList.map((p) => [p.id, p]));

    const params = new URLSearchParams();
    if (elemets != null) params.set("_elements", elemets);
    if (page != null) params.set("_page", page);
    if (day != null) params.set("day", day);
    if (month != null) params.set("month", month);
    if (municipalityId != null) params.set("municipalityNoraCode", municipalityId);
    if (provinceId != null) params.set("provinceNoraCode", provinceId);
    if (type != null) params.set("type", type);
    if (year != null) params.set("year", year);

    const res = await fetch(`${URL_BASE}/v1.0/events?${params.toString()}`);
    const data = await res.json();

    if (!data.items) return [];

    return data.items.map((item) => new APIEvent(item, provinceMap));
  } catch (err) {
    console.error("Error cargando eventos:", err);
    return [];
  }
}

export async function eventById(id) {
  try {
    const provinceList = await provinces();
    const provinceMap = new Map(provinceList.map((p) => [p.id, p]));

    const res = await fetch(`${URL_BASE}/v1.0/events/${id}`);
    const data = await res.json();

    return new APIEvent(data, provinceMap);
  } catch (err) {
    console.error("Error cargando evento por id:", err);
    return null;
  }
}