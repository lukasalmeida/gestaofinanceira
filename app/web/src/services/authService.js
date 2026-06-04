import { api } from "../api/api";

export async function login(email, password) {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
}