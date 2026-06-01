"use client"

import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight sm:text-2xl">
          Blueprint<span className="text-blue-600">AI</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/#about" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            About
          </Link>
          <Link href="/#work" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Work
          </Link>
          <Link href="/#strengths" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Strengths
          </Link>
          <Link href="/#services" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Services
          </Link>
          <Link href="/#tech-stack" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Tech Stack
          </Link>
          <Link href="/#contact" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Contact
          </Link>
          <Link href="/pricing" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Pricing
          </Link>
          {user && (
            <Link href="/payments" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Payments
            </Link>
          )}
          <span className="text-zinc-300 dark:text-zinc-600">|</span>
          <Link href="/company" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            AI Company
          </Link>
          <Link href="/builder" className="rounded-full bg-zinc-900 px-4 py-1.5 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">
            + New Project
          </Link>

          {loading ? (
            <span className="text-zinc-400">Loading...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/projects" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                Projects
              </Link>
              <span className="text-zinc-300 dark:text-zinc-600">|</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{user.name}</span>
              <button onClick={handleLogout} className="text-xs text-zinc-400 hover:text-red-500">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                Sign In
              </Link>
              <Link href="/signup" className="rounded-full border border-zinc-300 px-4 py-1.5 font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-zinc-200 bg-white px-6 pb-4 pt-2 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/pricing" onClick={() => setMenuOpen(false)} className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">Pricing</Link>
            <Link href="/payments" onClick={() => setMenuOpen(false)} className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">Payments</Link>
            <Link href="/company" onClick={() => setMenuOpen(false)} className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">AI Company</Link>
            <Link href="/builder" onClick={() => setMenuOpen(false)} className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">+ New Project</Link>
            {user ? (
              <>
                <Link href="/projects" onClick={() => setMenuOpen(false)} className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">Projects</Link>
                <div className="flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-800">
                  <span className="text-xs text-zinc-500">{user.name}</span>
                  <button onClick={handleLogout} className="text-xs text-red-500">Logout</button>
                </div>
              </>
            ) : (
              <div className="flex gap-3 border-t border-zinc-200 pt-3 dark:border-zinc-800">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">Sign In</Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} className="text-blue-600 hover:underline">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
