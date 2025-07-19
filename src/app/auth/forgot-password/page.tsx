'use client'
import { useState } from 'react'
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSent(false)
    const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    if (res.ok) setSent(true)
    else setError(data.error || 'Failed to send reset email')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-purple-700">Forgot Password</h1>
        <p className="text-gray-700 mb-4">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded"
          >
            Send Reset Link
          </button>
        </form>
        {sent && <div className="text-green-600 mt-4">Reset link sent! Check your email.</div>}
        {error && <div className="text-red-600 mt-4">{error}</div>}
      </div>
    </div>
  )
}
