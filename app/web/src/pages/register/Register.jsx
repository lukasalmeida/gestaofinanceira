import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { register } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";

import { Navigate } from "react-router-dom";

import { logo } from "../../assets/"

import "./Register.css"

import { getApiHealth } from "../../services/healthService";

import { APP_CONFIG } from "../../config/app";

import {
    MdDarkMode,
    MdLightMode
} from "react-icons/md";
import { useTheme } from "../../contexts/ThemeContext";

export default function Register() {

    const navigate = useNavigate();

    const { signIn } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [apiStatus, setApiStatus] = useState("Verificando...");
    const [apiColors, setApiColors] = useState("security-notice");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuth();

    const { theme, toggleTheme } = useTheme();

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
    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Validação básica
            if (password !== confirmPassword) {
                setError("As senhas não coincidem");
                setIsLoading(false);
                return;
            }

            if (password.length < 6) {
                setError("A senha deve ter no mínimo 6 caracteres");
                setIsLoading(false);
                return;
            }

            if (name.length < 3) {
                setError("O nome deve ter no mínimo 3 caracteres");
                setIsLoading(false);
                return;
            }

            const data = await register(name, email, password, confirmPassword);

            await signIn(data, false);

            navigate("/");
        } catch (error) {
            setError(error.response?.data?.error || "Erro ao criar conta. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <div className="logo">
                        <img src={logo} alt="" width="200px" />
                    </div>
                </div>

                <center>
                    <div className="theme-switch" onClick={toggleTheme}>
                        <div className={`switch ${theme}`}>
                            <div className="thumb">
                                {theme === "dark" ? (
                                    <MdDarkMode />
                                ) : (
                                    <MdLightMode />
                                )}
                            </div>
                        </div>
                    </div>
                </center>

                <p>&nbsp;</p>

                <h2 className="register-title">Criar Conta</h2>

                {error && <div className="error-alert">{error}</div>}

                <form className="register-form" id="registerForm" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nome</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <span className="error-message" id="nameError"></span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <span className="error-message" id="emailError"></span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <div className="password-wrapper">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <span className="error-message" id="passwordError"></span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Senha</label>
                        <div className="password-wrapper">
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <span className="error-message" id="confirmPasswordError"></span>
                    </div>

                    <button type="submit" className="register-btn" disabled={isLoading}>
                        <span className="btn-text">
                            {isLoading ? "Criando conta..." : "➜] Criar Conta"}
                        </span>
                        {isLoading && <div className="btn-loader">
                            <div className="spinner"></div>
                        </div>}
                    </button>
                </form>

                <div className="register-footer">
                    <p>Já tem uma conta? <Link to="/login" className="link">Faça login</Link></p>
                </div>

                <div className={apiColors}>
                    <span>Status da API ⋮ <b> {apiStatus}</b></span>
                </div>

                <footer className="rodape"><a className="rodapeA" href={APP_CONFIG.gitHubProject}>{APP_CONFIG.name}</a> | v.{APP_CONFIG.version} <br /> Desenvolvido por: <a href={APP_CONFIG.gitHubAuthor} className="rodapeA">{APP_CONFIG.company}</a> (<a href={APP_CONFIG.linkedIn} className="rodapeA">{APP_CONFIG.author}</a>) </footer>
            </div>
        </div>
    );
}
