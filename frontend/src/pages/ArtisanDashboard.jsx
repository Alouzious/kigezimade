import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  X,
  ShoppingBag,
  User,
  MessageCircle,
  Phone,
  Mail,
  Copy,
  Eye,
} from 'lucide-react'
import Button from '../components/Button'
import ImageUploader from '../components/ImageUploader'
import ImageCarousel from '../components/ImageCarousel'
import { api, formatPrice, PRODUCT_CATEGORIES, DISTRICTS } from '../lib/api'
import { artisanSession, getProductImages } from '../lib/session'
import {
  ORDER_STATUSES,
  orderStatusLabel,
  orderStatusStyle,
  whatsappLink,
} from '../lib/orders'

const TABS = [
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'profile', label: 'Shop profile', icon: User },
]

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  category: 'baskets',
  image_urls: [],
  availability: 'in_stock',
}

export default function ArtisanDashboard() {
  const { artisanId: paramId } = useParams()
  const navigate = useNavigate()
  const session = artisanSession.get()
  const artisanId = paramId || session?.id

  const [tab, setTab] = useState('products')
  const [dashboard, setDashboard] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const [profileForm, setProfileForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadDashboard = () => {
    if (!artisanId) return
    setLoading(true)
    api.getDashboard(artisanId).then(setDashboard).catch(console.error).finally(() => setLoading(false))
  }

  const loadOrders = () => {
    if (!artisanId) return
    setOrdersLoading(true)
    api.getArtisanOrders(artisanId).then(setOrders).catch(console.error).finally(() => setOrdersLoading(false))
  }

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true })
      return
    }
    if (paramId && paramId !== session.id) {
      navigate(`/dashboard/${session.id}`, { replace: true })
      return
    }
    loadDashboard()
    loadOrders()
  }, [artisanId, paramId, session?.id])

  useEffect(() => {
    if (dashboard?.artisan && !profileForm) {
      setProfileForm({
        name: dashboard.artisan.name,
        bio: dashboard.artisan.bio,
        district: dashboard.artisan.district,
        craft_specialty: dashboard.artisan.craft_specialty,
        phone: dashboard.artisan.phone || '',
        photo_url: dashboard.artisan.photo_url,
        workshop_video_url: dashboard.artisan.workshop_video_url,
        map_embed_url: dashboard.artisan.map_embed_url,
        visit_notes: dashboard.artisan.visit_notes || '',
        workshop_hours: dashboard.artisan.workshop_hours || '',
      })
    }
  }, [dashboard])

  const openCreate = () => {
    setForm(emptyProduct)
    setModal('create')
    setError('')
  }

  const openEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      image_urls: getProductImages(product),
      availability: product.availability || 'in_stock',
    })
    setModal({ type: 'edit', id: product.id })
    setError('')
  }

  const handleSaveProduct = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Product name is required')
    if (form.image_urls.length === 0) return setError('Add at least one product image')

    setSaving(true)
    setError('')
    const payload = {
      name: form.name.trim(),
      description: form.description,
      price: Number(form.price),
      category: form.category,
      image_urls: form.image_urls,
      availability: form.availability,
    }

    try {
      if (modal === 'create') {
        await api.createArtisanProduct(artisanId, payload)
      } else {
        await api.updateArtisanProduct(artisanId, modal.id, payload)
      }
      setModal(null)
      loadDashboard()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.updateArtisan(artisanId, profileForm)
      loadDashboard()
      setError('')
      alert('Profile updated successfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDuplicate = async (productId) => {
    try {
      await api.duplicateProduct(artisanId, productId)
      loadDashboard()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    try {
      await api.deleteArtisanProduct(artisanId, productId)
      loadDashboard()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.updateOrderStatus(artisanId, orderId, status)
      loadOrders()
      loadDashboard()
    } catch (err) {
      alert(err.message)
    }
  }

  if (!session) return null

  if (loading && !dashboard) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-6">
        <div className="h-32 bg-cream-dark rounded-sm animate-pulse" />
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <p className="text-stone">Dashboard not found.</p>
        <Button to="/login" variant="primary" className="mt-6">Sign in</Button>
      </div>
    )
  }

  const { artisan, products, stats } = dashboard

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-5">
          {artisan.photo_url ? (
            <img src={artisan.photo_url} alt={artisan.name} className="w-16 h-16 rounded-full object-cover border-2 border-border" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center">
              <User size={24} className="text-forest" />
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-bead mb-1">Seller dashboard</p>
            <h1 className="font-serif text-3xl text-charcoal">{artisan.name}</h1>
            <p className="text-stone text-sm">{artisan.district} · {artisan.craft_specialty || 'Artisan'}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button to={`/artisans/${artisan.id}`} variant="outline" size="sm">
            <ExternalLink size={14} /> View shop
          </Button>
          {tab === 'products' && (
            <Button onClick={openCreate} variant="secondary" size="sm">
              <Plus size={14} /> Add product
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="p-5 bg-white border border-border rounded-sm">
          <p className="text-2xl font-serif">{stats.total_products}</p>
          <p className="text-xs text-stone mt-1">Products</p>
        </div>
        <div className="p-5 bg-white border border-border rounded-sm">
          <p className="text-2xl font-serif">{stats.pending_orders}</p>
          <p className="text-xs text-stone mt-1">New orders</p>
        </div>
        <div className="p-5 bg-white border border-border rounded-sm">
          <p className="text-2xl font-serif">{stats.total_orders}</p>
          <p className="text-xs text-stone mt-1">Total orders</p>
        </div>
        <div className="p-5 bg-white border border-border rounded-sm">
          <p className="text-2xl font-serif flex items-center gap-1">
            <Eye size={18} className="text-forest" />
            {stats.total_views ?? 0}
          </p>
          <p className="text-xs text-stone mt-1">Product views</p>
        </div>
        <div className="p-5 bg-white border border-border rounded-sm col-span-2 lg:col-span-1">
          <p className="text-sm font-serif truncate">{stats.top_product || 'None yet'}</p>
          <p className="text-xs text-stone mt-1">Most viewed craft</p>
        </div>
        <div className="p-5 bg-forest text-cream rounded-sm col-span-2 lg:col-span-1">
          <p className="text-lg font-serif">{formatPrice(stats.total_value)}</p>
          <p className="text-xs text-cream/70 mt-1">Catalog value</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
              tab === id
                ? 'border-forest text-forest'
                : 'border-transparent text-stone hover:text-charcoal'
            }`}
          >
            <Icon size={16} />
            {label}
            {id === 'orders' && stats.pending_orders > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-bead text-cream">
                {stats.pending_orders}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Products tab */}
      {tab === 'products' && (
        <>
          <p className="text-stone text-sm mb-6">
            Manage your crafts: set prices, upload multiple photos, and edit anytime.
            The first photo is your cover image in the marketplace.
          </p>
          {products.length === 0 ? (
            <div className="text-center py-20 bg-cream-dark rounded-sm border border-border">
              <Package size={32} className="mx-auto text-stone mb-4" />
              <p className="text-stone mb-6">No products yet. Add your first craft to start selling.</p>
              <Button onClick={openCreate} variant="primary"><Plus size={16} /> Add product</Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white border border-border rounded-sm overflow-hidden">
                  <ImageCarousel images={getProductImages(product)} alt={product.name} aspect="aspect-[4/3]" />
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-widest text-bead">{product.category}</p>
                    <h3 className="font-serif text-lg mt-1">{product.name}</h3>
                    <p className="text-forest font-medium mt-2">{formatPrice(product.price)}</p>
                    <p className="text-sm text-stone mt-2 line-clamp-2">{product.description}</p>
                    {product.view_count > 0 && (
                      <p className="text-xs text-stone mt-2 flex items-center gap-1">
                        <Eye size={12} /> {product.view_count} views
                      </p>
                    )}
                    <div className="flex gap-2 mt-4 flex-wrap">
                      <button type="button" onClick={() => openEdit(product)} className="flex-1 min-w-[80px] flex items-center justify-center gap-1 py-2 text-sm border border-border rounded-sm hover:bg-cream-dark">
                        <Pencil size={14} /> Edit
                      </button>
                      <button type="button" onClick={() => handleDuplicate(product.id)} className="flex items-center justify-center gap-1 px-3 py-2 text-sm border border-border rounded-sm hover:bg-cream-dark" title="Duplicate product">
                        <Copy size={14} />
                      </button>
                      <Link to={`/products/${product.id}`} className="flex-1 flex items-center justify-center gap-1 py-2 text-sm border border-border rounded-sm hover:bg-cream-dark">
                        <ExternalLink size={14} /> View
                      </Link>
                      <button type="button" onClick={() => handleDelete(product.id)} className="p-2 border border-border rounded-sm text-bead hover:bg-bead/10">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Orders tab */}
      {tab === 'orders' && (
        <>
          <p className="text-stone text-sm mb-6">
            When a tourist orders, you get an email and see their WhatsApp here.
            Contact them to arrange payment and delivery.
          </p>
          {ordersLoading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => <div key={n} className="h-32 bg-cream-dark rounded-sm animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-cream-dark rounded-sm border border-border">
              <ShoppingBag size={32} className="mx-auto text-stone mb-4" />
              <p className="text-stone">No orders yet. They will appear here when someone buys your crafts.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const wa = whatsappLink(
                  order.buyer_phone,
                  `Hello ${order.buyer_name}, thank you for ordering ${order.product_name} from Kigezi Made!`,
                )
                return (
                  <div key={order.id} className="bg-white border border-border rounded-sm p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {order.product_image_url && (
                        <img src={order.product_image_url} alt="" className="w-20 h-20 object-cover rounded-sm shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="font-serif text-lg">{order.product_name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-sm uppercase tracking-wider ${orderStatusStyle(order.status)}`}>
                            {orderStatusLabel(order.status)}
                          </span>
                        </div>
                        <p className="text-forest font-medium">{formatPrice(order.total_price)} · Qty {order.quantity}</p>
                        <p className="text-xs text-stone mt-1">
                          {new Date(order.created_at).toLocaleString()}
                        </p>

                        <div className="mt-4 p-4 bg-cream-dark rounded-sm space-y-2 text-sm">
                          <p className="font-medium text-charcoal">Buyer: {order.buyer_name}</p>
                          <p className="flex items-center gap-2 text-stone">
                            <Mail size={14} />
                            <a href={`mailto:${order.buyer_email}`} className="hover:text-forest">{order.buyer_email}</a>
                          </p>
                          <p className="flex items-center gap-2 text-stone">
                            <Phone size={14} />
                            {order.buyer_phone}
                          </p>
                          {order.buyer_message && (
                            <p className="flex items-start gap-2 text-stone">
                              <MessageCircle size={14} className="mt-0.5 shrink-0" />
                              {order.buyer_message}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {wa && (
                            <a
                              href={wa}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-sm font-medium rounded-sm hover:opacity-90"
                            >
                              <MessageCircle size={16} />
                              WhatsApp buyer
                            </a>
                          )}
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="px-3 py-2 border border-border rounded-sm text-sm bg-white"
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Profile tab */}
      {tab === 'profile' && profileForm && (
        <>
          <p className="text-stone text-sm mb-6">
            Update your public shop profile. Tourists see this on your artisan page.
          </p>
          <form onSubmit={handleSaveProfile} className="max-w-2xl space-y-5 bg-white border border-border rounded-sm p-6 md:p-8">
            <div>
              <label className="block text-sm font-medium mb-2">Display name</label>
              <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full px-4 py-3 border border-border rounded-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Your WhatsApp / phone</label>
              <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="+256 700 000000" className="w-full px-4 py-3 border border-border rounded-sm" />
              <p className="text-xs text-stone mt-1">Shown on your profile so tourists can reach you directly.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">District</label>
              <select value={profileForm.district} onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })} className="w-full px-4 py-3 border border-border rounded-sm">
                {DISTRICTS.filter((d) => d.value !== 'all').map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Your story</label>
              <textarea rows={4} value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} className="w-full px-4 py-3 border border-border rounded-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Workshop hours</label>
              <input value={profileForm.workshop_hours} onChange={(e) => setProfileForm({ ...profileForm, workshop_hours: e.target.value })} placeholder="Mon–Sat 9am–5pm" className="w-full px-4 py-3 border border-border rounded-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Visit notes for tourists</label>
              <textarea rows={3} value={profileForm.visit_notes} onChange={(e) => setProfileForm({ ...profileForm, visit_notes: e.target.value })} placeholder="Directions, what to bring, best time to visit..." className="w-full px-4 py-3 border border-border rounded-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Profile photo URL</label>
              <input type="url" value={profileForm.photo_url} onChange={(e) => setProfileForm({ ...profileForm, photo_url: e.target.value })} className="w-full px-4 py-3 border border-border rounded-sm" />
            </div>
            {error && <p className="text-sm text-bead">{error}</p>}
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save profile'}
            </Button>
          </form>
        </>
      )}

      {/* Product modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
          <div className="bg-cream w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-cream">
              <h3 className="font-serif text-xl">{modal === 'create' ? 'Add new product' : 'Edit product'}</h3>
              <button type="button" onClick={() => setModal(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Product name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-border rounded-sm bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 border border-border rounded-sm bg-white">
                  {PRODUCT_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price (UGX) *</label>
                <input type="number" required min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-3 border border-border rounded-sm bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Availability</label>
                <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} className="w-full px-4 py-3 border border-border rounded-sm bg-white">
                  <option value="in_stock">In stock (ready to ship)</option>
                  <option value="made_to_order">Made to order (crafted after you order)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 border border-border rounded-sm bg-white resize-none" />
              </div>
              <p className="text-xs text-stone -mb-2">
                Photo tip: use natural light, show your hands at work, and include close-ups of texture. First photo is your marketplace cover.
              </p>
              <ImageUploader images={form.image_urls} onChange={(image_urls) => setForm({ ...form, image_urls })} />
              {error && <p className="text-sm text-bead">{error}</p>}
              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setModal(null)} className="flex-1">Cancel</Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={saving}>{saving ? 'Saving...' : 'Save product'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
