import { useState } from "react";

function Header() {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  // Detecta la página activa comparando el nombre del archivo en la URL,
  // igual que hacía la función navLink() original.
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  function handleLogout() {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    window.location.href = "index.html";
  }

  return (
    <header>
      <nav id="navbar">
        <div className="nav-left">
          <a href="index.html" className="nav-logo">
            <img src="assets/img/planes.png" alt="Planes Fav logo" className="logo" />
          </a>
        </div>

        <div className="nav-links">
          <a href="index.html" className={currentPage === "index.html" ? "active" : ""}>
            Inicio
          </a>
          <a href="favorites.html" className={currentPage === "favorites.html" ? "active" : ""}>
            Favoritos
          </a>
          <a href="about.html" className={currentPage === "about.html" ? "active" : ""}>
            Acerca de
          </a>
        </div>

        <div className="nav-right">
          {currentUser ? (
            <div className="nav-user">
              <span className="nav-username">{currentUser.name}</span>
              <button className="btn-logout" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button className="btn-login" onClick={() => (window.location.href = "login.html")}>
              Iniciar sesión
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;