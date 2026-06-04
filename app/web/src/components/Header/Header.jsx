import { useAuth } from "../../contexts/AuthContext";

import "./Header.css";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="header">
      <h2>Dashboard</h2>

      <div className="user-info">
        <strong>{user?.name}</strong>
        <span>{user?.email}</span>
      </div>
    </header>
  );
}