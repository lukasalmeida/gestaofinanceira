import { api } from 'api/api';

export async function getCategories() {
  const response = await api.get('/categories');
  return response.data;
}

export async function createCategory(name, type) {
  const response = await api.post('/categories', { name, type });
  return response.data;
}

export async function updateCategory(id, name, type) {
  const response = await api.put(`/categories/${id}`, { name, type });
  return response.data;
}

export async function deleteCategory(id) {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
}
