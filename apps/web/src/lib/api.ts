import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('luminary_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const authApi = {
    signup: (data: { name: string; email: string; password: string }) =>
        api.post('/auth/signup', data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
    verifyOtp: (otp: string) =>
        api.post('/auth/verify-otp', { otp }),
    forgotPassword: (email: string) =>
        api.post('/auth/forgot-password', { email }),
};

// Articles
export const articlesApi = {
    getAll: (params: Record<string, string | number>) =>
        api.get('/articles', { params }),
    getBySlug: (slug: string) =>
        api.get(`/articles/${slug}`),
    getRelated: (slug: string) =>
        api.get(`/articles/${slug}/related`),
};

// Users
export const usersApi = {
    getMe: () => api.get('/users/me'),
    updateMe: (data: { name?: string; email?: string }) =>
        api.put('/users/me', data),
    saveArticle: (articleId: string) =>
        api.post(`/users/save/${articleId}`),
    unsaveArticle: (articleId: string) =>
        api.delete(`/users/save/${articleId}`),
    subscribe: (plan: 'monthly' | 'yearly') =>
        api.post('/users/subscribe', { plan }),
};

export default api;
