import { api } from 'api/api';

export async function getBills(params = {}) {
  const query = {};

  if (params.dueDay) query.dueDay = params.dueDay;
  if (params.minAmount !== undefined && params.minAmount !== '') query.minAmount = params.minAmount;
  if (params.maxAmount !== undefined && params.maxAmount !== '') query.maxAmount = params.maxAmount;

  const response = await api.get('/bills', { params: query });
  return response.data;
}

export async function getBillById(id) {
  const response = await api.get(`/bills/${id}`);
  return response.data;
}

export async function createBill(data) {
  const response = await api.post('/bills', data);
  return response.data;
}

export async function updateBill(id, data) {
  const response = await api.put(`/bills/${id}`, data);
  return response.data;
}

export async function deleteBill(id) {
  const response = await api.delete(`/bills/${id}`);
  return response.data;
}
