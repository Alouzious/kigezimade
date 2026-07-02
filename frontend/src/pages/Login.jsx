import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import Button from '../components/Button'
import { api } from '../lib/api'
import { artisanSession } from '../lib/session'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { artisan, token } = await api.login(form.email, form.password)
      artisanSession.set(artisan, token)
      navigate(`/dashboard/${artisan.id}`)
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16 md:py-24">
      <div className="text-center mb-10">
        <LogIn size={32} className="mx-auto text-forest mb-4" />
        <p className="text-xs uppercase tracking-[0.2em] text-bead mb-3">Artisan login</p>
        <h1 className="font-serif text-3xl text-charcoal">Welcome back</h1>
        <p className="text-stone mt-3">
          Sign in to manage your products and shop.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 card-elevated rounded-2xl p-8">
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">Email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">Password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Your password"
            className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
        </div>

        {error && <p className="text-sm text-bead">{error}</p>}

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="text-center text-sm text-stone mt-4">
        <Link to="/forgot-password" className="text-forest hover:underline">Forgot password?</Link>
      </p>

      <p className="text-center text-sm text-stone mt-8">
        New artisan?{' '}
        <Link to="/register" className="text-forest font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
