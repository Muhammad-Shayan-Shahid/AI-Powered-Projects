import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
}

function recalcTotals(state) {
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { id, name, price, image, quantity = 1 } = action.payload
      const existing = state.items.find((item) => item.id === id)
      if (existing) {
        existing.quantity += quantity
      } else {
        state.items.push({ id, name, price, image, quantity })
      }
      recalcTotals(state)
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
      recalcTotals(state)
    },
    increaseQuantity(state, action) {
      const item = state.items.find((item) => item.id === action.payload)
      if (item) item.quantity += 1
      recalcTotals(state)
    },
    decreaseQuantity(state, action) {
      const item = state.items.find((item) => item.id === action.payload)
      if (item) {
        if (item.quantity <= 1) {
          state.items = state.items.filter((i) => i.id !== action.payload)
        } else {
          item.quantity -= 1
        }
      }
      recalcTotals(state)
    },
    clearCart(state) {
      state.items = []
      state.totalItems = 0
      state.totalPrice = 0
    },
    openCart(state) {
      state.isOpen = true
    },
    closeCart(state) {
      state.isOpen = false
    },
    toggleCart(state) {
      state.isOpen = !state.isOpen
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
} = cartSlice.actions
export default cartSlice.reducer
