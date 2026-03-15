import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, saveToken, saveUser, clearAll } from '../utils/storage';
import { login as loginService, register as registerService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app start
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await getToken();
        const storedUser = await getUser();
        if (storedToken) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (e) {
        console.error('Failed to restore session:', e);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (credentials) => {
    const data = await loginService(credentials);
    const { token: newToken, ...userData } = data;
    setToken(newToken);
    setUser(userData);
    return data;
  };

  const register = async (details) => {
    return await registerService(details);
  };

  const logout = async () => {
    await clearAll();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
