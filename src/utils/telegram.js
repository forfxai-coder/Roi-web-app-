import { WebApp } from '@twa-dev/sdk';

/**
 * Initialize Telegram WebApp
 */
export function initTelegramWebApp() {
  WebApp.ready();
  WebApp.expand();
  
  // Enable closing confirmation
  WebApp.enableClosingConfirmation();
  
  return WebApp;
}

/**
 * Get Telegram WebApp instance
 */
export function getTelegramWebApp() {
  return WebApp;
}

/**
 * Get initData from Telegram WebApp
 */
export function getInitData() {
  return WebApp.initData;
}

/**
 * Get Telegram user data
 */
export function getTelegramUser() {
  return WebApp.initDataUnsafe?.user || null;
}

/**
 * Show Telegram alert
 */
export function showAlert(message) {
  WebApp.showAlert(message);
}

/**
 * Show Telegram confirm dialog
 */
export function showConfirm(message, callback) {
  WebApp.showConfirm(message, callback);
}

/**
 * Set header color
 */
export function setHeaderColor(color) {
  WebApp.setHeaderColor(color);
}

/**
 * Set background color
 */
export function setBackgroundColor(color) {
  WebApp.setBackgroundColor(color);
}

