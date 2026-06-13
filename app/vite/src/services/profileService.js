import { api } from 'api/api';

export async function getProfile() {
  const response = await api.get('/profile/me');
  return response.data;
}

export async function updateProfile(data) {
  const response = await api.put('/profile/me', data);
  return response.data;
}

export async function updateAvatar(avatarUrl) {
  const response = await api.put('/profile/me/avatar', { avatarUrl });
  return response.data;
}

export async function updatePassword(data) {
  const response = await api.put('/profile/me/password', data);
  return response.data;
}
