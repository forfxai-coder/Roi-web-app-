import api from './api';
import { setToken, setUser } from '../utils/token';

/**
 * Authenticate with Telegram initData
 */
export async function telegramLogin(initData) {
  try {
    if (!initData) {
      throw new Error('Telegram initData is required');
    }

    const response = await api.post('/auth/telegram', { initData });
    
    if (response.data.success && response.data.token && response.data.user) {
      // Store token and user data
      setToken(response.data.token);
      setUser(response.data.user);
      
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    }
    
    throw new Error(response.data.error || 'Authentication failed');
  } catch (error) {
    // Provide more specific error messages
    if (error.response) {
      const errorMsg = error.response.data?.error || error.message;
      throw new Error(errorMsg);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw error;
    }
  }
}

