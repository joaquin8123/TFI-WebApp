import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("asd");
    try {
      const response = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const result = await response.json(); // Convierte la respuesta a JSON

      if (result.success && result.data && result.data.token) {
        console.log("result.data.token", result.data.token);
        //onLogin(result.data.token); // Usa el token
        navigate("/home"); // Redirige a la página principal
      } else {
        setError(result.msg || "Error desconocido"); // Maneja un mensaje de error genérico
      }
    } catch (err) {
      console.error(err.message);
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleLogin}>
        <h1 className="text-2xl mb-4">Iniciar sesión</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border w-full mb-4 p-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full mb-4 p-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;
