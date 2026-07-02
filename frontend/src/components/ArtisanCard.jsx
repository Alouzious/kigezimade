import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { cn } from '../lib/utils'
import { FALLBACK_ARTISAN } from '../lib/images'

export default function ArtisanCard({ artisan, className }) {
  return (
    <Link
      to={`/artisans/${artisan.id}`}
      className={cn(
        'group block relative overflow-hidden rounded-2xl shadow-lg shadow-forest/15 hover:shadow-xl hover:shadow-forest/20 transition-all duration-400 hover:-translate-y-1',
        className,
      )}
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={artisan.photo_url || FALLBACK_ARTISAN}
          alt={artisan.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/30 to-transparent opacity-90" />
        <div className="absolute top-4 left-4 w-10 h-1 bg-gradient-to-r from-amber to-bead rounded-full" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-cream">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-light font-semibold mb-1">
          {artisan.craft_specialty}
        </p>
        <h3 className="font-serif text-2xl font-bold">{artisan.name}</h3>
        <p className="flex items-center gap-1.5 text-sm text-cream/85 mt-2">
          <MapPin size={14} className="text-amber-light" />
          {artisan.district}, Kigezi
        </p>
      </div>
    </Link>
  )
}
