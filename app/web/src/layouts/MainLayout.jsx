import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

import './MainLayout.css'

export default function MainLayout({ children }) {
  return (
    <div className="layout">
      <Sidebar />

      <div className="layout-content">
        <Header />

        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
}