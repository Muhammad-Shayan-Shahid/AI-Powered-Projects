import { createSlice } from '@reduxjs/toolkit'

const todayIso = new Date().toISOString().slice(0, 10)

const initialState = {
  selectedDate: todayIso,
  selectedTime: '6:00 PM',
  guests: 2,
  seating: 'Indoor',
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setDate(state, action) {
      state.selectedDate = action.payload
    },
    setTime(state, action) {
      state.selectedTime = action.payload
    },
    setGuests(state, action) {
      state.guests = Math.max(1, action.payload)
    },
    incrementGuests(state) {
      state.guests += 1
    },
    decrementGuests(state) {
      state.guests = Math.max(1, state.guests - 1)
    },
    setSeating(state, action) {
      state.seating = action.payload
    },
    resetBooking() {
      return initialState
    },
  },
})

export const { setDate, setTime, setGuests, incrementGuests, decrementGuests, setSeating, resetBooking } =
  bookingSlice.actions
export default bookingSlice.reducer
