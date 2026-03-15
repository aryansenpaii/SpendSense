import apiClient from '../api/apiClient';

export const getMonthlySummary = async () => {
  const response = await apiClient.get('/api/analytics/monthly-summary');
  return response.data;
};

export const getCategorySummary = async () => {
  const response = await apiClient.get('/api/analytics/category-summary');
  return response.data;
};
