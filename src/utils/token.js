import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../config/constants';

/**
 * Store JWT token in localStorage
 */
export function setToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

/**
 * Get JWT token from localStorage
 */
export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

/**
 * Remove JWT token from localStorage
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/**
 * Store user data in localStorage
 */
export function setUser(user) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

/**
 * Get user data from localStorage
 */
export function getUser() {
  const userStr = localStorage.getItem(USER_STORAGE_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Remove user data from localStorage
 */
export function removeUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
}

/**
 * Clear all auth data
 */
export function clearAuth() {
  removeToken();
  removeUser();
}

