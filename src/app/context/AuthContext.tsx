"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { setTokenCookie, removeTokenCookie } from "@/lib/auth"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<string | null>
  signup: (name: string, email: string, password: string) => Promise<string | null>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error("Auth refresh error:", err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return data.error
      setUser(data.user)
      setTokenCookie(data.token)
      return null
    } catch (err) {
      console.error("Login error:", err)
      return "Network error. Please try again."
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) return data.error
      setUser(data.user)
      setTokenCookie(data.token)
      return null
    } catch (err) {
      console.error("Signup error:", err)
      return "Network error. Please try again."
    }
  }

  const logout = () => {
    setUser(null)
    removeTokenCookie()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be inside AuthProvider")
  return ctx
}
