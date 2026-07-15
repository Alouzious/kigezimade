import { Link } from 'react-router-dom'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { DISTRICTS } from '../lib/api'
import { craftImg } from '../lib/images'

const districtImages = {
  Kabale: craftImg('baskets', 600),
  Kisoro: craftImg('drums', 600),
  Kanungu: craftImg('bags', 600),
  Rukiga: craftImg('beadwork', 600),
  Rubanda: craftImg('textiles', 600),
}

export default function DistrictExplore({ onSelect }) {
  const districts = DISTRICTS.filter((d) => d.value !== 'all')

  const cardClass = 'group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-400 hover:-translate-y-1'

  return (
    <section>
      <p className="label-kicker mb-3">Explore Kigezi</p>
      <h2 className="heading-display text-2xl md:text-4xl mb-8">Browse by district</h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
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
