import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

export const fetchCategories = () => api.get('/categories').then(r => r.data.categories);

export const fetchPrompts = (params) => api.get('/prompts', { params }).then(r => r.data);

export const fetchPrompt = (slug) => api.get(`/prompts/${slug}`).then(r => r.data.prompt);

export const incrementCopy = (id) => api.post(`/prompts/${id}/copy`);

export const likePrompt = (id) => api.post(`/prompts/${id}/like`).then(r => r.data);

export default api;
