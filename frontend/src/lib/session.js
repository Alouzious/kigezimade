import { resolveMediaUrl } from './images'

const SESSION_KEY = 'kigezimade_artisan_session'

export const artisanSession = {
  get() {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  getId() {
    return this.get()?.id || null
  },

  getToken() {
    return this.get()?.token || null
  },

  set(artisan, token) {
    const session = {
      id: artisan.id,
      name: artisan.name,
      email: artisan.email,
      token: token || this.getToken(),
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    localStorage.setItem('kigezimade_artisan_id', artisan.id)
  },

  clear() {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem('kigezimade_artisan_id')
  },

  isLoggedIn() {
    return Boolean(this.getId() && this.getToken())
  },
}

export function getProductImages(product) {
  if (product?.images?.length) {
    return product.images.map((img) => resolveMediaUrl(img.image_url)).filter(Boolean)
  }
  if (product?.image_url) return [resolveMediaUrl(product.image_url)]
  return []
}

export function getPrimaryImage(product, fallback) {
  const images = getProductImages(product)
  return images[0] || resolveMediaUrl(fallback) || fallback
}
