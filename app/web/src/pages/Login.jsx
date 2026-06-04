import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

import { Navigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthenticated } = useAuth();
  if(isAuthenticated) {
    return <Navigate to="/" />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const data = await login(email, password);

      await signIn(data);

      navigate("/");
    } catch (error) {
      alert("Usuário ou senha inválidos");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">
        Entrar
      </button>
    </form>
  );
}