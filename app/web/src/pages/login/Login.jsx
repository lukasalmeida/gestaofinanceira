import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";

import { Navigate } from "react-router-dom";

import { logo } from "../../assets/"

import "./Login.css"

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
                    <span className="btn-text">Entrar</span>
                    <div className="btn-loader">
                        <div className="spinner"></div>
                    </div>
                </button>
            </form>

            <div className="security-notice">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L3 3v4.5c0 2.89 2 5.5 5 6 3-0.5 5-3.11 5-6V3l-5-2z" stroke="#10B981" stroke-width="1.5" fill="none"/>
                    <path d="M6 8l1.5 1.5L11 6" stroke="#10B981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Your connection is secured with 256-bit SSL encryption</span>
            </div>

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