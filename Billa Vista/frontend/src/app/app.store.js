import { configureStore } from '@reduxjs/toolkit'
import menuReducer from '@/features/menu/state/menu.slice'
import bookingReducer from '@/features/booking/state/booking.slice'
import adminReducer from '@/features/admin/state/admin.slice'
import cartReducer from '@/features/cart/state/cart.slice'

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    booking: bookingReducer,
    admin: adminReducer,
    cart: cartReducer,
  },
})
