export function getUsers() {
    const date = localStorage.getItem('users');
    return date ? JSON.parse(date) : [];
}

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

export function loginUser(email, password) {
    const users = getUsers();
    const foundUser = users.find(user => user.email === email && user.password === password);
    return foundUser || null;
}

export function getFavorites() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return [];
    const key = `favorites_${currentUser.email}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

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

export function isFavorite(eventId) {
    return getFavorites().some(fav => fav.id === eventId);
}