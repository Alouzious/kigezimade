import { Link } from 'react-router-dom'
import { formatPrice } from '../lib/api'
import { getPrimaryImage, getProductImages } from '../lib/session'
import { FALLBACK_PRODUCT } from '../lib/images'
import { VerifiedBadge, AvailabilityBadge } from './ShareButtons'
import { useI18n } from '../lib/i18n'
import { cn } from '../lib/utils'

export default function ProductCard({ product, className }) {
  const { t } = useI18n()
  const images = getProductImages(product)
  const cover = getPrimaryImage(product, FALLBACK_PRODUCT)

  return (
    <Link
      to={`/products/${product.id}`}
      className={cn(
        'group block rounded-2xl overflow-hidden card-elevated transition-all duration-400 hover:-translate-y-1',
        className,
      )}
    >
      <div className="aspect-[4/5] overflow-hidden bg-parchment-deep relative">
        <img
          src={cover}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {images.length > 1 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] uppercase tracking-wider bg-forest/85 text-cream rounded-full backdrop-blur-sm font-medium">
            {images.length} photos
          </span>
        )}
        <span className="absolute bottom-3 left-3 px-3 py-1.5 text-sm font-bold text-cream bg-bead/90 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          View craft
        </span>
      </div>
      <div className="p-5 bg-gradient-to-b from-cream to-parchment">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <p className="label-kicker !text-[10px]">{product.category}</p>
          {product.artisan_verified && <VerifiedBadge />}
          <AvailabilityBadge availability={product.availability} />
        </div>
        <p className="text-[10px] uppercase tracking-wider text-lake font-semibold mb-1">{t('directFromMaker')}</p>
        <h3 className="font-serif text-xl text-charcoal group-hover:text-forest transition-colors leading-snug">
          {product.name}
        </h3>
        <p className="text-sm text-stone mt-1.5">
          by {product.artisan_name} · {product.artisan_district}
        </p>
        <p className="font-bold text-lg text-forest mt-3">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}
