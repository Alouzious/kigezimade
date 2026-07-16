/** African craft images — local copies preferred (stable, no broken gstatic thumbs) */
export const CRAFT_IMAGES = {
  beadwork: '/images/beadwork-rukiga.png',
  drums: '/images/drums.jpg',
  barkcloth: '/images/bark2.jpg',
  barkclothProcess: '/images/bark3.jpg',
  barkclothWide: '/images/bark1.jpg',
  figurines: 'https://images.unsplash.com/photo-1641582163466-e4d573078f98',
  baskets:
    'https://media.istockphoto.com/id/172134865/photo/a-series-of-hand-woven-african-sea-grass-baskets.webp?a=1&b=1&s=612x612&w=0&k=20&c=AfG7uah7eIRGox9edVaSqHT6TXykgod14-zRZYcES3Q=',
  bags: 'https://images.unsplash.com/photo-1692689383138-c2df3476072c',
  textiles: 'https://images.unsplash.com/photo-1630939516949-9e928211efa8',
  market: 'https://images.unsplash.com/photo-1692689386358-910e46764d20',
  fabrics: 'https://plus.unsplash.com/premium_photo-1765575812975-3e0190d674ae',
  fabricsDetail: 'https://images.unsplash.com/photo-1776841115715-0dd95378b89c',
  cloth: 'https://garlandmag.com/wp-content/uploads/2024/05/IMG_9891-2.jpg',
  cowhide: '/images/cowhide-pouch-alt.jpg',
  cowhideEarrings: '/images/cowhide-earrings.jpg',
}

/** Turn app-relative /images/... into a full URL the browser can load. */
export function resolveMediaUrl(url) {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:')) return url
  const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/')
  const path = url.startsWith('/') ? url.slice(1) : url
  return `${base}${path}`
}

/** Build a sized image URL (Unsplash only; locals/other CDNs return as-is). */
export function craftImg(key, width = 800) {
  const base = CRAFT_IMAGES[key] || CRAFT_IMAGES.baskets
  const resolved = resolveMediaUrl(base)
  if (
    base.startsWith('/') ||
    base.includes('gstatic.com') ||
    base.includes('istockphoto.com') ||
    base.includes('garlandmag.com') ||
    base.includes('theugandablog.com') ||
    base.includes('njabala.com')
  ) {
    return resolved
  }
  return `${base}?w=${width}&auto=format&fit=crop&q=80`
}

export const FALLBACK_PRODUCT = craftImg('baskets', 600)
export const FALLBACK_ARTISAN = craftImg('baskets', 600)
export const FALLBACK_HERO = craftImg('baskets', 1800)
