import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Accounts
export const getAccounts = () => api.get('/accounts');
export const getAccount = (id) => api.get(`/accounts/${id}`);
export const createAccount = (data) => api.post('/accounts', data);
export const updateAccountStatus = (id, status) => api.patch(`/accounts/${id}/status`, { status });
export const getCustomers = () => api.get('/accounts/admin/customers');

// Transactions
export const deposit = (data) => api.post('/transactions/deposit', data);
export const withdraw = (data) => api.post('/transactions/withdraw', data);
export const transfer = (data) => api.post('/transactions/transfer', data);
export const getTransactions = () => api.get('/transactions');
export const getAccountTransactions = (accountId) => api.get(`/transactions/account/${accountId}`);
