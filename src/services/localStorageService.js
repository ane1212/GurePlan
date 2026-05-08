/**
 * @file localStorageService.js
 * @description Servicio para la gestión de la persistencia local de usuarios y favoritos.
 */

/**
 * Obtiene la lista de usuarios registrados.
 * @returns {Array<Object>} Lista de usuarios.
 */
export function getUsers() {
    const date = localStorage.getItem('users');
    return date ? JSON.parse(date) : [];
}

/**
 * Registra un nuevo usuario en el sistema.
 * @param {Object} newUser - Datos del nuevo usuario (nombre, email, password).
 * @returns {Object} Resultado de la operación {success: boolean, message: string}.
 */
export function registerUser(newUser) {
    const users = getUsers();
    const exists = users.find(user => user.email === newUser.email);
    if (exists) {
        return { success: false, message: "Correo electrónico ya registrado" };
    }
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: "Usuario registrado exitosamente" };
}

/**
 * Valida las credenciales de un usuario.
 * @param {string} email - Correo del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Object|null} El objeto usuario si el login es correcto, null en caso contrario.
 */
export function loginUser(email, password) {
    const users = getUsers();
    const foundUser = users.find(user => user.email === email && user.password === password);
    return foundUser || null;
}

/**
 * Obtiene la lista de eventos favoritos del usuario actual.
 * @returns {Array<Object>} Lista de eventos favoritos.
 */
export function getFavorites() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return [];
    const key = `favorites_${currentUser.email}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

/**
 * Añade o elimina un evento de la lista de favoritos del usuario actual.
 * @param {Object} event - El objeto evento a modificar.
 * @returns {Object} Resultado {success: boolean, isFavorite: boolean, message?: string}.
 */
export function toggleFavorites(event) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return { success: false, message: "Debes iniciar sesión" };
    const key = `favorites_${currentUser.email}`;
    const favorites = getFavorites();
    const index = favorites.findIndex(fav => fav.id === event.id);
    if (index === -1) {
        favorites.push(event);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem(key, JSON.stringify(favorites));
    return { success: true, isFavorite: index === -1 };
}

/**
 * Comprueba si un evento específico está en la lista de favoritos.
 * @param {string|number} eventId - ID del evento a comprobar.
 * @returns {boolean} True si es favorito, false en caso contrario.
 */
export function isFavorite(eventId) {
    return getFavorites().some(fav => fav.id === eventId);
}