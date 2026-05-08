import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find((u) => u.email === email)) {
      setError("Este correo ya está registrado.");
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Usuario registrado con éxito. Ya puedes iniciar sesión.");
    setIsLogin(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      if (onLogin) onLogin(user);
      navigate("/");
    } else {
      setError("Correo electrónico o contraseña incorrectos");
    }
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <form id="login-form" onSubmit={handleLogin}>
          <h2>Iniciar Sesión</h2>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <p style={{ color: "#f43f5e", fontSize: "0.9rem" }}>{error}</p>}
          <button type="submit" className="btn-auth">Entrar</button>
          <p>
            ¿No tienes cuenta?{" "}
            <span
              onClick={() => setIsLogin(false)}
              style={{ cursor: "pointer", color: "#6366f1", fontWeight: "600" }}
            >
              Regístrate aquí
            </span>
          </p>
        </form>
      ) : (
        <form id="register-form" onSubmit={handleRegister}>
          <h2>Crear Cuenta</h2>
          <input
            type="text"
            name="name"
            placeholder="Tu nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && <p style={{ color: "#f43f5e", fontSize: "0.9rem" }}>{error}</p>}

          <button type="submit" className="btn-auth">Registrarse</button>
          <p>
            ¿Ya tienes cuenta?{" "}
            <span
              onClick={() => setIsLogin(true)}
              style={{ cursor: "pointer", color: "#6366f1", fontWeight: "600" }}
            >
              Inicia sesión
            </span>
          </p>
        </form>
      )}
    </div>
  );
};

export default Auth;
