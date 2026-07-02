import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { api } from '../lib/api'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) return alert('Passwords do not match')
    setLoading(true)
    try {
      await api.resetPassword(token, password)
      navigate('/login')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <p className="text-stone">Invalid reset link.</p>
        <Button to="/forgot-password" variant="primary" className="mt-6">Request new link</Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl mb-8">Set new password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="w-full px-4 py-3 border border-border rounded-sm" />
        <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" className="w-full px-4 py-3 border border-border rounded-sm" />
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>{loading ? 'Saving...' : 'Update password'}</Button>
      </form>
      <p className="text-center text-sm text-stone mt-8"><Link to="/login" className="text-forest">Sign in</Link></p>
    </div>
  )
}
