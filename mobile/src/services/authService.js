import apiClient from '../api/apiClient';
import { saveToken, saveUser, clearAll } from '../utils/storage';

export const register = async ({ name, email, password }) => {
  const response = await apiClient.post('/api/auth/register', {
    name,
    email,
    password,
  });
  return response.data;
};

export const login = async ({ email, password }) => {
  const response = await apiClient.post('/api/auth/login', {
    email,
    password,
  });
  const { token, ...user } = response.data;
  if (token) {
    await saveToken(token);
    await saveUser(user);
  }
  return response.data;
};

export const logout = async () => {
  await clearAll();
};
