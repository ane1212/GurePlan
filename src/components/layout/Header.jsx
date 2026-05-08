import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  const currentPage = window.location.pathname;

  function handleLogout() {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/");
  }

  return (
    <header className="main-nav">
      <nav id="navbar" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="nav-left">
          <Link to="/" className="nav-brand">
            <img src="assets/img/planes.png" alt="GurePlan" className="logo" style={{ height: '40px' }} />
          </Link>
          <div className="nav-links">
            <Link to="/" className={currentPage === "/" ? "active" : ""}>
              Inicio
            </Link>
            <Link to="/favorites" className={currentPage === "/favorites" ? "active" : ""}>
              Favoritos
            </Link>
            <Link to="/about" className={currentPage === "/about" ? "active" : ""}>
              Acerca de
            </Link>
          </div>
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
            <button className="btn-login" onClick={() => navigate("/login")}>
              Iniciar sesión
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;