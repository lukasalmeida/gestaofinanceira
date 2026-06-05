import { api } from "../api/api";

export async function login(email, password) {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
}

export async function register(name, email, password, confirmPassword) {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
    confirmPassword,
  });

  return response.data;
}