import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { api } from '../lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.forgotPassword(email)
      setSent(true)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl mb-4">Forgot password?</h1>
      <p className="text-stone mb-8">Enter your email and we will send a reset link if you have an account.</p>
      {sent ? (
        <p className="p-4 bg-forest/10 text-forest rounded-sm text-sm">
          If that email is registered, a reset link has been sent. Check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 border border-border rounded-sm" />
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</Button>
        </form>
      )}
      <p className="text-center text-sm text-stone mt-8">
        <Link to="/login" className="text-forest hover:underline">Back to sign in</Link>
      </p>
    </div>
  )
}
