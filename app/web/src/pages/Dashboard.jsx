import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();

  const { user, signOut } = useAuth();

  function handleLogout() {
    signOut();

    navigate("/login");
  }

  return (
    <>
      <h1>Dashboard</h1>

      <p>Bem-vindo, {user?.name}</p>

      <button onClick={handleLogout}>
        Sair
      </button>
    </>
  );
}