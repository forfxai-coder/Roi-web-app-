import api from './api';
import { setToken, setUser } from '../utils/token';

/**
 * Authenticate with Telegram initData
 */
export async function telegramLogin(initData) {
  try {
    if (!initData || initData.trim().length === 0) {
      throw new Error('Telegram initData is required');
    }

    console.log('Sending login request to:', api.defaults.baseURL + '/auth/telegram');
    const response = await api.post('/auth/telegram', { initData });
    console.log('Login response received:', response.status);
    
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
    console.error('Login error:', error);
    // Provide more specific error messages
    if (error.response) {
      const errorMsg = error.response.data?.error || error.message;
      console.error('Backend error:', errorMsg, 'Status:', error.response.status);
      throw new Error(errorMsg);
    } else if (error.request) {
      console.error('Network error - no response received');
      throw new Error('Network error. Please check your connection and try again.');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      throw new Error('Request timed out. Please try again.');
    } else {
      console.error('Unknown error:', error);
      throw error;
    }
  }
}

