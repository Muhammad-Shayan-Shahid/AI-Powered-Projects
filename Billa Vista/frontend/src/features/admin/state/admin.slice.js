import { createSlice } from '@reduxjs/toolkit'
import { tables, reservations, adminStats } from '@/lib/data'

const initialState = {
  tables,
  reservations,
  stats: adminStats,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setTableStatus(state, action) {
      const { id, status, guestName } = action.payload
      const table = state.tables.find((t) => t.id === id)
      if (table) {
        table.status = status
        table.guestName = status === 'available' ? null : guestName ?? table.guestName
      }
    },
    setReservationStatus(state, action) {
      const { id, status } = action.payload
      const reservation = state.reservations.find((r) => r.id === id)
      if (reservation) {
        reservation.status = status
      }
    },
  },
})

export const { setTableStatus, setReservationStatus } = adminSlice.actions
export default adminSlice.reducer
