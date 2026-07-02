import { useEffect } from 'react'
import { ShoppingBag, MessageCircle, Package } from 'lucide-react'

const steps = [
  { icon: Package, title: 'Choose a craft', text: 'Browse photos and read the cultural story behind each piece.', bg: 'bg-lake/12 text-lake' },
  { icon: ShoppingBag, title: 'Place your order', text: 'Enter your name, email, and WhatsApp. No payment on the site.', bg: 'bg-bead/12 text-bead' },
  { icon: MessageCircle, title: 'Artisan contacts you', text: 'The maker arranges payment and delivery directly. No middlemen.', bg: 'bg-amber/12 text-amber' },
]

export default function HowToBuy() {
  return (
    <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-sage to-sage-deep border border-border-warm">
      <p className="label-kicker mb-5">How to buy</p>
      <div className="grid sm:grid-cols-3 gap-5">
        {steps.map((step, i) => (
          <div key={step.title} className="flex gap-4 p-4 rounded-xl bg-cream/70 border border-border-warm/60">
            <div className={`w-11 h-11 shrink-0 rounded-xl ${step.bg} flex items-center justify-center font-bold text-sm`}>
              {i + 1}
            </div>
            <div>
              <h4 className="font-serif font-bold text-charcoal text-sm mb-1">{step.title}</h4>
              <p className="text-xs text-stone leading-relaxed">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Seo({ title, description, image }) {
  useEffect(() => {
    document.title = title ? `${title} · Kigezi Made` : 'Kigezi Made | Crafts from Southwest Uganda'
    const setMeta = (name, content, prop = false) => {
      if (!content) return
      const attr = prop ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }
    setMeta('description', description)
    setMeta('og:title', title || 'Kigezi Made', true)
    setMeta('og:description', description, true)
    setMeta('og:image', image, true)
  }, [title, description, image])
  return null
}
