import { api } from 'api/api';

export async function getTransactions(params) {
  const response = await api.get('/transactions', { params });
  return response.data;
}

export async function createTransaction(data) {
  const response = await api.post('/transactions', data);
  return response.data;
}
