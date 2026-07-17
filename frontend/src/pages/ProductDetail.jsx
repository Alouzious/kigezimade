import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Globe, Sparkles, ShoppingBag, Phone, MessageCircle, Volume2 } from 'lucide-react'
import Button from '../components/Button'
import ImageCarousel from '../components/ImageCarousel'
import HowToBuy, { Seo } from '../components/HowToBuy'
import ShareButtons, { VerifiedBadge, AvailabilityBadge } from '../components/ShareButtons'
import { api, formatPrice, LANGUAGES } from '../lib/api'
import { getProductImages } from '../lib/session'

export default function ProductDetail() {
  const { id } = useParams()
  const [detail, setDetail] = useState(null)
  const [story, setStory] = useState(null)
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(true)
  const [storyLoading, setStoryLoading] = useState(false)
  const [orderForm, setOrderForm] = useState({
    buyer_name: '',
    buyer_email: '',
    buyer_phone: '',
    buyer_message: '',
    quantity: 1,
  })
  const [orderStatus, setOrderStatus] = useState(null)
  const [orderId, setOrderId] = useState(null)

  useEffect(() => {
    api
      .getProduct(id)
      .then(setDetail)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!detail) return
    api
      .getStory(id)
      .then((data) => setStory(data))
      .catch(() => setStory(null))
  }, [detail, id])

  const handleGenerateStory = async () => {
    setStoryLoading(true)
    try {
      const data = await api.generateStory(id)
      setStory(data)
      setLanguage('en')
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to generate story. Check GROQ_API_KEY.')
    } finally {
      setStoryLoading(false)
    }
  }

  const handleLanguageChange = async (code) => {
    setLanguage(code)
    if (code === 'en' || !story) return

    const existing = story.translations?.find((t) => t.language_code === code)
    if (existing) return

    setStoryLoading(true)
    try {
      const translation = await api.translateStory(id, code)
      setStory((prev) => ({
        ...prev,
        translations: [...(prev.translations || []), translation],
      }))
    } catch (err) {
      console.error(err)
    } finally {
      setStoryLoading(false)
    }
  }

  const handleOrder = async (e) => {
    e.preventDefault()
    setOrderStatus('loading')
    try {
      const order = await api.createOrder({
        product_id: id,
        ...orderForm,
        quantity: Number(orderForm.quantity),
      })
      setOrderId(order.id)
      setOrderStatus('success')
    } catch (err) {
      setOrderStatus('error')
      console.error(err)
    }
  }

  const readAloud = () => {
    const text = getStoryText()
    if (!text || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }

  const getStoryText = () => {
    if (!story) return null
    if (language === 'en') return story.story.story_text
    const translation = story.translations?.find((t) => t.language_code === language)
    return translation?.translated_text || story.story.story_text
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-cream-dark rounded-sm animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-cream-dark rounded animate-pulse w-3/4" />
            <div className="h-4 bg-cream-dark rounded animate-pulse w-1/2" />
          </div>
        </div>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <p className="text-stone text-lg">Product not found.</p>
        <Link to="/marketplace" className="text-forest underline mt-4 inline-block">
          Back to marketplace
        </Link>
      </div>
    )
  }

  const { artisan, images, ...product } = detail
  const productImages = images?.length
    ? getProductImages({ ...product, images })
    : getProductImages(product)

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      <Seo
        title={product.name}
        description={product.description?.slice(0, 160)}
        image={productImages[0]}
      />
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <ImageCarousel
          images={productImages}
          alt={product.name}
          aspect="aspect-square"
        />

        {/* Details */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <p className="text-xs uppercase tracking-[0.2em] text-bead">
              {product.category}
            </p>
            {artisan.verified && <VerifiedBadge />}
            <AvailabilityBadge availability={product.availability} />
          </div>
          <h1 className="heading-display text-3xl md:text-5xl text-charcoal">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-forest mt-4">
            {formatPrice(product.price)}
          </p>

          <div className="mt-4">
            <ShareButtons title={product.name} />
          </div>

          <p className="text-stone mt-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-6">
            <HowToBuy />
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-sage to-parchment border border-border-warm">
            <p className="text-xs uppercase tracking-wider text-bead font-bold mb-1">Made by</p>
            <Link
              to={`/artisans/${artisan.id}`}
              className="font-serif text-xl text-forest hover:text-forest-light transition-colors"
            >
              {artisan.name}
            </Link>
            <p className="text-sm text-stone mt-1">{artisan.district}, South Western Uganda</p>
          </div>

          {/* Order form */}
          <form onSubmit={handleOrder} className="mt-8 p-6 md:p-8 card-elevated rounded-2xl space-y-4">
            <div>
              <h3 className="font-serif text-lg flex items-center gap-2">
                <ShoppingBag size={18} />
                Order from the maker
              </h3>
              <p className="text-sm text-stone mt-2">
                No middlemen. {artisan.name.split(' ')[0]} will contact you on WhatsApp or email to arrange payment and delivery.
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone mb-1">Your name *</label>
              <input
                type="text"
                required
                value={orderForm.buyer_name}
                onChange={(e) => setOrderForm({ ...orderForm, buyer_name: e.target.value })}
                className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone mb-1">Email *</label>
              <input
                type="email"
                required
                value={orderForm.buyer_email}
                onChange={(e) => setOrderForm({ ...orderForm, buyer_email: e.target.value })}
                className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone mb-1 flex items-center gap-1">
                <Phone size={12} />
                WhatsApp / phone number *
              </label>
              <input
                type="tel"
                required
                placeholder="+256 700 000 000"
                value={orderForm.buyer_phone}
                onChange={(e) => setOrderForm({ ...orderForm, buyer_phone: e.target.value })}
                className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={orderForm.quantity}
                onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                className="w-full px-4 py-3 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone mb-1 flex items-center gap-1">
                <MessageCircle size={12} />
                Message to artisan (optional)
              </label>
              <textarea
                rows={2}
                placeholder="Delivery location, questions, preferred pickup time..."
                value={orderForm.buyer_message}
                onChange={(e) => setOrderForm({ ...orderForm, buyer_message: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-sm bg-cream resize-none focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
            <Button type="submit" variant="primary" className="w-full" disabled={orderStatus === 'loading'}>
              {orderStatus === 'loading' ? 'Sending order...' : `Order for ${formatPrice(product.price * orderForm.quantity)}`}
            </Button>
            {orderStatus === 'success' && (
              <div className="p-4 bg-forest/10 rounded-sm text-sm text-forest space-y-2">
                <p>
                  Order sent! {artisan.name.split(' ')[0]} will contact you soon on WhatsApp or email.
                  You should also receive a confirmation email.
                </p>
                {orderId && (
                  <p>
                    Track your order:{' '}
                    <Link to={`/track-order?order=${orderId}`} className="underline font-medium">
                      {orderId}
                    </Link>
                  </p>
                )}
              </div>
            )}
            {orderStatus === 'error' && (
              <p className="text-bead text-sm">Something went wrong. Please check your details and try again.</p>
            )}
          </form>
        </div>
      </div>

      {/* Cultural story */}
      <section className="mt-20 border-t border-border-warm pt-16 bg-section-warm -mx-6 px-6 md:mx-0 md:rounded-2xl md:px-10 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Sparkles size={22} className="text-bead" />
            <h2 className="font-serif text-2xl md:text-3xl">Cultural story</h2>
          </div>

          {story && (
            <div className="flex flex-wrap items-center gap-2">
              <Globe size={16} className="text-stone" />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-2 border border-border rounded-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                disabled={storyLoading}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={readAloud}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-border rounded-sm hover:bg-cream-dark"
              >
                <Volume2 size={16} />
                Listen
              </button>
            </div>
          )}
        </div>

        {story ? (
          <div className="max-w-3xl">
            <p className="text-lg leading-relaxed text-stone whitespace-pre-line animate-fade-in">
              {storyLoading ? 'Translating...' : getStoryText()}
            </p>
          </div>
        ) : (
          <div className="max-w-3xl">
            <p className="text-stone mb-6">
              Discover the cultural meaning behind this craft: how it was made,
              who made it, and what it represents in the region's heritage.
            </p>
            <Button
              onClick={handleGenerateStory}
              variant="secondary"
              disabled={storyLoading}
            >
              <Sparkles size={16} />
              {storyLoading ? 'Generating story...' : 'Generate cultural story'}
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}