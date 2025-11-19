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

        // Wait a bit for Telegram WebApp to fully initialize
        // Sometimes initData isn't available immediately
        await new Promise(resolve => setTimeout(resolve, 100));

        // Try to get initData with retries
        let initData = getInitData();
        let retries = 3;
        
        while (!initData && retries > 0) {
          console.log(`Waiting for initData... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 200));
          initData = getInitData();
          retries--;
        }

        console.log('initData received:', initData ? 'Yes (length: ' + initData.length + ')' : 'No');
        console.log('WebApp object:', typeof WebApp !== 'undefined' ? 'Available' : 'Not available');
        if (typeof WebApp !== 'undefined') {
          console.log('WebApp.initData:', WebApp.initData ? 'Has data' : 'Empty');
          console.log('WebApp.initDataUnsafe:', WebApp.initDataUnsafe ? 'Has data' : 'Empty');
        }
        
        // Check if initData exists and is not empty
        if (initData && initData.trim().length > 0) {
          console.log('Attempting login...');
          const result = await telegramLogin(initData);
          console.log('Login successful:', result);
          setTokenState(result.token);
          setUserState(result.user);
        } else {
          console.error('No valid initData available after retries');
          console.error('This might be a Telegram WebApp configuration issue.');
          setError('Unable to get Telegram authentication data. Please make sure you opened this app from your Telegram bot.');
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

