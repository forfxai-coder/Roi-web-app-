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
 * Tries multiple methods to get initData
 */
export function getInitData() {
  try {
    // First, try to get from URL parameters (sometimes Telegram passes it there)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlInitData = urlParams.get('tgWebAppData') || urlParams.get('initData');
      if (urlInitData && urlInitData.trim().length > 0) {
        console.log('Found initData in URL parameters');
        return urlInitData;
      }
    }

    if (isTelegramWebApp()) {
      // Try @twa-dev/sdk WebApp.initData first
      if (WebApp.initData && WebApp.initData.trim().length > 0) {
        console.log('Found initData in WebApp.initData');
        return WebApp.initData;
      }
      
      // Fallback: Try window.Telegram.WebApp.initData (legacy API)
      if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
        const legacyInitData = window.Telegram.WebApp.initData;
        if (legacyInitData && legacyInitData.trim().length > 0) {
          console.log('Found initData in window.Telegram.WebApp.initData');
          return legacyInitData;
        }
      }
      
      // Debug: Log what we have
      console.log('WebApp.initData:', WebApp.initData);
      console.log('WebApp.initDataUnsafe:', WebApp.initDataUnsafe);
      if (typeof window !== 'undefined' && window.Telegram) {
        console.log('window.Telegram.WebApp:', window.Telegram.WebApp);
        console.log('window.Telegram.WebApp.initData:', window.Telegram.WebApp?.initData);
      }
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

