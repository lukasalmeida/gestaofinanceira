import { api } from 'api/api';

export async function getTransactions(params = {}) {
  const query = {};

  if (params.page) query.page = params.page;
  if (params.limit) query.limit = params.limit;
  if (params.startDate) query.startDate = params.startDate;
  if (params.endDate) query.endDate = params.endDate;
  if (params.type && params.type !== 'ALL') query.type = params.type;

  const response = await api.get('/transactions', { params: query });
  return response.data;
}

export async function getTransactionsSummary(params = {}) {
  const query = {};

  if (params.startDate) query.startDate = params.startDate;
  if (params.endDate) query.endDate = params.endDate;
  if (params.type && params.type !== 'ALL') query.type = params.type;

  const response = await api.get('/transactions/summary', { params: query });
  return response.data;
}

export async function createTransaction(data) {
  const response = await api.post('/transactions', data);
  return response.data;
}
