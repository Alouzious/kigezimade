import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Sparkles } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import DistrictExplore from '../components/DistrictExplore'
import { api, CATEGORIES, DISTRICTS } from '../lib/api'
import { Seo } from '../components/HowToBuy'

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [district, setDistrict] = useState(searchParams.get('district') || 'all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const d = searchParams.get('district')
    if (d && DISTRICTS.some((x) => x.value === d)) {
      setDistrict(d)
    }
  }, [searchParams])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setLoading(true)
    api
      .getProducts({
        category: category !== 'all' ? category : undefined,
        district: district !== 'all' ? district : undefined,
        search: debouncedSearch || undefined,
      })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [category, district, debouncedSearch])

  const inputClass = 'px-4 py-3.5 border border-border-warm rounded-xl bg-cream focus:outline-none focus:ring-2 focus:ring-forest/25 font-medium'

  return (
    <div>
      <div className="bg-section-forest text-cream py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <Seo title="Marketplace" description="Buy crafts directly from artisans in Kabale, Kisoro, Kanungu, Rukiga, and Rubanda." />
          <p className="inline-flex items-center gap-2 text-amber-light text-xs uppercase tracking-[0.25em] font-bold mb-4">
            <Sparkles size={14} />
            Marketplace
          </p>
          <h1 className="heading-display text-4xl md:text-6xl text-cream max-w-2xl">
            Crafts from Kigezi
          </h1>
          <p className="text-cream/80 mt-4 max-w-2xl leading-relaxed text-lg">
            Buy directly from the maker. Fair prices, real stories, no middlemen.
            Tap a craft to see photos, read its cultural story, and order via WhatsApp.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <DistrictExplore
          onSelect={(value) => {
            setDistrict(value)
            setSearchParams({ district: value })
          }}
        />

        <div className="flex flex-col md:flex-row gap-3 mb-10 mt-12 p-4 rounded-2xl bg-section-sage border border-border-warm">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest" />
            <input
              type="text"
              placeholder="Search crafts or artisans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-11 pr-4 ${inputClass}`}
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select
            value={district}
            onChange={(e) => {
              const v = e.target.value
              setDistrict(v)
              if (v === 'all') setSearchParams({})
              else setSearchParams({ district: v })
            }}
            className={inputClass}
          >
            {DISTRICTS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="aspect-[4/5] bg-parchment-deep rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 card-elevated rounded-2xl">
            <p className="text-stone text-lg font-medium">No crafts match your filters.</p>
            <p className="text-stone-light text-sm mt-2">Try a different district or category.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
