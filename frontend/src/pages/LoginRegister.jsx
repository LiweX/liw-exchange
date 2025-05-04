import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Asegúrate de que la ruta sea correcta

export default function LoginRegister() {
  const [mode, setMode] = useState("login"); // "login" o "register"
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "register") {
        const res = await fetch("/api/users/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error("Error al registrar");
        alert("Usuario registrado con éxito");
        setMode("login");
      } else {
        const res = await fetch("/api/users/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        });

        if (!res.ok) throw new Error("Credenciales incorrectas");
        const data = await res.json();
        login(data.access);
        alert("Login exitoso");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>{mode === "login" ? "Login" : "Registro"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Usuario"
          onChange={handleChange}
          required
        />
        {mode === "register" && (
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
        )}
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
        />
        <button type="submit">
          {mode === "login" ? "Iniciar sesión" : "Registrarse"}
        </button>
      </form>
      <p style={{ color: "red" }}>{error}</p>
      <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
        Cambiar a {mode === "login" ? "registro" : "login"}
      </button>
    </div>
  );
}
