import axios from 'axios';
import { supabase } from './supabaseClient';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token from localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('traceback_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (expired token, etc.)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token may be expired — clean up and redirect to login
      localStorage.removeItem('traceback_token');
      localStorage.removeItem('traceback_user');
      // Only redirect if not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;

// ========== Auth API ==========
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  me: () => API.get('/auth/me'),
};

// ========== Items API ==========
export const itemsAPI = {
  getAll: () => API.get('/items'),
  getById: (id) => API.get(`/items/${id}`),
  create: (itemData) => API.post('/items', itemData),
  update: (id, itemData) => API.put(`/items/${id}`, itemData),
  delete: (id) => API.delete(`/items/${id}`),
};

// ========== Claims API ==========
export const claimsAPI = {
  submit: (itemId, claimData) => API.post(`/items/${itemId}/claims`, claimData),
  getMyClaims: () => API.get('/claims/my-claims'),
  getAllClaims: () => API.get('/admin/claims'),
  updateStatus: (claimId, status) =>
    API.put(`/admin/claims/${claimId}/status?status=${status}`),
};

// ========== Upload API ==========
export const uploadAPI = {
  uploadImage: async (file) => {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    // Upload to Supabase 'items' bucket
    const { data, error } = await supabase.storage
      .from('items')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('items')
      .getPublicUrl(filePath);

    // Return in the same format the UI expects: { data: { url: ... } }
    return { data: { url: publicUrl } };
  },
};
