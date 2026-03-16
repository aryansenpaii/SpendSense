import apiClient from '../api/apiClient';

export const getAllCategories = async () => {
  try {
    const response = await apiClient.get('/api/categories');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to fetch categories');
  }
};

export const addCategory = async (name) => {
  try {
    const response = await apiClient.post('/api/categories', { name });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to add category');
  }
};
