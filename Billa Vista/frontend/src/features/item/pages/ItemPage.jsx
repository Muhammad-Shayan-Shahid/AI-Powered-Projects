import { useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Minus, Plus, Star, Bookmark, Check, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { menuItems } from '@/lib/data'
import { cn, formatCurrency } from '@/lib/utils'
import { useCart } from '@/features/cart/hooks/useCart'

export default function ItemPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const item = menuItems.find((i) => i.id === id) ?? menuItems[0]
  const { addToCart } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(
    item.sizes?.find((s) => s.delta === 0)?.label ?? item.sizes?.[0]?.label,
  )
  const [selectedExtras, setSelectedExtras] = useState([])

  const related = useMemo(
    () => menuItems.filter((i) => i.category === item.category && i.id !== item.id).slice(0, 4),
    [item],
  )

  const sizeDelta = item.sizes?.find((s) => s.label === selectedSize)?.delta ?? 0
  const extrasTotal = selectedExtras.reduce((sum, label) => {
    const extra = item.extras?.find((e) => e.label === label)
    return sum + (extra?.price ?? 0)
  }, 0)
  const unitPrice = item.price + sizeDelta + extrasTotal
  const total = unitPrice * quantity

  const toggleExtra = (label) => {
    setSelectedExtras((prev) =>
      prev.includes(label) ? prev.filter((e) => e !== label) : [...prev, label],
    )
  }

  const handleAddToCart = () => {
    addToCart({ id: item.id, name: item.name, price: unitPrice, image: item.image, quantity })
    toast.success(`${item.name} added to cart · ${formatCurrency(total)}`)
  }

  const handleSaveForLater = () => {
    toast.success(`${item.name} saved for later`)
  }

  return (
    <main className="container py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-muted hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Menu
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-border"
        >
          {item.isAIRecommended && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-accent-orange px-3 py-1 text-[11px] font-semibold text-black">
              AI Recommended
            </span>
          )}
          <motion.img
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            src={item.image}
            alt={item.name}
            className="aspect-square w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="h-fit rounded-2xl border border-border bg-surface p-6"
        >
          <h2 className="text-sm font-semibold text-muted">Order Summary</h2>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm">Quantity</span>
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border"
              >
                <Minus className="h-3.5 w-3.5" />
              </motion.button>
              <span className="w-4 text-center font-semibold">{quantity}</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border"
              >
                <Plus className="h-3.5 w-3.5" />
              </motion.button>
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted">
              <span>Base ({selectedSize})</span>
              <span>{formatCurrency(item.price + sizeDelta)}</span>
            </div>
            {selectedExtras.map((label) => {
              const extra = item.extras?.find((e) => e.label === label)
              return (
                <div key={label} className="flex justify-between text-muted">
                  <span>{label}</span>
                  <span>+{formatCurrency(extra?.price ?? 0)}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={handleAddToCart}
            className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-white"
          >
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSaveForLater}
            className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold text-muted hover:text-white"
          >
            <Bookmark className="h-4 w-4" /> Save for Later
          </motion.button>
        </motion.div>
      </div>

      <div className="mt-10 max-w-3xl">
        <h1 className="text-3xl font-bold">{item.name}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 text-accent-orange">
            <Star className="h-4 w-4 fill-current" /> {item.rating} ({item.reviews} reviews)
          </span>
          <span className="text-xl font-bold text-primary">{formatCurrency(item.price)}</span>
        </div>
        <p className="mt-4 text-muted">{item.description}</p>

        {item.sizes?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold">Choose Size</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.sizes.map((size) => (
                <motion.button
                  key={size.label}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSize(size.label)}
                  className={cn(
                    'min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors',
                    selectedSize === size.label
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-surface text-muted hover:text-white',
                  )}
                >
                  {size.label} {size.delta !== 0 && (size.delta > 0 ? `+$${size.delta}` : `-$${Math.abs(size.delta)}`)}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {item.extras?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold">Add Extras</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.extras.map((extra) => {
                const isSelected = selectedExtras.includes(extra.label)
                return (
                  <motion.button
                    key={extra.label}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleExtra(extra.label)}
                    className={cn(
                      'flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors',
                      isSelected
                        ? 'border-primary bg-primary/10 text-white'
                        : 'border-border bg-surface text-muted hover:text-white',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded-full border',
                        isSelected ? 'border-primary bg-primary' : 'border-border',
                      )}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                    </span>
                    {extra.label} +${extra.price.toFixed(2)}
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-bold">You might also like</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((rel, idx) => (
              <motion.div
                key={rel.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Link
                  to={`/item/${rel.id}`}
                  className="block overflow-hidden rounded-xl border border-border bg-surface"
                >
                  <img src={rel.image} alt={rel.name} className="h-32 w-full object-cover sm:h-36" />
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold">{rel.name}</p>
                    <p className="mt-1 font-bold text-primary">{formatCurrency(rel.price)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
