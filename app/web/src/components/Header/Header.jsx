import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import {
  MdDarkMode,
  MdLightMode,
} from "react-icons/md";
import { useTheme } from "../../contexts/ThemeContext";

export default function Header() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/categories":
        return "Categorias";
      case "/transactions":
        return "Transações";
      case "/users":
        return "Usuários";
      default:
        return "FinanceFlow";
    }
  };

  const getPageDescription = () => {
    switch (location.pathname) {
      case "/":
        return "Visão geral das suas finanças";
      case "/categories":
        return "Gerencie suas categorias";
      case "/transactions":
        return "Controle suas transações";
      case "/users":
        return "Gerencie os usuários";
      default:
        return "";
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>{getPageTitle()}</h1>
          <p>{getPageDescription()}</p>
        </div>

        <div className="header-actions">
          <button className="theme-btn" onClick={toggleTheme} title="Alternar tema">
            {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
          </button>

          <div className="user-card">
            <div className="user-info">
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}