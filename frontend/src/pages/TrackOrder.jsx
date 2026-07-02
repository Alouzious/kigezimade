import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Package, Search } from 'lucide-react'
import Button from '../components/Button'
import { api, formatPrice } from '../lib/api'
import { orderStatusLabel, orderStatusStyle } from '../lib/orders'
import { Seo } from '../components/HowToBuy'

export default function TrackOrder() {
  const [searchParams] = useSearchParams()
  const [orderId, setOrderId] = useState(searchParams.get('order') || '')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const id = searchParams.get('order')
    if (id) setOrderId(id)
  }, [searchParams])

  const handleTrack = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const data = await api.trackOrder(orderId.trim())
      setOrder(data)
    } catch {
      setError('Order not found. Check your order ID from the confirmation email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <Seo title="Track Order" description="Track your Kigezi Made craft order." />
      <Package size={32} className="text-forest mb-4" />
      <h1 className="font-serif text-3xl mb-2">Track your order</h1>
      <p className="text-stone text-sm mb-8">Enter the order ID from your confirmation email.</p>

      <form onSubmit={handleTrack} className="flex gap-2 mb-8">
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Order ID (e.g. b1000000-...)"
          className="flex-1 px-4 py-3 border border-border rounded-sm text-sm"
          required
        />
        <Button type="submit" variant="primary" disabled={loading}>
          <Search size={16} />
        </Button>
      </form>

      {error && <p className="text-sm text-bead">{error}</p>}

      {order && (
        <div className="p-6 bg-white border border-border rounded-sm space-y-4">
          <div className="flex items-center gap-3">
            {order.product_image_url && <img src={order.product_image_url} alt="" className="w-16 h-16 object-cover rounded-sm" />}
            <div>
              <h2 className="font-serif text-lg">{order.product_name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-sm ${orderStatusStyle(order.status)}`}>
                {orderStatusLabel(order.status)}
              </span>
            </div>
          </div>
          <p className="text-forest font-medium">{formatPrice(order.total_price)} · Qty {order.quantity}</p>
          <p className="text-sm text-stone">
            The artisan will contact you at <strong>{order.buyer_phone}</strong> or {order.buyer_email}.
          </p>
          <p className="text-xs text-stone">Ordered {new Date(order.created_at).toLocaleString()}</p>
        </div>
      )}
    </div>
  )
}
