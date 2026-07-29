import { useDispatch, useSelector } from 'react-redux'
import {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
} from '@/features/cart/state/cart.slice'

export function useCart() {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)
  const totalItems = useSelector((state) => state.cart.totalItems)
  const totalPrice = useSelector((state) => state.cart.totalPrice)
  const isOpen = useSelector((state) => state.cart.isOpen)

  return {
    items,
    totalItems,
    totalPrice,
    isOpen,
    addToCart: (item) => dispatch(addToCart(item)),
    removeFromCart: (id) => dispatch(removeFromCart(id)),
    increaseQuantity: (id) => dispatch(increaseQuantity(id)),
    decreaseQuantity: (id) => dispatch(decreaseQuantity(id)),
    clearCart: () => dispatch(clearCart()),
    openCart: () => dispatch(openCart()),
    closeCart: () => dispatch(closeCart()),
    toggleCart: () => dispatch(toggleCart()),
  }
}
