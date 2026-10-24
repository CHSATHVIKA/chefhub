import axios from 'axios'

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api`,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // token expired or invalid: clear the session so the user can log in again
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export function getErrorMessage(error) {
  const data = error.response?.data
  if (data?.errors) {
    return Object.entries(data.errors)
      .map(([field, msg]) => `${field}: ${msg}`)
      .join(', ')
  }
  if (data?.message) return data.message
  if (error.code === 'ERR_NETWORK') return 'Cannot reach the server. Please try again in a moment.'
  return 'Something went wrong. Please try again.'
}

export default client
