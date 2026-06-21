import api from './axios'

// Public API
export const getCategories = () => api.get('/categories').then(r => r.data)

// Admin APIs
export const adminCreateCategory = (data) => api.post('/admin/categories', data).then(r => r.data)
export const adminUpdateCategory = (id, data) => api.put(`/admin/categories/${id}`, data).then(r => r.data)
export const adminDeleteCategory = (id) => api.delete(`/admin/categories/${id}`).then(r => r.data)
