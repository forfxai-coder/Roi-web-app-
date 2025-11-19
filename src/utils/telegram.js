import { WebApp } from '@twa-dev/sdk';

/**
 * Check if Telegram WebApp is available
 */
export function isTelegramWebApp() {
  try {
    // First check: window.Telegram.WebApp (from telegram.org/js/telegram-web-app.js script)
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tgWebApp = window.Telegram.WebApp;
      // In Telegram, version will be set
      if (tgWebApp.version) {
        return true;
      }
    }
    
    // Second check: @twa-dev/sdk WebApp
    if (typeof WebApp !== 'undefined' && WebApp) {
      // Check if platform is set and not 'unknown'
      if (WebApp.platform && WebApp.platform !== 'unknown') {
        return true;
      }
      // Also check if version exists (indicates Telegram environment)
      if (WebApp.version) {
        return true;
      }
    }
    
    return false;
  } catch (e) {
    console.error('Error checking Telegram WebApp:', e);
    return false;
  }
}

/**
 * Initialize Telegram WebApp
 */
export function initTelegramWebApp() {
  try {
    // Try window.Telegram.WebApp first (from script tag)
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tgWebApp = window.Telegram.WebApp;
      tgWebApp.ready();
      tgWebApp.expand();
      tgWebApp.enableClosingConfirmation();
      console.log('Initialized Telegram WebApp via window.Telegram.WebApp');
      return tgWebApp;
    }
    
    // Fallback to @twa-dev/sdk
    if (isTelegramWebApp() && typeof WebApp !== 'undefined') {
      WebApp.ready();
      WebApp.expand();
      WebApp.enableClosingConfirmation();
      console.log('Initialized Telegram WebApp via @twa-dev/sdk');
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

    // Try window.Telegram.WebApp first (from script tag - most reliable)
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tgWebApp = window.Telegram.WebApp;
      if (tgWebApp.initData && tgWebApp.initData.trim().length > 0) {
        console.log('Found initData in window.Telegram.WebApp.initData');
        return tgWebApp.initData;
      }
      console.log('window.Telegram.WebApp.initData:', tgWebApp.initData || 'empty');
    }

    // Try @twa-dev/sdk WebApp.initData
    if (typeof WebApp !== 'undefined' && WebApp) {
      if (WebApp.initData && WebApp.initData.trim().length > 0) {
        console.log('Found initData in WebApp.initData');
        return WebApp.initData;
      }
      console.log('WebApp.initData:', WebApp.initData || 'empty');
    }
    
    // Debug: Log what we have
    console.log('=== Debug Info ===');
    console.log('window.Telegram exists:', typeof window !== 'undefined' && !!window.Telegram);
    if (typeof window !== 'undefined' && window.Telegram) {
      console.log('window.Telegram.WebApp:', window.Telegram.WebApp);
      console.log('window.Telegram.WebApp.version:', window.Telegram.WebApp?.version);
      console.log('window.Telegram.WebApp.platform:', window.Telegram.WebApp?.platform);
      console.log('window.Telegram.WebApp.initData:', window.Telegram.WebApp?.initData || 'empty');
    }
    if (typeof WebApp !== 'undefined') {
      console.log('WebApp.platform:', WebApp.platform);
      console.log('WebApp.version:', WebApp.version);
      console.log('WebApp.initDataUnsafe:', WebApp.initDataUnsafe);
    }
    console.log('==================');
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

