import { useAuth } from "../../contexts/AuthContext";
import "./Header.css";
import {
  MdDarkMode,
  MdLightMode
} from "react-icons/md";
import { useTheme } from "../../contexts/ThemeContext";


export default function Header() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <h2>Dashboard</h2>

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
    </header>
  );
}