/** African craft images — verified working URLs */
export const CRAFT_IMAGES = {
  beadwork:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZVBF365i0OOd15XPtt7rQ76WeP3Gf3tiwW-BlyAj-kA&s',
  figurines: 'https://images.unsplash.com/photo-1641582163466-e4d573078f98',
  baskets:
    'https://media.istockphoto.com/id/172134865/photo/a-series-of-hand-woven-african-sea-grass-baskets.webp?a=1&b=1&s=612x612&w=0&k=20&c=AfG7uah7eIRGox9edVaSqHT6TXykgod14-zRZYcES3Q=',
  bags: 'https://images.unsplash.com/photo-1692689383138-c2df3476072c',
  textiles: 'https://images.unsplash.com/photo-1630939516949-9e928211efa8',
  market: 'https://images.unsplash.com/photo-1692689386358-910e46764d20',
  fabrics: 'https://plus.unsplash.com/premium_photo-1765575812975-3e0190d674ae',
  fabricsDetail: 'https://images.unsplash.com/photo-1776841115715-0dd95378b89c',
}

/** Build a sized image URL (Unsplash only; others return as-is). */
export function craftImg(key, width = 800) {
  const base = CRAFT_IMAGES[key] || CRAFT_IMAGES.baskets
  if (base.includes('gstatic.com') || base.includes('istockphoto.com')) {
    return base
  }
  return `${base}?w=${width}&auto=format&fit=crop&q=80`
}

export const FALLBACK_PRODUCT = craftImg('baskets', 600)
export const FALLBACK_ARTISAN = craftImg('baskets', 600)
export const FALLBACK_HERO = craftImg('baskets', 1800)
