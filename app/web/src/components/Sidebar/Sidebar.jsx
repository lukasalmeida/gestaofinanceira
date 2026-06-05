import {
  MdDashboard,
  MdCategory,
  MdPayments,
  MdPeople,
  MdLogout,
  MdMenu,
  MdClose,
} from "react-icons/md";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import "./Sidebar.css";
import { useAuth } from "../../contexts/AuthContext";

export default function Sidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: MdDashboard, label: "Dashboard", path: "/" },
    { icon: MdCategory, label: "Categorias", path: "/categories" },
    { icon: MdPayments, label: "Transações", path: "/transactions" },
    { icon: MdPeople, label: "Usuários", path: "/users" },
  ];

  function handleLogout() {
    signOut();
    navigate("/login");
  }

  function closeMobileMenu() {
    setIsOpen(false);
  }

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <MdClose /> : <MdMenu />}
      </button>

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">💰</div>
            <div className="logo-text">
              <h1>FinanceFlow</h1>
              <p>Gestão Inteligente</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={closeMobileMenu}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {isActive && <div className="nav-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout} title="Sair">
            <MdLogout />
            <span className="logout-label">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}