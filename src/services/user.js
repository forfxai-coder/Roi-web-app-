import api from './api';

/**
 * Get user profile with wallet, ROI, investments
 */
export async function getProfile() {
  const response = await api.get('/user/profile');
  return response.data;
}

/**
 * Create deposit request
 */
export async function createDeposit(amount, referrerCode = null) {
  const response = await api.post('/user/deposit', {
    amount: parseFloat(amount),
    referrer_code: referrerCode || undefined,
  });
  return response.data;
}

/**
 * Get deposit history
 */
export async function getDeposits() {
  const response = await api.get('/user/deposits');
  return response.data;
}

/**
 * Create withdrawal request
 */
export async function createWithdraw(amount) {
  const response = await api.post('/user/withdraw', {
    amount: parseFloat(amount),
  });
  return response.data;
}

/**
 * Get withdrawal history
 */
export async function getWithdrawals() {
  const response = await api.get('/withdrawals');
  return response.data;
}

/**
 * Get referrals tree (15 levels)
 */
export async function getReferrals() {
  const response = await api.get('/user/referrals');
  return response.data;
}

/**
 * Get transactions
 */
export async function getTransactions(type = null, status = null, limit = 50) {
  const params = { limit };
  if (type) params.type = type;
  if (status) params.status = status;
  
  const response = await api.get('/user/transactions', { params });
  return response.data;
}

