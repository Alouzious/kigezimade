import { useEffect, useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import Button from './Button'

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=1800&q=80',
    tag: 'Basket weaving',
    location: 'Lake Bunyonyi, Kabale',
  },
  {
    image: 'https://images.unsplash.com/photo-1610701596007-7610059003fe?w=1800&q=80',
    tag: 'Beadwork',
    location: 'Rukiga hills',
  },
  {
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1800&q=80',
    tag: 'Drum making',
    location: 'Kisoro, Virunga foothills',
  },
  {
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1800&q=80',
    tag: 'Heritage crafts',
    location: 'Kanungu district',
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
    <section className="relative min-h-[92vh] flex items-end overflow-hidden">
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
            className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
              i === active ? 'scale-110' : 'scale-100'
            }`}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/55 to-forest/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest/70 via-forest/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-parchment/20 to-transparent" />

      <div className="absolute top-24 right-6 md:right-12 hidden md:flex flex-col gap-3 animate-fade-in">
        <div className="px-5 py-3 bg-cream/15 backdrop-blur-md border border-cream/25 rounded-2xl text-cream shadow-xl">
          <p className="text-2xl font-serif font-bold">50+</p>
          <p className="text-xs uppercase tracking-widest text-amber-light font-semibold">Artisan makers</p>
        </div>
        <div className="px-5 py-3 bg-gradient-to-br from-bead to-bead-light backdrop-blur-md rounded-2xl text-cream ml-8 shadow-xl animate-float">
          <p className="text-2xl font-serif font-bold">0%</p>
          <p className="text-xs uppercase tracking-widest text-cream/90 font-semibold">Middlemen</p>
        </div>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-12 flex flex-col gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.tag}
            type="button"
            onClick={() => setActive(i)}
            className={`text-left transition-all duration-300 ${
              i === active ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-2'
            }`}
          >
            <span className={`block h-1 mb-1 rounded-full transition-all ${
              i === active ? 'w-12 bg-gradient-to-r from-amber to-bead' : 'w-6 bg-cream/50'
            }`} />
            <span className="text-[10px] uppercase tracking-widest text-cream hidden md:block font-medium">
              {slide.tag}
            </span>
          </button>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pb-16 md:pb-28 w-full">
        <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber/20 border border-amber/30 text-amber-light text-xs uppercase tracking-[0.2em] mb-5 font-semibold animate-fade-in">
          <Sparkles size={12} />
          {SLIDES[active].location}
        </p>
        <h1 className="heading-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-cream max-w-4xl leading-[1.05] text-balance drop-shadow-lg">
          Crafts with stories.
          <br />
          <span className="italic text-amber-light">Artisans with names.</span>
        </h1>
        <p className="text-cream/90 text-lg md:text-xl max-w-xl mt-6 leading-relaxed font-medium">
          Buy directly from makers in Southwest Uganda. Fair prices,
          living traditions, real connections.
        </p>
        <div className="flex flex-wrap gap-4 mt-10">
          <Button to="/marketplace" variant="secondary" size="lg">
            Explore marketplace
            <ArrowRight size={18} />
          </Button>
          <Button
            to="/register"
            variant="outline"
            size="lg"
            className="border-cream/80 text-cream hover:bg-cream hover:text-forest bg-cream/10 backdrop-blur-sm"
          >
            Sell your crafts
          </Button>
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.25em] text-cream/60 font-semibold">
          Kabale · Kisoro · Kanungu · Rukiga
        </p>
      </div>
    </section>
  )
}
