import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils'
import { resolveMediaUrl } from '../lib/images'

export default function ImageCarousel({
  images = [],
  alt = 'Product image',
  className,
  aspect = 'aspect-square',
}) {
  const slides = images.map(resolveMediaUrl).filter(Boolean)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [images])

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? slides.length - 1 : i - 1))
  }, [slides.length])

  const next = useCallback(() => {
    setIndex((i) => (i === slides.length - 1 ? 0 : i + 1))
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [slides.length, next])

  if (slides.length === 0) {
    return (
      <div className={cn(aspect, 'bg-cream-dark rounded-sm', className)} />
    )
  }

  return (
    <div className={cn('relative group overflow-hidden rounded-2xl shadow-lg shadow-forest/10', aspect, className)}>
      {slides.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={`${alt} ${i + 1}`}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-700',
            i === index ? 'opacity-100' : 'opacity-0',
          )}
        />
      ))}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-charcoal/50 text-cream opacity-0 group-hover:opacity-100 transition-opacity hover:bg-charcoal/70"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-charcoal/50 text-cream opacity-0 group-hover:opacity-100 transition-opacity hover:bg-charcoal/70"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  i === index ? 'bg-cream w-6' : 'bg-cream/50',
                )}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>

          <div className="absolute top-4 right-4 px-2 py-1 rounded-sm bg-charcoal/50 text-cream text-xs">
            {index + 1} / {slides.length}
          </div>
        </>
      )}
    </div>
  )
}
