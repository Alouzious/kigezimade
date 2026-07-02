import { MessageCircle, Link2 } from 'lucide-react'
import { useState } from 'react'
import { whatsappLink } from '../lib/orders'

export default function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = url || window.location.href
  const text = `Check out "${title}" on Kigezi Made. Crafts direct from makers in Southwest Uganda`
  const wa = whatsappLink(null, `${text} ${shareUrl}`)?.replace('https://wa.me/?', 'https://wa.me/?')
    || `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-border-warm rounded-xl bg-cream hover:bg-sage/50 transition-colors"
      >
        <MessageCircle size={16} className="text-[#25D366]" />
        Share on WhatsApp
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-border-warm rounded-xl bg-cream hover:bg-sage/50 transition-colors"
      >
        <Link2 size={16} className="text-forest" />
        {copied ? 'Link copied!' : 'Copy link'}
      </button>
    </div>
  )
}

export function VerifiedBadge({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider bg-forest/12 text-forest rounded-full font-bold ${className}`}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      Verified maker
    </span>
  )
}

export function AvailabilityBadge({ availability }) {
  const isMadeToOrder = availability === 'made_to_order'
  return (
    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
      isMadeToOrder ? 'bg-bead/15 text-bead' : 'bg-lake/15 text-lake'
    }`}>
      {isMadeToOrder ? 'Made to order' : 'In stock'}
    </span>
  )
}
