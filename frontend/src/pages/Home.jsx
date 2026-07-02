import { useEffect, useState } from 'react'
import HeroSlider from '../components/HeroSlider'
import DistrictExplore from '../components/DistrictExplore'
import { Seo } from '../components/HowToBuy'
import { HandHeart, Map, Sparkles, ArrowRight } from 'lucide-react'
import Button from '../components/Button'
import ArtisanCard from '../components/ArtisanCard'
import ProductCard from '../components/ProductCard'
import { api } from '../lib/api'

const steps = [
  {
    icon: HandHeart,
    title: 'Meet the maker',
    text: 'Every product links to the artisan who made it: their story, their workshop, their district in Kigezi.',
    color: 'from-bead/20 to-bead/5',
    iconBg: 'bg-bead/15 text-bead',
  },
  {
    icon: Sparkles,
    title: 'Hear the story',
    text: 'Cultural narratives reveal how each craft was made and what it means in Bakiga heritage.',
    color: 'from-amber/20 to-amber/5',
    iconBg: 'bg-amber/15 text-amber',
  },
  {
    icon: Map,
    title: 'Visit in person',
    text: 'Plan a real workshop visit with maps and video tours. Tourism and trade, together.',
    color: 'from-lake/20 to-lake/5',
    iconBg: 'bg-lake/15 text-lake',
  },
]

export default function Home() {
  const [artisans, setArtisans] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getFeaturedArtisans(), api.getProducts()])
      .then(([a, p]) => {
        setArtisans(a)
        setProducts(p.slice(0, 4))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Seo />
      <HeroSlider />

      <section className="py-20 md:py-28 bg-section-warm pattern-dots">
        <div className="max-w-7xl mx-auto px-6">
          <p className="label-kicker mb-3">How it works</p>
          <h2 className="heading-display text-3xl md:text-5xl max-w-2xl text-balance">
            From workshop to world, with the maker in the middle
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className={`animate-fade-in-up p-8 rounded-2xl bg-gradient-to-br ${step.color} border border-border-warm card-elevated`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${step.iconBg} flex items-center justify-center mb-5`}>
                  <step.icon size={24} />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-charcoal">{step.title}</h3>
                <p className="text-stone leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-section-sage">
        <div className="max-w-7xl mx-auto px-6">
          <DistrictExplore />
        </div>
      </section>

      <section className="py-20 md:py-28 bg-parchment">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="label-kicker mb-3">Featured makers</p>
              <h2 className="heading-display text-3xl md:text-5xl">
                The people behind the craft
              </h2>
            </div>
            <Button to="/marketplace" variant="ghost" className="hidden md:inline-flex">
              View all <ArrowRight size={16} />
            </Button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="aspect-[3/4] bg-parchment-deep rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {artisans.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 md:py-28 bg-section-warm">
        <div className="max-w-7xl mx-auto px-6">
          <p className="label-kicker mb-3">From the marketplace</p>
          <h2 className="heading-display text-3xl md:text-5xl mb-12">
            Handcrafted, priced by makers
          </h2>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="aspect-[4/5] bg-parchment-deep rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button to="/marketplace" variant="primary" size="lg">
              Browse all crafts
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-section-forest text-cream relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <p className="text-amber-light text-xs uppercase tracking-[0.25em] font-bold mb-4">Join the movement</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-balance">
            Are you an artisan in Kigezi?
          </h2>
          <p className="text-cream/80 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Register free. Set your own prices. Share your workshop with tourists
            visiting Lake Bunyonyi, Bwindi, and the Virunga foothills.
          </p>
          <Button to="/register" variant="secondary" size="lg">
            Join Kigezi Made
          </Button>
        </div>
      </section>
    </>
  )
}
