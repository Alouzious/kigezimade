import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, ArrowLeft, MapPin } from 'lucide-react'
import Button from '../components/Button'
import { Seo } from '../components/HowToBuy'
import { cn } from '../lib/utils'

/** Replace these after your YouTube uploads are ready */
const KISORO_VIDEO_ID = 'SFNU1Ebf9M8'
const BUNYONYI_VIDEO_ID = 'SFNU1Ebf9M8'

const journeys = [
  {
    id: 'kisoro',
    videoId: KISORO_VIDEO_ID,
    title: 'Kisoro Exploration',
    tag: 'Kisoro · Virunga foothills',
    description:
      'Walk the misty hills of Kisoro at the base of the Virunga volcanoes. Meet drum makers, hear ceremony and song, and feel the culture of the highlands.',
  },
  {
    id: 'bunyonyi',
    videoId: BUNYONYI_VIDEO_ID,
    title: 'Explore Lake Bunyonyi',
    tag: 'Kabale · Lake Bunyonyi',
    description:
      'Discover Uganda\'s deepest lake and its green islands. Quiet waters, hilltop crafts, and the living landscapes that shape Kabale and Bunyonyi life.',
  },
]

function VideoCard({ journey }) {
  const [playing, setPlaying] = useState(false)
  const thumb = `https://img.youtube.com/vi/${journey.videoId}/maxresdefault.jpg`
  const embed = `https://www.youtube.com/embed/${journey.videoId}?autoplay=1&rel=0`

  return (
    <article className="card-elevated rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-400 group">
      <div className="relative aspect-video bg-parchment-deep overflow-hidden">
        {playing ? (
          <iframe
            src={embed}
            title={journey.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full text-left cursor-pointer"
            aria-label={`Play ${journey.title}`}
          >
            <img
              src={thumb}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = `https://img.youtube.com/vi/${journey.videoId}/hqdefault.jpg`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-forest/20 to-transparent" />
            <span
              className={cn(
                'absolute inset-0 flex items-center justify-center',
              )}
            >
              <span className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-cream/95 text-forest shadow-xl shadow-forest/30 group-hover:scale-110 group-hover:bg-amber-light transition-all duration-300">
                <Play size={28} className="ml-1 fill-current" />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="p-6 md:p-7 bg-gradient-to-b from-cream to-parchment">
        <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-bead font-bold mb-2">
          <MapPin size={12} />
          {journey.tag}
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal">
          {journey.title}
        </h2>
        <p className="text-sm md:text-base text-stone mt-3 leading-relaxed">
          {journey.description}
        </p>
        {!playing && (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-bead transition-colors"
          >
            <Play size={16} className="fill-current" />
            Watch journey
          </button>
        )}
      </div>
    </article>
  )
}

export default function Explore() {
  return (
    <div>
      <div className="bg-section-forest text-cream py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <Seo
            title="Explore Kigezi"
            description="Discover Kisoro and Lake Bunyonyi through featured video journeys from Southwest Uganda."
          />
          <p className="text-xs uppercase tracking-[0.25em] text-amber-light font-bold mb-3">
            Featured journeys
          </p>
          <h1 className="heading-display text-4xl md:text-6xl text-cream max-w-2xl">
            Explore Kigezi
          </h1>
          <p className="text-cream/85 mt-4 max-w-2xl leading-relaxed text-lg">
            Discover the nature and culture of Southwest Uganda through our featured journeys.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {journeys.map((journey) => (
            <VideoCard key={journey.id} journey={journey} />
          ))}
        </div>

        <div className="mt-14 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-border-warm">
          <p className="text-sm text-stone max-w-md leading-relaxed">
            Scan a QR code to return here anytime. When you are ready, meet the makers in our marketplace.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button to="/" variant="outline" size="sm">
              <ArrowLeft size={16} />
              Back home
            </Button>
            <Button to="/marketplace" variant="primary" size="sm">
              Browse crafts
            </Button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-stone-light">
          <Link to="/" className="hover:text-forest transition-colors">
            Kigezi Made
          </Link>
          {' · '}
          Kabale · Kisoro · Kanungu · Rukiga · Rubanda
        </p>
      </div>
    </div>
  )
}
