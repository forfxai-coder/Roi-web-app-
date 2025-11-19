import { WebApp } from '@twa-dev/sdk';

/**
 * Check if Telegram WebApp is available
 */
export function isTelegramWebApp() {
  try {
    // WebApp object exists in Telegram, check if platform is not 'unknown'
    // In Telegram, platform will be 'ios', 'android', 'web', etc., never 'unknown'
    if (typeof WebApp !== 'undefined' && WebApp) {
      return WebApp.platform !== 'unknown';
    }
    // Fallback: check for window.Telegram (legacy Telegram WebApp API)
    return typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp;
  } catch (e) {
    return false;
  }
}

/**
 * Initialize Telegram WebApp
 */
export function initTelegramWebApp() {
  try {
    if (isTelegramWebApp()) {
      WebApp.ready();
      WebApp.expand();
      WebApp.enableClosingConfirmation();
      return WebApp;
    }
  } catch (error) {
    console.warn('Telegram WebApp not available:', error);
  }
  return null;
}

/**
 * Get Telegram WebApp instance
 */
export function getTelegramWebApp() {
  try {
    return isTelegramWebApp() ? WebApp : null;
  } catch (e) {
    return null;
  }
}

/**
 * Get initData from Telegram WebApp
 */
export function getInitData() {
  try {
    if (isTelegramWebApp()) {
      return WebApp.initData || null;
    }
  } catch (e) {
    console.warn('Error getting initData:', e);
  }
  return null;
}

/**
 * Get Telegram user data
 */
export function getTelegramUser() {
  try {
    if (isTelegramWebApp()) {
      return WebApp.initDataUnsafe?.user || null;
    }
  } catch (e) {
    return null;
  }
  return null;
}

/**
 * Show Telegram alert
 */
export function showAlert(message) {
  try {
    if (isTelegramWebApp()) {
      WebApp.showAlert(message);
    } else {
      alert(message);
    }
  } catch (e) {
    alert(message);
  }
}

/**
 * Show Telegram confirm dialog
 */
export function showConfirm(message, callback) {
  try {
    if (isTelegramWebApp()) {
      WebApp.showConfirm(message, callback);
    } else {
      const result = window.confirm(message);
      callback(result);
    }
  } catch (e) {
    const result = window.confirm(message);
    callback(result);
  }
}

/**
 * Set header color
 */
export function setHeaderColor(color) {
  try {
    if (isTelegramWebApp()) {
      WebApp.setHeaderColor(color);
    }
  } catch (e) {
    // Ignore
  }
}

/**
 * Set background color
 */
export function setBackgroundColor(color) {
  try {
    if (isTelegramWebApp()) {
      WebApp.setBackgroundColor(color);
    }
  } catch (e) {
    // Ignore
  }
}

