'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Bot, Menu, X, Zap, User as UserIcon } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Builder', href: '/builder' },
  { name: 'Playground', href: '/playground' },
  { name: 'Demo', href: '/demo' },
  { name: 'Templates', href: '/templates' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Deploy', href: '/deploy' },
]

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  interface NavbarUser {
    id: string;
    email: string;
    user_metadata?: Record<string, unknown>;
    app_metadata?: Record<string, unknown>;
    [key: string]: unknown;
  }
  const [user, setUser] = useState<NavbarUser | null>(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Fetch user info from backend (e.g., /auth/me)
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('sb-access-token');
        const res = await fetch(`${BACKEND_URL}/auth/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    fetchUser()
    // Listen for custom auth-changed event
    const handleAuthChanged = () => fetchUser()
    window.addEventListener('auth-changed', handleAuthChanged)
    return () => window.removeEventListener('auth-changed', handleAuthChanged)
  }, [])

  // Click outside to close profile dropdown (desktop)
  useEffect(() => {
    if (!profileMenuOpen) return
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [profileMenuOpen])

  const handleSignOut = async () => {
    await fetch(`${BACKEND_URL}/auth/signout`, { method: 'POST' })
    localStorage.removeItem('sb-access-token');
    window.dispatchEvent(new Event('auth-changed'));
    setUser(null);
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">LivelyAPI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                  pathname === item.href
                    ? 'text-purple-600'
                    : 'text-gray-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth/Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="relative" ref={profileRef}>
                <Button variant="ghost" className="flex items-center space-x-2" onClick={() => setProfileMenuOpen((v) => !v)}>
                  <UserIcon className="w-5 h-5" />
                  <span className="hidden md:inline text-sm font-medium">{user.email}</span>
                </Button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                    <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard</Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={handleSignOut}
                    >Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Link href="/auth/signup">
                    <Zap className="w-4 h-4 mr-2" />
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Overlay */}
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setMobileMenuOpen(false)} />
            <div className="md:hidden fixed top-16 left-0 w-full bg-white border-t border-gray-200 z-50 shadow-lg animate-fade-in">
              <div className="flex flex-col space-y-4 p-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                      pathname === item.href
                        ? 'text-purple-600'
                        : 'text-gray-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <div className="px-4 py-2">
                    <ThemeToggle variant="dropdown" showLabel />
                  </div>
                  {user ? (
                    <>
                      <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard</Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={handleSignOut}
                      >Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" asChild>
                        <Link href="/auth/signin">Sign In</Link>
                      </Button>
                      <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600">
                        <Link href="/auth/signup">
                          <Zap className="w-4 h-4 mr-2" />
                          Get Started
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}