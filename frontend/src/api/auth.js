import api from './axios'

export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const loginUser = async (data) => {
  const response = await api.post('/auth/login', data)
  return response.data
}

export const verifyOtp = async (data) => {
  const response = await api.post('/auth/verify-otp', data)
  return response.data
}

export const resendOtp = async (data) => {
  const response = await api.post('/auth/resend-otp', data)
  return response.data
}

export const getMe = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

export const forgotPassword = async (data) => {
  const response = await api.post('/auth/forgot-password', data)
  return response.data
}

export const resetPassword = async (data) => {
  const response = await api.post('/auth/reset-password', data)
  return response.data
}

export const updateProfile = async (data) => {
  const response = await api.patch('/auth/profile', data)
  return response.data
}
