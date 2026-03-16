import axios from 'axios';
import { getToken } from '../utils/storage';

// Use 10.0.2.2 for Android emulator (maps to host machine localhost)
// Change to your machine's local IP when testing on a physical device
const BASE_URL = 'https://spendsense-9n1f.onrender.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: attach JWT token to every request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: normalise error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
