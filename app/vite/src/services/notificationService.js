import { api } from 'api/api';

export async function getBillDueNotifications() {
  const response = await api.get('/notifications/bills-due');
  return response.data;
}

export async function markNotificationsRead(keys) {
  const response = await api.post('/notifications/mark-read', { keys });
  return response.data;
}

export async function markAllNotificationsRead() {
  const response = await api.post('/notifications/mark-all-read');
  return response.data;
}
