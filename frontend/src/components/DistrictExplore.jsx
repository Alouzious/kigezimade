import { Link } from 'react-router-dom'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { DISTRICTS } from '../lib/api'
import { craftImg } from '../lib/images'

// South Western Uganda = Kigezi sub-region + Ankole sub-region
const districtImages = {
  // Kigezi sub-region
  Kabale: craftImg('baskets', 600),
  Kisoro: craftImg('drums', 600),
  Kanungu: craftImg('bags', 600),
  Rukiga: craftImg('beadwork', 600),
  Rubanda: craftImg('textiles', 600),
  Rukungiri: craftImg('pottery', 600),
  // Ankole sub-region
  Mbarara: craftImg('woodwork', 600),
  Bushenyi: craftImg('mats', 600),
  Ntungamo: craftImg('baskets', 600),
  Isingiro: craftImg('beadwork', 600),
  Kiruhura: craftImg('leatherwork', 600),
  Ibanda: craftImg('drums', 600),
  Buhweju: craftImg('textiles', 600),
  Mitooma: craftImg('bags', 600),
  Rubirizi: craftImg('pottery', 600),
  Rwampara: craftImg('woodwork', 600),
  Sheema: craftImg('mats', 600),
  Kazo: craftImg('leatherwork', 600),
}

export default function DistrictExplore({ onSelect }) {
  const districts = DISTRICTS.filter((d) => d.value !== 'all')

  const cardClass = 'group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-400 hover:-translate-y-1'

  return (
    <section>
      <p className="label-kicker mb-3">Explore South Western Uganda</p>
      <h2 className="heading-display text-2xl md:text-4xl mb-8">Browse by district</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
        {districts.map((d) => {
          const inner = (
            <>
              <img
                src={districtImages[d.value]}
                alt={d.label}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/30 to-transparent" />
              <span className="absolute bottom-4 left-4 right-4 text-cream font-serif text-lg font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-amber-light" />
                  {d.label}
                </span>
                <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-light" />
              </span>
            </>
          )

          return onSelect ? (
            <button key={d.value} type="button" onClick={() => onSelect(d.value)} className={`${cardClass} text-left`}>
              {inner}
            </button>
          ) : (
            <Link key={d.value} to={`/marketplace?district=${d.value}`} className={cardClass}>
              {inner}
            </Link>
          )
        })}
      </div>
    </section>
  )
}