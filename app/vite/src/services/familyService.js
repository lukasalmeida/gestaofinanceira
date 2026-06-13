import { api } from 'api/api';

export async function getMyFamily() {
  const response = await api.get('/families/me');
  return response.data;
}

export async function createFamily(name) {
  const response = await api.post('/families/create', name ? { name } : {});
  return response.data;
}

export async function joinFamily(token) {
  const response = await api.post('/families/join', { token: token.trim().toUpperCase() });
  return response.data;
}

export async function rotateFamilyToken() {
  const response = await api.post('/families/rotate-token');
  return response.data;
}

export async function removeFamilyMember(memberId) {
  const response = await api.delete(`/families/members/${memberId}`);
  return response.data;
}
