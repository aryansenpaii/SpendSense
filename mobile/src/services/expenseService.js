import apiClient from '../api/apiClient';

export const getAllExpenses = async () => {
  const response = await apiClient.get('/api/expenses');
  return response.data;
};

export const addExpense = async ({ amount, description, date, categoryId }) => {
  const response = await apiClient.post('/api/expenses', {
    amount,
    description,
    date,
    categoryId,
  });
  return response.data;
};

export const updateExpense = async (id, { amount, description, date, categoryId }) => {
  const response = await apiClient.put(`/api/expenses/${id}`, {
    amount,
    description,
    date,
    categoryId,
  });
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await apiClient.delete(`/api/expenses/${id}`);
  return response.data;
};

export const getExpensesByCategory = async (categoryName) => {
  const response = await apiClient.get(`/api/expenses/category/${categoryName}`);
  return response.data;
};
