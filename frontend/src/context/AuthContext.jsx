import { createContext, useContext, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const saveSession = (data) => {
    const { token, ...profile } = data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(profile))
    setUser(profile)
    return profile
  }

  const login = async (email, password) => saveSession(await authApi.login({ email, password }))

  const register = async (form) => saveSession(await authApi.register(form))

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export function homePathFor(role) {
  if (role === 'CHEF') return '/chef/dashboard'
  if (role === 'ADMIN') return '/admin'
  return '/chefs'
}
