import React, { useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name.includes("password") || name.includes("Confirm")) {
      setError(false);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError(true);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find((u) => u.email === email)) {
      alert("Este correo ya está registrado.");
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Usuario registrado con éxito");
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
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
      alert(`Bienvenido, ${user.name}!`);
      window.location.href = "/";
    } else {
      alert("Correo electrónico o contraseña incorrectos");
    }
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <form id="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Entrar</button>
          <p>
            ¿No tienes cuenta?{" "}
            <span
              onClick={() => setIsLogin(false)}
              style={{ cursor: "pointer", color: "blue" }}
            >
              Regístrate
            </span>
          </p>
        </form>
      ) : (
        <form id="register-form" onSubmit={handleRegister}>
          <h2>Registro</h2>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
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
            placeholder="Repetir contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && (
            <p style={{ color: "red" }}>Las contraseñas no coinciden</p>
          )}

          <button type="submit">Registrarse</button>
          <p>
            ¿Ya tienes cuenta?{" "}
            <span
              onClick={() => setIsLogin(true)}
              style={{ cursor: "pointer", color: "blue" }}
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
