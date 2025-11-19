import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, setToken, setUser, clearAuth } from '../utils/token';
import { telegramLogin } from '../services/auth';
import { getInitData } from '../utils/telegram';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-login on mount using Telegram initData
  useEffect(() => {
    async function autoLogin() {
      try {
        // Check if we have a stored token
        const storedToken = getToken();
        const storedUser = getUser();

        if (storedToken && storedUser) {
          setTokenState(storedToken);
          setUserState(storedUser);
          setLoading(false);
          return;
        }

        // Try to login with Telegram initData
        const initData = getInitData();
        if (initData) {
          const result = await telegramLogin(initData);
          setTokenState(result.token);
          setUserState(result.user);
        } else {
          // Don't set error if we're not in Telegram - that's expected
          // The UI will handle showing appropriate message
          setError(null);
        }
      } catch (err) {
        console.error('Auto-login failed:', err);
        setError(err.message || 'Authentication failed');
        clearAuth();
      } finally {
        setLoading(false);
      }
    }

    autoLogin();
  }, []);

  const login = async (initData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await telegramLogin(initData);
      setTokenState(result.token);
      setUserState(result.user);
      return result;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    setTokenState(null);
    setUserState(null);
  };

  const updateUser = (userData) => {
    setUser(userData); // Store in localStorage
    setUserState(userData); // Update state
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

