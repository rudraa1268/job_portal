import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let csrfInitialized = false;
let csrfToken = null;

export async function initCsrf() {
  if (csrfInitialized) return;
  const response = await api.get('/auth/csrf/');
  csrfToken = response.data.csrfToken;
  csrfInitialized = true;
}

api.interceptors.request.use((config) => {
  if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

export default api;