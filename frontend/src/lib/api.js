const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request(path, options = {}) {
  const session = (() => {
    try {
      const raw = localStorage.getItem('kigezimade_artisan_session')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })()

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }

  return res.json()
}

export const api = {
  getArtisans: () => request('/api/artisans'),
  getFeaturedArtisans: () => request('/api/artisans/featured'),
  getArtisan: (id) => request(`/api/artisans/${id}`),
  getArtisanProducts: (id) => request(`/api/artisans/${id}/products`),
  createArtisan: (data) =>
    request('/api/artisans', { method: 'POST', body: JSON.stringify(data) }),

  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  forgotPassword: (email) =>
    request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token, password) =>
    request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),

  trackOrder: (id) => request(`/api/orders/track/${id}`),

  submitReport: (data) =>
    request('/api/reports', { method: 'POST', body: JSON.stringify(data) }),

  duplicateProduct: (artisanId, productId) =>
    request(`/api/artisans/${artisanId}/products/${productId}/duplicate`, {
      method: 'POST',
    }),

  getDashboard: (artisanId) => request(`/api/artisans/${artisanId}/dashboard`),
  createArtisanProduct: (artisanId, data) =>
    request(`/api/artisans/${artisanId}/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateArtisanProduct: (artisanId, productId, data) =>
    request(`/api/artisans/${artisanId}/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteArtisanProduct: (artisanId, productId) =>
    request(`/api/artisans/${artisanId}/products/${productId}`, {
      method: 'DELETE',
    }),
  updateArtisan: (id, data) =>
    request(`/api/artisans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getArtisanOrders: (artisanId) => request(`/api/artisans/${artisanId}/orders`),
  updateOrderStatus: (artisanId, orderId, status) =>
    request(`/api/artisans/${artisanId}/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  getProducts: (params = {}) => {
    const query = new URLSearchParams()
    if (params.category) query.set('category', params.category)
    if (params.district) query.set('district', params.district)
    if (params.search) query.set('search', params.search)
    const qs = query.toString()
    return request(`/api/products${qs ? `?${qs}` : ''}`)
  },
  getProduct: (id) => request(`/api/products/${id}`),
  createProduct: (data) =>
    request('/api/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) =>
    request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) =>
    request(`/api/products/${id}`, { method: 'DELETE' }),

  createOrder: (data) =>
    request('/api/orders', { method: 'POST', body: JSON.stringify(data) }),

  getStory: (productId) => request(`/api/ai/products/${productId}/story`),
  generateStory: (productId) =>
    request(`/api/ai/products/${productId}/story`, { method: 'POST' }),
  translateStory: (productId, languageCode) =>
    request(`/api/ai/products/${productId}/story/translate`, {
      method: 'POST',
      body: JSON.stringify({ language_code: languageCode }),
    }),
}

export function formatPrice(amount) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0,
  }).format(num)
}

export const CATEGORIES = [
  { value: 'all', label: 'All crafts' },
  { value: 'baskets', label: 'Baskets' },
  { value: 'beadwork', label: 'Beadwork' },
  { value: 'drums', label: 'Drums' },
  { value: 'barkcloth', label: 'Barkcloth' },
  { value: 'wooden', label: 'Wooden pieces' },
]

export const PRODUCT_CATEGORIES = CATEGORIES.filter((c) => c.value !== 'all')

export const DISTRICTS = [
  { value: 'all', label: 'All districts' },
  { value: 'Kabale', label: 'Kabale' },
  { value: 'Kisoro', label: 'Kisoro' },
  { value: 'Kanungu', label: 'Kanungu' },
  { value: 'Rukiga', label: 'Rukiga' },
]

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'sw', label: 'Kiswahili' },
]
