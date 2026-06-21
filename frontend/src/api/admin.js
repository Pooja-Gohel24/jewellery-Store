import api from './axios'

export const getAdminStats = () => api.get('/admin/stats').then(r => r.data)

export const getAdminProducts = () => api.get('/admin/products').then(r => r.data)
export const createProduct = (data) => api.post('/admin/products', data).then(r => r.data)
export const updateProduct = (id, data) => api.put(`/admin/products/${id}`, data).then(r => r.data)
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`).then(r => r.data)

export const getAdminUsers = () => api.get('/admin/users').then(r => r.data)
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then(r => r.data)

export const getAdminOrders = () => api.get('/admin/orders').then(r => r.data)
export const updateOrderStatus = (id, status) => api.put(`/admin/orders/${id}/status`, { status }).then(r => r.data)
