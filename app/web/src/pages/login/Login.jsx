import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";

import { Navigate } from "react-router-dom";

import { logo } from "../../assets/"

import "./Login.css"

import { getApiHealth } from "../../services/healthService";

import { APP_CONFIG } from "../../config/app";

export default function Login() {

  const navigate = useNavigate();

  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [apiStatus, setApiStatus] = useState("Verificando...");
  const [apiColors, setApiColors] = useState("security-notice")

  useEffect(() => {
    const checkHealth = async () => {
    const start = performance.now();

    try {
        await getApiHealth();

        const latency = Math.round(performance.now() - start);

        setApiStatus(`🟢 Online (${latency}ms)`);
        setApiColors("security-notice-online");
    } catch {
        setApiStatus("❌ Offline");
        setApiColors("security-notice-offline");

    }
  };

    checkHealth();
  }, []);

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
    <div className="login-container">
        <div className="login-card">
            <div className="login-header">
                <div className="logo">
                    <img src={ logo } alt="" width="200px" />
                </div>
            </div>
            
            <form className="login-form" id="loginForm" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <span className="error-message" id="emailError"></span>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Senha</label>
                    <div className="password-wrapper">
                        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <span className="error-message" id="passwordError"></span>
                </div>

                {/* <div className="form-options">
                    <label className="checkbox-wrapper">
                        <input type="checkbox" id="remember" name="remember"/>
                        <span className="checkmark"></span>
                        Remember this device
                    </label>
                    <a href="#" className="forgot-link">Reset password</a>
                </div> */}

                <button type="submit" className="login-btn">
                    <span className="btn-text">➜] Entrar</span>
                    <div className="btn-loader">
                        <div className="spinner"></div>
                    </div>
                </button>
            </form>

            <div className={apiColors}>
                <span>Status da API ⋮ <b> {apiStatus}</b></span>
            </div>

            <footer className="rodape"><a className="rodapeA" href={APP_CONFIG.gitHubProject}>{APP_CONFIG.name}</a> | v.{APP_CONFIG.version} <br /> Desenvolvido por: <a href={APP_CONFIG.gitHubAuthor} className="rodapeA">{APP_CONFIG.company}</a> (<a href={APP_CONFIG.linkedIn} className="rodapeA">{APP_CONFIG.author}</a>) </footer>

            <div className="success-message" id="successMessage">
                <div className="success-icon">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <circle cx="14" cy="14" r="14" fill="#10B981"/>
                        <path d="M9 14l3 3 7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3>Welcome back</h3>
                <p>Taking you to your dashboard...</p>
            </div>
        </div>
    </div>
  );
}