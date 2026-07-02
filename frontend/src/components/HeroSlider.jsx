import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Button from './Button'
import DisplayHeadline from './DisplayHeadline'

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=1800&q=80',
    tag: 'Basket weaving',
  },
  {
    image: 'https://images.unsplash.com/photo-1610701596007-7610059003fe?w=1800&q=80',
    tag: 'Beadwork',
  },
  {
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1800&q=80',
    tag: 'Drum making',
  },
  {
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1800&q=80',
    tag: 'Heritage crafts',
  },
]

export default function HeroSlider() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-[min(100svh,900px)] md:min-h-[92vh] flex items-end overflow-hidden">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.tag}
            className={`w-full h-full object-cover object-center md:object-center transition-transform duration-[8000ms] ease-out ${
              i === active ? 'scale-105 md:scale-110' : 'scale-100'
            }`}
          />
        </div>
      ))}

      {/* Stronger bottom gradient on mobile for readable text */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/80 to-forest/30 md:via-forest/55 md:to-forest/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest/80 via-forest/30 to-transparent md:from-forest/70 md:via-forest/20" />
      <div className="absolute bottom-0 left-0 right-0 h-40 md:h-32 bg-gradient-to-t from-parchment/30 to-transparent" />

      {/* Stats — desktop only */}
      <div className="absolute top-28 right-6 md:right-12 hidden lg:flex flex-col gap-3 animate-fade-in">
        <div className="px-5 py-3 bg-cream/15 backdrop-blur-md border border-cream/25 rounded-2xl text-cream shadow-xl">
          <p className="text-2xl font-serif font-bold">50+</p>
          <p className="text-xs uppercase tracking-widest text-amber-light font-semibold">Artisan makers</p>
        </div>
        <div className="px-5 py-3 bg-gradient-to-br from-bead to-bead-light backdrop-blur-md rounded-2xl text-cream ml-8 shadow-xl animate-float">
          <p className="text-2xl font-serif font-bold">0%</p>
          <p className="text-xs uppercase tracking-widest text-cream/90 font-semibold">Middlemen</p>
        </div>
      </div>

      {/* Side slide nav — tablet+ only */}
      <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-12 hidden md:flex flex-col gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.tag}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${slide.tag}`}
            className={`text-left transition-all duration-300 ${
              i === active ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-2'
            }`}
          >
            <span
              className={`block h-1 mb-1 rounded-full transition-all ${
                i === active ? 'w-12 bg-gradient-to-r from-amber to-bead' : 'w-6 bg-cream/50'
              }`}
            />
            <span className="text-[10px] uppercase tracking-widest text-cream font-medium">
              {slide.tag}
            </span>
          </button>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-8 pt-28 sm:pt-32 md:pb-28 md:pt-0 w-full">
        <DisplayHeadline
          line1="Crafts with stories."
          line2="Artisans with names."
        />
        <p className="text-cream/90 text-base sm:text-lg md:text-xl max-w-xl mt-4 sm:mt-6 leading-relaxed font-medium">
          Buy directly from makers in Southwest Uganda. Fair prices, living traditions, real connections.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-10">
          <Button to="/marketplace" variant="secondary" size="lg" className="w-full sm:w-auto justify-center">
            Explore marketplace
            <ArrowRight size={18} />
          </Button>
          <Button
            to="/register"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto justify-center border-cream/80 text-cream hover:bg-cream hover:text-forest bg-cream/10 backdrop-blur-sm"
          >
            Sell your crafts
          </Button>
        </div>

        {/* Mobile slide dots + craft label */}
        <div className="flex items-center justify-between gap-4 mt-6 md:mt-8">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-cream/60 font-semibold">
            Kabale · Kisoro · Kanungu · Rukiga
          </p>
          <div className="flex items-center gap-2 md:hidden">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.tag}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}: ${slide.tag}`}
                className={`h-2 rounded-full transition-all ${
                  i === active ? 'w-7 bg-amber-light' : 'w-2 bg-cream/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
