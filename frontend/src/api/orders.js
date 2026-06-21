import api from './axios'

export const placeOrder = (data) => api.post('/orders', data).then(r => r.data)
export const getMyOrders = () => api.get('/orders').then(r => r.data)
export const cancelOrder = (orderId) => api.put(`/orders/${orderId}/cancel`).then(r => r.data)
