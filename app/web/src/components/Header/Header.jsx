import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import {
  MdDarkMode,
  MdLightMode,
  MdLogout
} from "react-icons/md";
import { useTheme } from "../../contexts/ThemeContext";

export default function Header() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate("/login");
  }



  return (

    <header className="header">
      <h2 className="title">Dashboard</h2>

      <div className="user-info">
        <strong>{user?.name}</strong>
        <span>{user?.email}</span>
      </div>
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
      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        <MdLogout />
      </button>
    </header>
  );
}