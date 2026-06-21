import api from './axios'

export const getProductReviews = (productId) => api.get(`/products/${productId}/reviews`).then(r => r.data)
export const createProductReview = (productId, data) => api.post(`/products/${productId}/reviews`, data).then(r => r.data)
