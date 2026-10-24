import axios from 'axios'

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api`,
  timeout: 90000,
})

// The free Render instance sleeps when idle and takes up to a minute to wake.
// We tell the UI when requests are slow so it can show a "waking up" message.
let pending = 0
let slowTimer = null

const setServerWaking = (waking) => window.dispatchEvent(new CustomEvent('server-waking', { detail: waking }))

function requestStarted() {
  pending++
  if (pending === 1) slowTimer = setTimeout(() => setServerWaking(true), 4000)
}

function requestEnded() {
  pending = Math.max(0, pending - 1)
  if (pending === 0) {
    clearTimeout(slowTimer)
    setServerWaking(false)
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

client.interceptors.request.use((config) => {
  requestStarted()
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => {
    requestEnded()
    return response
  },
  async (error) => {
    const config = error.config
    const status = error.response?.status

    // server still starting: Render answers with 502/503 or the connection drops, so retry reads a few times
    const serverStarting = !error.response || [502, 503, 504].includes(status)
    if (config?.method === 'get' && serverStarting && (config.retryCount || 0) < 3) {
      config.retryCount = (config.retryCount || 0) + 1
      await sleep(3000)
      // the retry counts as a new request, so drop this one without hiding the banner
      pending--
      return client(config)
    }

    requestEnded()

    // token expired or invalid: clear the session so the user can log in again
    if (status === 401 && localStorage.getItem('token')) {
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
  if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
    return 'Cannot reach the server. Please try again in a moment.'
  }
  return 'Something went wrong. Please try again.'
}

export default client
