export function whatsappLink(phone, message = '') {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits}${text}`
}

export const ORDER_STATUSES = [
  { value: 'pending', label: 'New', color: 'bg-bead/15 text-bead' },
  { value: 'contacted', label: 'Contacted', color: 'bg-amber-100 text-amber-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-forest/15 text-forest' },
  { value: 'completed', label: 'Completed', color: 'bg-stone/15 text-stone' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-charcoal/10 text-charcoal' },
]

export function orderStatusStyle(status) {
  return ORDER_STATUSES.find((s) => s.value === status)?.color || 'bg-stone/15 text-stone'
}

export function orderStatusLabel(status) {
  return ORDER_STATUSES.find((s) => s.value === status)?.label || status
}
