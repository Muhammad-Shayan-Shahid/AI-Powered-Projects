import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/features/cart/hooks/useCart'
import { formatCurrency } from '@/lib/utils'

export default function CartDrawer() {
  const {
    items,
    totalPrice,
    isOpen,
    closeCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart()

  const handleCheckout = () => {
    toast.success('Order placed successfully!')
    clearCart()
    closeCart()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/60"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border bg-surface"
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <ShoppingBag className="h-5 w-5 text-primary" /> Your Cart
              </h2>
              <button
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background">
                  <ShoppingCart className="h-7 w-7 text-muted" />
                </span>
                <p className="font-semibold">Your cart is empty</p>
                <p className="text-sm text-muted">Add some delicious dishes to get started.</p>
              </div>
            ) : (
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{item.name}</p>
                        <p className="text-sm text-primary">{formatCurrency(item.price)}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => decreaseQuantity(item.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </motion.button>
                          <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => increaseQuantity(item.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </motion.button>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item.id)}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-muted hover:text-red-400"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {items.length > 0 && (
              <div className="border-t border-border p-5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(totalPrice)}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={handleCheckout}
                  className="mt-4 min-h-[44px] w-full rounded-full bg-primary text-sm font-semibold text-white"
                >
                  Checkout
                </motion.button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
