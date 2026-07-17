import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin, Play, Clock } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import ShareButtons, { VerifiedBadge } from '../components/ShareButtons'
import { Seo } from '../components/HowToBuy'
import { craftImg, resolveMediaUrl } from '../lib/images'
import { api } from '../lib/api'

export default function ArtisanProfile() {
  const { id } = useParams()
  const [artisan, setArtisan] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getArtisan(id), api.getArtisanProducts(id)])
      .then(([a, p]) => {
        setArtisan(a)
        setProducts(p)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="h-96 bg-cream-dark rounded-sm animate-pulse" />
      </div>
    )
  }

  if (!artisan) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <p className="text-stone text-lg">Artisan not found.</p>
        <Link to="/marketplace" className="text-forest underline mt-4 inline-block">
          Back to marketplace
        </Link>
      </div>
    )
  }

  return (
    <>
      <Seo title={artisan.name} description={artisan.bio?.slice(0, 160)} image={artisan.photo_url} />
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={resolveMediaUrl(artisan.photo_url || craftImg('baskets', 1200))}
          alt={artisan.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-10">
          <p className="text-bead-light text-xs uppercase tracking-[0.2em] mb-2">
            {artisan.craft_specialty}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-cream flex flex-wrap items-center gap-3">
            {artisan.name}
            {artisan.verified && <VerifiedBadge className="!text-cream !bg-cream/20" />}
          </h1>
          <p className="flex items-center gap-2 text-cream/80 mt-3">
            <MapPin size={16} />
            {artisan.district}, South Western Uganda
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Bio */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl mb-4">About {artisan.name.split(' ')[0]}</h2>
            <p className="text-stone leading-relaxed text-lg whitespace-pre-line">
              {artisan.bio}
            </p>
            <div className="mt-6">
              <ShareButtons title={`${artisan.name} on Oweitu Made`} />
            </div>
          </div>

          <div className="space-y-6">
            {(artisan.workshop_hours || artisan.visit_notes) && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-sage to-parchment border border-border-warm card-elevated">
                <h3 className="font-serif text-lg mb-4">Plan your visit</h3>
                {artisan.workshop_hours && (
                  <p className="flex items-start gap-2 text-sm text-stone mb-3">
                    <Clock size={16} className="mt-0.5 shrink-0 text-forest" />
                    <span><strong className="text-charcoal">Hours:</strong> {artisan.workshop_hours}</span>
                  </p>
                )}
                {artisan.visit_notes && (
                  <p className="text-sm text-stone leading-relaxed whitespace-pre-line">{artisan.visit_notes}</p>
                )}
              </div>
            )}

          {/* Workshop video */}
          {artisan.workshop_video_url && (
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-bead mb-4 flex items-center gap-2">
                <Play size={14} />
                Workshop tour
              </h3>
              <div className="aspect-video rounded-2xl overflow-hidden bg-charcoal shadow-lg">
                <iframe
                  src={artisan.workshop_video_url}
                  title={`${artisan.name} workshop`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Map */}
        {artisan.map_embed_url && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl mb-6">Visit the workshop</h2>
            <div className="aspect-[21/9] md:aspect-[3/1] rounded-2xl overflow-hidden border border-border-warm shadow-lg">
              <iframe
                src={artisan.map_embed_url}
                title={`Map to ${artisan.name}'s workshop`}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}

        {/* Products */}
        <div className="mt-16">
          <h2 className="font-serif text-2xl mb-8">
            Crafts by {artisan.name.split(' ')[0]}
          </h2>
          {products.length === 0 ? (
            <p className="text-stone">No products listed yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    artisan_name: artisan.name,
                    artisan_district: artisan.district,
                    artisan_verified: artisan.verified,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}