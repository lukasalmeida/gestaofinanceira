import { api } from "../api/api";

export async function getTransactions() {
  const response = await api.get("/transactions");
  return response.data;
}

export async function createTransaction(data) {
  try {
    const response = await api.post("/transactions", data);
    return response.data;
  } catch (error) {
    console.log(error.response?.data);
    throw error;
  }
}