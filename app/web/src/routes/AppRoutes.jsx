import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/login/Login"
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import Categories from "../pages/Categories";
import Transactions from "../pages/Transactions";
import Users from "../pages/Users";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}