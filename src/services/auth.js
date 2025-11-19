import api from './api';
import { setToken, setUser } from '../utils/token';

/**
 * Authenticate with Telegram initData
 */
export async function telegramLogin(initData) {
  try {
    const response = await api.post('/auth/telegram', { initData });
    
    if (response.data.success) {
      // Store token and user data
      setToken(response.data.token);
      setUser(response.data.user);
      
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    }
    
    throw new Error('Authentication failed');
  } catch (error) {
    throw error;
  }
}

