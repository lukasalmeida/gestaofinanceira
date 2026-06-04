import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

import './MainLayout.css'

export default function MainLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
        }}
      >
        <Header />

        <main
          style={{
            padding: "24px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}