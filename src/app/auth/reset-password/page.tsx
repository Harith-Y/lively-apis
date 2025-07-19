'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const token = searchParams.get('access_token')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    if (!token) {
      setError('Missing reset token.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    const res = await fetch(`${BACKEND_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    })
    const data = await res.json()
    if (res.ok) setSuccess(true)
    else setError(data.error || 'Failed to reset password')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-purple-700">Reset Password</h1>
        <p className="text-gray-700 mb-4">Enter your new password below.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Confirm new password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded"
          >
            Reset Password
          </button>
        </form>
        {success && <div className="text-green-600 mt-4">Password reset successful! You can now sign in.</div>}
        {error && <div className="text-red-600 mt-4">{error}</div>}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}