import { api } from "../api/api";

export async function getCategories() {
  const response = await api.get("/categories");
  return response.data;
}