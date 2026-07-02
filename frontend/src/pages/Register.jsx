import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import Button from '../components/Button'
import { api, DISTRICTS } from '../lib/api'
import { artisanSession } from '../lib/session'

const CRAFTS = [
  'Basket weaving',
  'Beadwork',
  'Drum making',
  'Barkcloth',
  'Wood carving',
  'Other',
]

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    bio: '',
    district: 'Kabale',
    craft_specialty: '',
    photo_url: '',
    workshop_video_url: '',
    map_embed_url: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { confirmPassword, ...payload } = form
      const artisan = await api.createArtisan(payload)
      const { artisan: loggedIn, token } = await api.login(form.email, form.password)
      artisanSession.set(loggedIn, token)
      setSuccess(true)
      setTimeout(() => navigate(`/dashboard/${loggedIn.id}`), 2000)
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center animate-fade-in">
        <CheckCircle size={48} className="text-forest mx-auto mb-6" />
        <h1 className="font-serif text-3xl mb-4">Welcome to Kigezi Made</h1>
        <p className="text-stone">
          Your account is ready. Use your email and password anytime to sign in.
          Redirecting to your dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-bead mb-3">Join free</p>
      <h1 className="font-serif text-4xl text-charcoal mb-4">
        Register as an artisan
      </h1>
      <p className="text-stone leading-relaxed mb-10">
        List your crafts, set your own prices, and connect with tourists visiting
        Southwest Uganda. No fees, no middlemen.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Full name *
          </label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Email *
          </label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Password *
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Confirm password *
          </label>
          <input
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            WhatsApp / phone number
          </label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+256 700 000 000"
            className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
          <p className="text-xs text-stone mt-1">Tourists can contact you directly on your shop page.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            District *
          </label>
          <select
            name="district"
            required
            value={form.district}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25"
          >
            {DISTRICTS.filter((d) => d.value !== 'all').map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Craft specialty
          </label>
          <select
            name="craft_specialty"
            value={form.craft_specialty}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25"
          >
            <option value="">Select your craft</option>
            {CRAFTS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Your story
          </label>
          <textarea
            name="bio"
            rows={5}
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell tourists about your craft, your family tradition, your workshop..."
            className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Photo URL
          </label>
          <input
            name="photo_url"
            type="url"
            value={form.photo_url}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Workshop video embed URL
          </label>
          <input
            name="workshop_video_url"
            type="url"
            value={form.workshop_video_url}
            onChange={handleChange}
            placeholder="https://www.youtube.com/embed/..."
            className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Google Maps embed URL
          </label>
          <input
            name="map_embed_url"
            type="url"
            value={form.map_embed_url}
            onChange={handleChange}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
        </div>

        {error && (
          <p className="text-bead text-sm">{error}</p>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-stone mt-8">
        Already registered?{' '}
        <Link to="/login" className="text-forest font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
