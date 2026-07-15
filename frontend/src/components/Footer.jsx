import { Link } from 'react-router-dom'
import { MapPin, Mail, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-section-forest text-cream mt-auto relative overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber via-bead to-amber" />
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12 relative">
        <div>
          <h3 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2">
            Kigezi Made
            <Heart size={18} className="text-amber-light fill-amber-light/30" />
          </h3>
          <p className="text-cream/75 text-sm leading-relaxed">
            Connecting artisans, youth, and young women in Kabale, Kisoro, Kanungu,
            Rukiga, and Rubanda directly with tourists and buyers, preserving craft
            traditions for the next generation.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-amber-light font-bold mb-4">
            Explore
          </h4>
          <ul className="space-y-2.5 text-sm text-cream/75">
            <li><Link to="/marketplace" className="hover:text-amber-light transition-colors">Marketplace</Link></li>
            <li><Link to="/craft-trails" className="hover:text-amber-light transition-colors">Craft Trails</Link></li>
            <li><Link to="/impact" className="hover:text-amber-light transition-colors">Our Impact</Link></li>
            <li><Link to="/track-order" className="hover:text-amber-light transition-colors">Track Order</Link></li>
            <li><Link to="/register" className="hover:text-amber-light transition-colors">Register as Artisan</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-amber-light font-bold mb-4">
            Region
          </h4>
          <p className="flex items-center gap-2 text-sm text-cream/75">
            <MapPin size={14} className="text-amber-light" />
            Kigezi Sub-region, Uganda
          </p>
          <p className="flex items-center gap-2 text-sm text-cream/75 mt-2">
            <Mail size={14} className="text-amber-light" />
            hello@kigezimade.ug
          </p>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/50 relative">
        &copy; {new Date().getFullYear()} Kigezi Made. Craft with purpose.
      </div>
    </footer>
  )
}
