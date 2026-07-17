import { Map, Clock } from 'lucide-react'
import Button from '../components/Button'
import { Seo } from '../components/HowToBuy'
import { craftImg } from '../lib/images'

const trails = [
  {
    title: 'Lake Bunyonyi craft day',
    district: 'Kabale',
    duration: 'Half day',
    description: 'Visit basket weavers above Lake Bunyonyi. Watch papyrus harvesting, try weaving, buy directly from Grace and her cooperative.',
    image: craftImg('baskets', 800),
    highlights: ['Basket weaving', 'Lake views', 'Women\'s cooperative'],
  },
  {
    title: 'Virunga drum trail',
    district: 'Kisoro',
    duration: 'Full day',
    description: 'Meet drum makers at the foothills of the Virunga volcanoes. Hear ceremonial drums and learn mvule wood carving.',
    image: craftImg('drums', 800),
    highlights: ['Drum making', 'Volcano views', 'Live demonstration'],
  },
  {
    title: 'Heritage beadwalk',
    district: 'Rukiga',
    duration: '3 hours',
    description: 'Walk through Rukiga hills visiting beadwork artisans. Each necklace tells a story of Bakiga heritage.',
    image: craftImg('beadwork', 800),
    highlights: ['Beadwork', 'Cultural stories', 'Hill village'],
  },
  {
    title: 'Ankole craft & cattle trail',
    district: 'Mbarara',
    duration: 'Full day',
    description: 'Explore woodwork and leatherwork workshops on the edge of Ankole cattle country. See how the region\'s long-horned cattle heritage shapes local craft, from leather goods to carved milk pots.',
    image: craftImg('woodwork', 800),
    highlights: ['Woodwork', 'Leatherwork', 'Ankole cattle culture'],
  },
]

export default function CraftTrails() {
  return (
    <div>
      <div className="bg-section-terracotta text-cream py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Seo title="Craft Trails" description="Curated artisan visits across South Western Uganda, from Kigezi to Ankole." />
          <p className="text-xs uppercase tracking-[0.25em] text-cream/80 font-bold mb-3">Plan your visit</p>
          <h1 className="heading-display text-4xl md:text-6xl text-cream max-w-2xl">Craft trails in South Western Uganda</h1>
          <p className="text-cream/85 mt-4 max-w-2xl leading-relaxed text-lg">
            Curated routes to meet makers in their workshops, not souvenir shops.
            Combine craft visits with Lake Bunyonyi, Bwindi, and the Virunga foothills in Kigezi,
            or Lake Mburo and Igongo cultural sites in Ankole.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {trails.map((trail) => (
            <article key={trail.title} className="card-elevated rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={trail.image} alt={trail.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6 bg-gradient-to-b from-cream to-parchment">
                <div className="flex items-center gap-3 text-xs text-stone font-medium mb-3">
                  <span className="flex items-center gap-1 text-forest"><Map size={12} />{trail.district}</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{trail.duration}</span>
                </div>
                <h2 className="font-serif text-xl font-bold">{trail.title}</h2>
                <p className="text-sm text-stone mt-3 leading-relaxed">{trail.description}</p>
                <ul className="flex flex-wrap gap-2 mt-4">
                  {trail.highlights.map((h) => (
                    <li key={h} className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-sage rounded-full text-forest font-bold">{h}</li>
                  ))}
                </ul>
                <Button to="/marketplace" variant="outline" size="sm" className="mt-6">Browse crafts</Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}