import axios from 'axios';

const api = axios.create({
  baseURL: 'https://boscobags-account-server.onrender.com/api',
});

// Interceptor to add token to requests
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
