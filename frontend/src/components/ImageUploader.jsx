import { useState } from 'react'
import { ImagePlus, Link2, Trash2, ChevronUp, ChevronDown, Upload } from 'lucide-react'
import { cn } from '../lib/utils'

export default function ImageUploader({ images = [], onChange, className }) {
  const [urlInput, setUrlInput] = useState('')
  const [error, setError] = useState('')

  const update = (next) => onChange(next.filter(Boolean))

  const addUrl = () => {
    const url = urlInput.trim()
    if (!url) return
    if (!url.startsWith('http') && !url.startsWith('data:')) {
      setError('Enter a valid image URL (https://...)')
      return
    }
    setError('')
    update([...images, url])
    setUrlInput('')
  }

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return
      if (file.size > 2 * 1024 * 1024) {
        setError('Images must be under 2MB. Use a URL for larger files.')
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        update([...images, reader.result])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const remove = (index) => update(images.filter((_, i) => i !== index))

  const move = (index, direction) => {
    const next = [...images]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    update(next)
  }

  return (
    <div className={cn('space-y-4', className)}>
      <label className="block text-sm font-medium text-charcoal">
        Product images
      </label>
      <p className="text-xs text-stone">
        Add multiple photos. Paste links or upload from your device.
        First image is the cover shown in the marketplace.
      </p>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((src, i) => (
            <div key={`${src.slice(0, 32)}-${i}`} className="relative group aspect-square rounded-sm overflow-hidden border border-border bg-cream-dark">
              <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] uppercase tracking-wider bg-forest text-cream rounded-sm">
                  Cover
                </span>
              )}
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                <button type="button" onClick={() => move(i, -1)} className="p-1.5 bg-cream/90 rounded-sm" aria-label="Move up">
                  <ChevronUp size={14} />
                </button>
                <button type="button" onClick={() => move(i, 1)} className="p-1.5 bg-cream/90 rounded-sm" aria-label="Move down">
                  <ChevronDown size={14} />
                </button>
                <button type="button" onClick={() => remove(i)} className="p-1.5 bg-bead text-cream rounded-sm" aria-label="Remove">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
            placeholder="Paste image URL..."
            className="w-full pl-10 pr-4 py-3 border border-border rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>
        <button
          type="button"
          onClick={addUrl}
          className="px-4 py-3 border border-border rounded-sm bg-white hover:bg-cream-dark transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <ImagePlus size={16} />
          Add
        </button>
      </div>

      <label className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-border rounded-sm cursor-pointer hover:border-forest hover:bg-forest/5 transition-colors text-sm text-stone">
        <Upload size={16} />
        Upload from device
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
      </label>

      {error && <p className="text-sm text-bead">{error}</p>}
    </div>
  )
}
