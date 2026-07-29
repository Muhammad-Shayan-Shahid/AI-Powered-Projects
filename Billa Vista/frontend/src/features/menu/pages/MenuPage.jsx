import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Star, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useMenu } from '@/features/menu/hooks/useMenu'
import { useCart } from '@/features/cart/hooks/useCart'
import { formatCurrency, cn } from '@/lib/utils'

export default function MenuPage() {
  const { categories, filteredItems, activeCategory, selectCategory } = useMenu()
  const { addToCart } = useCart()

  const handleAddToCart = (item) => {
    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })
    toast.success(`${item.name} added to cart`)
  }

  const featured = filteredItems.find((item) => item.isAIRecommended) ?? filteredItems[0]
  const restItems = filteredItems.filter((item) => item.id !== featured?.id)

  return (
    <main className="container py-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" /> Freshly prepared, AI curated
        </span>
        <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl">
          Our <span className="text-primary">Menu</span>
        </h1>
        <p className="mt-4 text-muted">
          Bold flavors, plant-powered options, and chef signatures — reorder in one tap and skip the wait.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <motion.button
            key={category}
            whileTap={{ scale: 0.95 }}
            onClick={() => selectCategory(category)}
            className={cn(
              'min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              activeCategory === category
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-surface text-muted hover:text-white',
            )}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 grid grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-border bg-surface p-6 md:grid-cols-2 md:items-center"
        >
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-orange/20 px-3 py-1 text-xs font-semibold text-accent-orange">
              <Sparkles className="h-3 w-3" /> AI Recommended
            </span>
            <h2 className="mt-4 text-2xl font-bold">{featured.name}</h2>
            <p className="mt-2 text-sm text-muted">{featured.shortDescription}</p>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1 text-accent-orange">
                <Star className="h-3.5 w-3.5 fill-current" /> {featured.rating} ({featured.reviews})
              </span>
              <span>Ready in {featured.prepTime}</span>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <span className="text-2xl font-bold text-primary">{formatCurrency(featured.price)}</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => handleAddToCart(featured)}
                className="flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" /> Add to Cart
              </motion.button>
            </div>
          </div>
          <Link to={`/item/${featured.id}`} className="block overflow-hidden rounded-xl">
            <img src={featured.image} alt={featured.name} className="h-64 w-full object-cover md:h-80" />
          </Link>
        </motion.div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {restItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: (idx % 3) * 0.08 }}
            className="overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <Link to={`/item/${item.id}`} className="relative block">
              <img src={item.image} alt={item.name} className="h-44 w-full object-cover" />
              {item.isAIRecommended && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent-orange/90 px-2.5 py-1 text-[10px] font-semibold text-black">
                  AI RECOMMENDED
                </span>
              )}
            </Link>
            <div className="p-4">
              <Link to={`/item/${item.id}`}>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="mt-1 line-clamp-1 text-xs text-primary/80">{item.shortDescription}</p>
              </Link>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-primary">{formatCurrency(item.price)}</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddToCart(item)}
                  className="flex min-h-[36px] items-center gap-1 rounded-full border border-border px-3 text-xs font-semibold hover:bg-white hover:text-background"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  )
}
