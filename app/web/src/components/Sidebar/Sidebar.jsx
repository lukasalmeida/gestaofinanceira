import {
  MdDashboard,
  MdCategory,
  MdPayments,
  MdPeople,
  MdLogout
} from "react-icons/md";

import { Link, useNavigate } from "react-router-dom";

import "./Sidebar.css";
import { useAuth } from "../../contexts/AuthContext";

export default function Sidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        Gestão Financeira
      </div>

      <nav>
        <Link to="/">
          <MdDashboard />
          Dashboard
        </Link>

        <Link to="/categories">
          <MdCategory />
          Categorias
        </Link>

        <Link to="/transactions">
          <MdPayments />
          Transações
        </Link>

        <Link to="/users">
          <MdPeople />
          Usuários
        </Link>
      </nav>

      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        <MdLogout />
        Sair
      </button>
    </aside>
  );
}